import { useState, useEffect } from 'react';
import { supabase, getServiceClient } from '../../lib/supabase';
import { Testimonial, ActivityLog } from '../../types/testimonial';
import { Button } from '../../components/ui/button';
import { EditTestimonialModal } from '../../components/edit-testimonial-modal';
import { DeleteTestimonialModal } from '../../components/delete-testimonial-modal';
import { PlusCircle, Pencil, Trash, Clock, Star, Search, RefreshCcw } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar';

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

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not_featured'>('all');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser();
      // Vérifier si l'utilisateur existe
      if (user) {
        console.log('Utilisateur connecté:', user);
        setIsAuthenticated(true);
        setAuthError(null);
        await fetchTestimonials();
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

  // Filtrer les témoignages
  useEffect(() => {
    const filterTestimonials = (data: Testimonial[]) => {
      let result = [...data];
      
      // Filtrer par statut (mis en avant ou non)
      if (filterFeatured === 'featured') {
        result = result.filter(testimonial => testimonial.is_featured);
      } else if (filterFeatured === 'not_featured') {
        result = result.filter(testimonial => !testimonial.is_featured);
      }
      
      // Filtrer par recherche textuelle
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(testimonial => 
          testimonial.name.toLowerCase().includes(term) || 
          testimonial.position.toLowerCase().includes(term) ||
          testimonial.company.toLowerCase().includes(term) ||
          testimonial.content.toLowerCase().includes(term)
        );
      }
      
      return result;
    }
    setFilteredTestimonials(filterTestimonials(testimonials));
  }, [testimonials, searchTerm, filterFeatured]);

  // Ouvrir la modale quand editingTestimonial ou isCreating change
  useEffect(() => {
    if (editingTestimonial !== null || isCreating) {
      setIsModalOpen(true);
    }
  }, [editingTestimonial, isCreating]);

  async function fetchTestimonials() {
    try {
      setIsLoading(true);
      
      // Utiliser une requête SQL directe pour récupérer les témoignages
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des témoignages:', error);
        if (error.code === '42501' || error.message.includes('policy')) {
          setAuthError("Erreur de permission: Vous n'avez pas les droits nécessaires pour cette action. Vérifiez que vous êtes connecté avec un compte superuser.");
        }
        throw error;
      }
      
      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des témoignages:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLogs() {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'testimonial')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Erreur lors de la récupération des logs:', error);
        return;
      }
      
      if (data) {
        setLogs(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
    }
  }

  async function handleSaveTestimonial(testimonial: Testimonial) {
    try {
      // 1. Vérifier l'authentification locale
      const user = getCurrentUser();
      console.log('Vérification de l\'utilisateur:', {
        isAuthenticated: !!user,
        userData: user
      });

      if (!user) {
        console.error('Erreur d\'authentification: Utilisateur non connecté');
        setAuthError("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      // 2. Obtenir le client service
      console.log('Obtention du client service Supabase...');
      const serviceClient = getServiceClient();
      console.log('Client service obtenu avec succès');
      
      const isNewTestimonial = !testimonial.id;
      console.log('Type d\'opération:', isNewTestimonial ? 'Création' : 'Modification');
      console.log('Données du témoignage à sauvegarder:', testimonial);
      
      let result;
      
      if (isNewTestimonial) {
        // Créer un nouveau témoignage avec des champs validés
        const testimonialData = {
          name: testimonial.name.trim(),
          position: testimonial.position.trim(),
          company: testimonial.company.trim(),
          image: testimonial.image?.trim() || null,
          content: testimonial.content.trim(),
          rating: Math.min(Math.max(testimonial.rating, 1), 5), // Valeur entre 1 et 5
          is_featured: Boolean(testimonial.is_featured)
        };

        console.log('Données préparées pour insertion:', testimonialData);
        
        console.log('Tentative d\'insertion dans Supabase...');
        const { data, error } = await serviceClient
          .from('testimonials')
          .insert([testimonialData])
          .select()
          .single();
        
        if (error) {
          console.error('Erreur Supabase lors de l\'insertion:', {
            code: error.code,
            message: error.message,
            details: error.details
          });
          throw new Error(`Erreur lors de la création du témoignage: ${error.message}`);
        }
        
        console.log('Réponse de Supabase après insertion:', data);
        result = data;
        
        // Ajouter un log pour la création
        console.log('Ajout du log d\'activité...');
        const { error: logError } = await serviceClient
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            user_email: user.email,
            action: 'create',
            entity_type: 'testimonial',
            entity_id: result.id,
            details: `Témoignage créé: ${testimonial.name} (${testimonial.company})`,
            created_at: new Date().toISOString()
          }]);

        if (logError) {
          console.error('Erreur lors de la création du log:', logError);
        } else {
          console.log('Log d\'activité créé avec succès');
        }
      } else {
        // Mettre à jour un témoignage existant
        const testimonialData = {
          name: testimonial.name.trim(),
          position: testimonial.position.trim(),
          company: testimonial.company.trim(),
          image: testimonial.image?.trim() || null,
          content: testimonial.content.trim(),
          rating: Math.min(Math.max(testimonial.rating, 1), 5),
          is_featured: Boolean(testimonial.is_featured),
          updated_at: new Date().toISOString()
        };

        console.log('Données préparées pour mise à jour:', testimonialData);
        
        console.log('Tentative de mise à jour dans Supabase...');
        const { data, error } = await serviceClient
          .from('testimonials')
          .update(testimonialData)
          .eq('id', testimonial.id)
          .select()
          .single();
        
        if (error) {
          console.error('Erreur Supabase lors de la mise à jour:', {
            code: error.code,
            message: error.message,
            details: error.details
          });
          throw new Error(`Erreur lors de la mise à jour du témoignage: ${error.message}`);
        }
        
        console.log('Réponse de Supabase après mise à jour:', data);
        result = data;
        
        // Ajouter un log pour la modification
        console.log('Ajout du log d\'activité...');
        const { error: logError } = await serviceClient
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            user_email: user.email,
            action: 'update',
            entity_type: 'testimonial',
            entity_id: testimonial.id,
            details: `Témoignage modifié: ${testimonial.name} (${testimonial.company})`,
            created_at: new Date().toISOString()
          }]);

        if (logError) {
          console.error('Erreur lors de la création du log:', logError);
        } else {
          console.log('Log d\'activité créé avec succès');
        }
      }
      
      // Rafraîchir les données
      console.log('Rafraîchissement des données...');
      await fetchTestimonials();
      await fetchLogs();
      
      // Réinitialiser l'état
      setEditingTestimonial(null);
      setIsCreating(false);
      setIsModalOpen(false);
      
      console.log('Opération terminée avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du témoignage:', error);
      setAuthError(error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde du témoignage.");
    }
  }

  async function handleDeleteTestimonial(testimonialId: string) {
    try {
      // 1. Vérifier l'authentification locale
      const user = getCurrentUser();
      console.log('Vérification de l\'utilisateur:', {
        isAuthenticated: !!user,
        userData: user
      });

      if (!user) {
        console.error('Erreur d\'authentification: Utilisateur non connecté');
        setAuthError("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      // 2. Obtenir le client service
      console.log('Obtention du client service Supabase...');
      const serviceClient = getServiceClient();
      console.log('Client service obtenu avec succès');

      // 3. Supprimer le témoignage
      console.log('Tentative de suppression du témoignage:', testimonialId);
      const { error } = await serviceClient
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) {
        console.error('Erreur Supabase lors de la suppression:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw new Error(`Erreur lors de la suppression du témoignage: ${error.message}`);
      }

      console.log('Témoignage supprimé avec succès');

      // 4. Ajouter un log pour la suppression
      console.log('Ajout du log d\'activité...');
      const { error: logError } = await serviceClient
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          action: 'delete',
          entity_type: 'testimonial',
          entity_id: testimonialId,
          details: `Témoignage supprimé`,
          created_at: new Date().toISOString()
        }]);

      if (logError) {
        console.error('Erreur lors de la création du log:', logError);
      } else {
        console.log('Log d\'activité créé avec succès');
      }

      // 5. Rafraîchir les données
      console.log('Rafraîchissement des données...');
      await fetchTestimonials();
      await fetchLogs();

      console.log('Opération terminée avec succès');

    } catch (error) {
      console.error('Erreur lors de la suppression du témoignage:', error);
      setAuthError(error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du témoignage.");
    }
  }

  async function confirmDeleteTestimonial() {
    if (!testimonialToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const user = getCurrentUser();
      if (!user) {
        setAuthError("Vous devez être connecté pour effectuer cette action.");
        return;
      }
      
      // Supprimer le témoignage
      await handleDeleteTestimonial(testimonialToDelete.id);
      
      // Réinitialiser l'état
      setIsDeleteModalOpen(false);
      setTestimonialToDelete(null);
      
    } catch (error) {
      console.error('Erreur lors de la suppression du témoignage:', error);
      alert('Une erreur est survenue lors de la suppression du témoignage.');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditTestimonial(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setIsCreating(false);
  }

  function handleDeleteTestimonialClick(testimonial: Testimonial) {
    setTestimonialToDelete(testimonial);
    setIsDeleteModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setIsCreating(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Témoignages</h1>
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
                    setEditingTestimonial({
                      id: '',
                      name: '',
                      position: '',
                      company: '',
                      image: '',
                      content: '',
                      rating: 5,
                      is_featured: false,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Nouveau témoignage
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Erreur d'authentification
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {authError}
                </p>
                {!isAuthenticated && (
                  <p className="mt-2">
                    <a href="/admin/login" className="text-sm font-medium text-red-700 underline">
                      Se connecter
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <>
            {showLogs && (
              <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Historique des activités</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Les 20 dernières actions effectuées sur les témoignages
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Détails
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.length > 0 ? (
                        logs.map((log) => (
                          <tr key={log.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(log.created_at).toLocaleString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.user_email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                log.action === 'create' 
                                  ? 'bg-green-100 text-green-800' 
                                  : log.action === 'update' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {log.action === 'create' 
                                  ? 'Création' 
                                  : log.action === 'update' 
                                    ? 'Modification' 
                                    : 'Suppression'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {log.details}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            Aucun historique disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un témoignage..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filterFeatured}
                        onChange={(e) => setFilterFeatured(e.target.value as 'all' | 'featured' | 'not_featured')}
                      >
                        <option value="all">Tous les témoignages</option>
                        <option value="featured">Mis en avant</option>
                        <option value="not_featured">Non mis en avant</option>
                      </select>
                    </div>
                    <Button
                      onClick={() => fetchTestimonials()}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Actualiser
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTestimonials.length > 0 ? (
                      filteredTestimonials.map((testimonial) => (
                        <tr key={testimonial.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <Avatar
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {testimonial.name}
                                </div>
                                <div className="text-gray-500">
                                  {testimonial.position}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {testimonial.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              testimonial.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {testimonial.is_featured ? 'Mis en avant' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditTestimonial(testimonial)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonialClick(testimonial)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun témoignage trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Modales */}
        <EditTestimonialModal
          testimonial={editingTestimonial}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTestimonial}
          isCreating={isCreating}
        />

        <DeleteTestimonialModal
          testimonial={testimonialToDelete}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteTestimonial}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
