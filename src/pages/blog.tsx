import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { NotFound } from '@/components/not-found';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  created_at: string;
  read_time: number;
  published: boolean;
  category?: string;
  slug: string;
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        return;
      }

      setPosts(data || []);
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Blog</h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Découvrez nos derniers articles sur l'automatisation et l'innovation.
          </p>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                onClick={() => navigate(`/blog/${post.slug}`)}
                role="button"
                tabIndex={0}
              >
                <div className="relative">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <time className="flex items-center gap-1 font-medium">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </time>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="h-4 w-4" />
                      {post.read_time} min
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 text-foreground hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  
                  <div className="mb-6 flex-1">
                    <MarkdownRenderer 
                      content={post.description} 
                      className="prose-sm max-w-none line-clamp-3" 
                    />
                  </div>

                  <Button 
                    variant="secondary" 
                    className="w-full group"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blog/${post.slug}`);
                    }}
                  >
                    <span className="flex-1">Lire l'article</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        return;
      }

      setPost(data);
    };

    fetchPost();
  }, [slug]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative py-16">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-prose text-lg">
              {post.image && (
                <div className="relative w-full mb-8 aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <time dateTime={post.created_at} className="flex items-center gap-1 font-medium">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </time>
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="h-4 w-4" />
                  {post.read_time} min
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-blue mx-auto mt-12">
              <MarkdownRenderer 
                content={post.content} 
                className="prose-lg max-w-none" 
              />
            </div>

            <div className="mt-12 flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/blog')}
                className="group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Retour aux articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}