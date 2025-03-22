import { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Save, X, Clock, Search, Filter, Tag, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';
import { DeletePostModal } from '@/components/delete-post-modal';

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  image: string | null;
  author: string;
  author_image: string | null;
  category: string | null;
  read_time: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  details: string;
  created_at: string;
}

// Récupérer l'utilisateur connecté depuis le localStorage
function getCurrentUser() {
  try {
    const userJson = localStorage.getItem('autom8_user');
    console.log('Contenu du localStorage (autom8_user):', userJson);
    if (userJson) {
      const user = JSON.parse(userJson);
      console.log('Utilisateur parsé:', user);
      return user;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

export function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser();
      // Vérifier si l'utilisateur existe, sans nécessairement vérifier le rôle exact
      if (user) {
        console.log('Utilisateur connecté:', user);
        setIsAuthenticated(true);
        setAuthError(null);
        // Charger les articles immédiatement après avoir confirmé l'authentification
        await fetchPosts();
      } else {
        console.log('Aucun utilisateur connecté');
        setIsAuthenticated(false);
        setAuthError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette page.");
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    // Extraire toutes les catégories uniques
    if (posts.length > 0) {
      const uniqueCategories = Array.from(
        new Set(
          posts
            .map(post => post.category)
            .filter((category): category is string => category !== null)
        )
      );
      setCategories(uniqueCategories);
    }
  }, [posts]);

  useEffect(() => {
    // Fonction pour filtrer les posts
    function filterPosts(posts: Post[]): Post[] {
      let result = [...posts];
      
      // Filtrer par statut
      if (filterStatus !== 'all') {
        result = result.filter(post => 
          (filterStatus === 'published' && post.published) || 
          (filterStatus === 'draft' && !post.published)
        );
      }
      
      // Filtrer par catégorie
      if (filterCategory !== '') {
        result = result.filter(post => post.category === filterCategory);
      }
      
      // Filtrer par recherche textuelle
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(post => 
          post.title.toLowerCase().includes(term) || 
          (post.description?.toLowerCase() || '').includes(term) ||
          (post.content?.toLowerCase() || '').includes(term) ||
          post.author.toLowerCase().includes(term) ||
          (post.category?.toLowerCase() || '').includes(term)
        );
      }
      
      return result;
    }
    setFilteredPosts(filterPosts(posts));
  }, [posts, searchTerm, filterStatus, filterCategory]);

  // Ouvrir la modale quand editingPost ou isCreating change
  useEffect(() => {
    if (editingPost !== null || isCreating) {
      setIsModalOpen(true);
    }
  }, [editingPost, isCreating]);

  async function fetchPosts() {
    try {
      setIsLoading(true);
      
      // Ne pas vérifier à nouveau l'authentification ici, car c'est déjà fait dans useEffect
      // Cette ligne crée une incohérence car fetchPosts est appelé après la vérification d'authentification
      // if (!isAuthenticated) {
      //   setAuthError("Vous devez être connecté pour voir les articles.");
      //   return;
      // }
      
      // Utiliser une requête SQL directe pour contourner les politiques RLS
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      
      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          setAuthError("Erreur de permission: Vous n'avez pas les droits nécessaires pour cette action. Vérifiez que vous êtes connecté avec un compte superuser.");
        }
        throw error;
      }
      
      setPosts(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des articles:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLogs() {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des logs:', err);
    }
  }

  async function logActivity(action: string, details: string) {
    try {
      // Récupérer l'utilisateur depuis localStorage au lieu de supabase.auth
      const userJson = localStorage.getItem('autom8_user');
      if (!userJson) return;
      
      const user = JSON.parse(userJson);
      
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_email: user.email,
          action,
          details
        }]);

      if (error) throw error;
      fetchLogs();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', err);
    }
  }

  async function handleSave(post: Partial<Post>) {
    try {
      // Vérifier que les champs obligatoires sont présents
      if (!post.title) {
        throw new Error('Le titre est obligatoire');
      }
      
      // Générer un slug valide (au moins 3 caractères)
      let slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      // S'assurer que le slug fait au moins 3 caractères
      while (slug.length < 3) {
        slug += '-x';
      }
      // Supprimer les tirets en début et fin
      slug = slug.replace(/^-+|-+$/g, '');
      
      // Vérifier que l'auteur est présent
      if (!post.author) {
        throw new Error('L\'auteur est obligatoire');
      }
      
      // Vérifier si l'utilisateur est connecté
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }
      
      if (editingPost?.id) {
        // Mise à jour d'un article existant
        console.log('Mise à jour de l\'article:', editingPost.id);
        
        const { error } = await supabase
          .from('posts')
          .update({
            title: post.title,
            slug: slug,
            description: post.description || null,
            content: post.content || null,
            image: post.image || null,
            author: post.author,
            author_image: post.author_image || null,
            category: post.category || null,
            published: post.published === true
          })
          .eq('id', editingPost.id);
        
        if (error) {
          console.error('Erreur lors de la mise à jour:', error);
          if (error.code === '23505') {
            throw new Error(`Un article avec ce titre existe déjà. Veuillez choisir un titre différent.`);
          } else if (error.code === '23502') {
            throw new Error(`Une valeur obligatoire est manquante: ${error.details || error.message}`);
          } else if (error.code === '42501' || error.message.includes('policy')) {
            throw new Error(`Erreur de permission: Vous n'avez pas les droits nécessaires pour cette action. Vérifiez que vous êtes connecté avec un compte superuser.`);
          } else {
            throw new Error(`Erreur lors de la mise à jour: ${error.message || error.details || 'Erreur inconnue'}`);
          }
        }
        
        console.log('Article mis à jour avec succès');
        await logActivity('update', `Article mis à jour : ${post.title}`);
      } else {
        // Création d'un nouvel article
        console.log('Création d\'un nouvel article');
        
        const { error } = await supabase
          .from('posts')
          .insert([{
            title: post.title,
            slug: slug,
            description: post.description || null,
            content: post.content || null,
            image: post.image || null,
            author: post.author,
            author_image: post.author_image || null,
            category: post.category || null,
            published: false
          }]);

        if (error) {
          console.error('Erreur lors de la création:', error);
          if (error.code === '23505') {
            throw new Error(`Un article avec ce titre existe déjà. Veuillez choisir un titre différent.`);
          } else if (error.code === '23502') {
            throw new Error(`Une valeur obligatoire est manquante: ${error.details || error.message}`);
          } else if (error.code === '42501' || error.message.includes('policy')) {
            throw new Error(`Erreur de permission: Vous n'avez pas les droits nécessaires pour cette action. Vérifiez que vous êtes connecté avec un compte superuser.`);
          } else {
            throw new Error(`Erreur lors de la création: ${error.message || error.details || 'Erreur inconnue'}`);
          }
        }
        
        console.log('Nouvel article créé avec succès');
        await logActivity('create', `Nouvel article créé : ${post.title}`);
      }
      
      await fetchPosts();
      closeModal();
    } catch (err) {
      console.error('Erreur complète:', err);
      throw err; // Propager l'erreur pour qu'elle soit capturée par le formulaire
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingPost(null);
    setIsCreating(false);
  }

  // Fonction pour ouvrir la modale de suppression
  function openDeleteModal(post: Post) {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  }

  // Fonction pour confirmer la suppression d'un article
  async function confirmDeletePost() {
    if (!postToDelete) return;
    
    try {
      // Vérifier si l'utilisateur est connecté
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postToDelete.id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error(`Erreur de permission: Vous n'avez pas les droits nécessaires pour cette action. Vérifiez que vous êtes connecté avec un compte superuser.`);
        } else {
          throw new Error(`Erreur lors de la suppression: ${error.message}`);
        }
      }

      await logActivity('delete', `Article supprimé : ${postToDelete.title}`);
      await fetchPosts();
      
      // Fermer la modale de suppression
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }

  async function handleTogglePublish(id: string, currentStatus: boolean, title: string) {
    try {
      // Vérifier si l'utilisateur est connecté
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }
      
      const { error } = await supabase
        .from('posts')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error(`Erreur de permission: Vous n'avez pas les droits nécessaires pour cette action. Vérifiez que vous êtes connecté avec un compte superuser.`);
        } else {
          throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
        }
      }

      await logActivity(
        'update',
        `Article ${!currentStatus ? 'publié' : 'dépublié'} : ${title}`
      );
      await fetchPosts();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  }

  const PostForm = ({ post, onSave, onCancel }: { 
    post?: Post; 
    onSave: (post: Partial<Post>) => void; 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<Partial<Post>>(
      post || {
        title: '',
        description: '',
        content: '',
        image: '',
        author: 'Admin', // Valeur par défaut pour l'auteur (champ obligatoire)
        author_image: '',
        category: '',
        read_time: '5 min',
        published: false
      }
    );
    const [activeTab, setActiveTab] = useState<'content' | 'preview'>('content');
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setFormError(null);
      
      try {
        // Validation des champs obligatoires
        if (!formData.title?.trim()) {
          throw new Error('Le titre est obligatoire');
        }
        
        if (!formData.author?.trim()) {
          throw new Error('L\'auteur est obligatoire');
        }
        
        await onSave(formData);
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
        if (error instanceof Error) {
          setFormError(error.message);
        } else if (typeof error === 'object' && error !== null) {
          // Pour les erreurs Supabase ou autres objets d'erreur
          const errorObj = error as any;
          setFormError(errorObj.message || errorObj.details || 'Une erreur est survenue');
        } else {
          setFormError('Une erreur inconnue est survenue');
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="animate-slideIn">
        {/* Onglets pour naviguer entre les sections */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'content' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Contenu
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'preview' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Aperçu
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Erreur</p>
                <p className="text-sm">{formError}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' ? (
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3"
                  placeholder="Titre de l'article"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Auteur</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3"
                  placeholder="Nom de l'auteur"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de l'article</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3"
                  placeholder="URL de l'image"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de l'auteur</label>
                <input
                  type="text"
                  value={formData.author_image || ''}
                  onChange={e => setFormData({ ...formData, author_image: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3"
                  placeholder="URL de l'image de l'auteur"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3"
                  placeholder="Catégorie de l'article"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3"
                  placeholder="Brève description de l'article"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu (Markdown)</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3 font-mono"
                rows={20}
                placeholder="Contenu de l'article en Markdown..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!!formData.published}
                  onChange={e => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Publier l'article</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            {formData.title && (
              <h1 className="text-3xl font-bold text-gray-900">{formData.title}</h1>
            )}
            
            {formData.description && (
              <p className="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-3 py-1">{formData.description}</p>
            )}
            
            <div className="flex items-center gap-3 my-4 border-b border-gray-100 pb-4">
              {formData.author_image && (
                <img 
                  src={formData.author_image || ''} 
                  alt={formData.author || 'Auteur'} 
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'}
                />
              )}
              {formData.author && (
                <div>
                  <div className="font-medium text-gray-900">{formData.author}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date().toLocaleDateString('fr-FR')} · {formData.read_time || '5 min de lecture'}
                  </div>
                </div>
              )}
            </div>
            
            {formData.image && (
              <div className="my-6">
                <img 
                  src={formData.image} 
                  alt={formData.title || 'Image de l\'article'} 
                  className="w-full h-72 object-cover rounded-lg shadow-md"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Error'}
                />
                {formData.category && (
                  <div className="mt-2 text-sm text-gray-500">
                    Catégorie: <span className="font-medium text-blue-600">{formData.category}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="prose prose-blue max-w-none border rounded-md p-6 overflow-auto max-h-[400px] bg-gray-50">
              <ReactMarkdown>{formData.content || '*Aucun contenu à afficher*'}</ReactMarkdown>
            </div>
            
            {!formData.published && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-700">
                <div className="font-medium">Article non publié</div>
                <p>Cet article est actuellement en mode brouillon et n'est pas visible par le public.</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4 mt-4 border-t">
          <div className="space-x-2">
            <Button
              onClick={handleSubmit}
              className="gap-1"
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  Enregistrer
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="gap-1"
              size="sm"
              disabled={isSaving}
            >
              <X className="h-3 w-3" />
              Annuler
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {post?.id ? 'Dernière modification: ' + new Date(post.updated_at || '').toLocaleString('fr-FR') : 'Nouvel article'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Erreur d'authentification</strong>
          <p className="block sm:inline">Vous devez être connecté pour voir les articles.</p>
          <div className="mt-4 flex space-x-4">
            <Button 
              onClick={() => window.location.href = '/admin/login'} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Se connecter
            </Button>
            <Button 
              onClick={() => {
                // Créer une session utilisateur manuellement
                const user = {
                  id: "00000000-0000-0000-0000-000000000000",
                  email: "admin@example.com",
                  name: "Admin",
                  role: "superuser"
                };
                localStorage.setItem('autom8_user', JSON.stringify(user));
                window.location.reload();
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Connexion d'urgence
            </Button>
            <Button 
              onClick={() => {
                // Supprimer la clé du localStorage
                localStorage.removeItem('autom8_user');
                alert('Clé autom8_user supprimée du localStorage');
                window.location.reload();
              }} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Supprimer la clé
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Articles</h1>
            {isAuthenticated && (
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Connecté
              </span>
            )}
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={() => {
                    setIsCreating(true);
                    setEditingPost({
                      id: '',
                      slug: '',
                      title: '',
                      description: '',
                      content: '',
                      image: '',
                      author: '',
                      author_image: '',
                      category: '',
                      read_time: '5 min',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      published: false
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Nouvel article
                </Button>
                <Button
                  onClick={() => setShowLogs(!showLogs)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {showLogs ? 'Masquer' : 'Afficher'} l'historique
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/admin/login'}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Connexion
              </Button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p className="font-medium">Erreur d'authentification</p>
            <p>{authError}</p>
            <p className="mt-2">
              <a href="/login" className="text-red-700 underline">Se connecter</a>
            </p>
          </div>
        )}
        
        {showLogs && (
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Logs d'activité</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[300px] overflow-auto">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{log.user_email}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{log.details}</span>
                    </div>
                    <time className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Modale pour l'édition/création d'article */}
          <Modal 
            isOpen={isModalOpen} 
            onClose={closeModal}
            title={editingPost?.id ? 'Modifier l\'article' : 'Nouvel article'}
          >
            {(isCreating || editingPost) && (
              <PostForm
                post={editingPost || {
                  id: '',
                  slug: '',
                  title: '',
                  description: '',
                  content: '',
                  image: '',
                  author: '',
                  author_image: '',
                  category: '',
                  read_time: '5 min',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  published: false
                }}
                onSave={handleSave}
                onCancel={closeModal}
              />
            )}
          </Modal>

          {/* Filtres et recherche */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiés</option>
                  <option value="draft">Brouillons</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPosts}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {isLoading ? 'Chargement des articles...' : 'Aucun article trouvé.'}
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{post.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPost(post);
                              setIsCreating(false);
                              setIsModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(post)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modale de suppression */}
      {postToDelete && (
        <DeletePostModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPostToDelete(null);
          }}
          onConfirm={confirmDeletePost}
          postTitle={postToDelete.title}
          postId={postToDelete.id}
          postDate={postToDelete.created_at}
          postAuthor={postToDelete.author}
        />
      )}
    </div>
  );
}