import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types/testimonial';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/testimonials.css';
import { Star } from 'lucide-react';
import { Avatar } from '../components/ui/avatar';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setIsLoading(true);
        
        // Récupérer tous les témoignages, pas seulement ceux mis en avant
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10); // Augmenter la limite pour avoir plus de témoignages dans le carrousel
        
        if (error) {
          console.error('Erreur lors de la récupération des témoignages:', error);
          setError('Impossible de charger les témoignages. Veuillez réessayer plus tard.');
          throw error;
        }
        
        if (data) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des témoignages:', error);
        setError('Une erreur est survenue lors du chargement des témoignages.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTestimonials();
  }, []);

  // Configuration du carrousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Fonction pour afficher les étoiles de notation
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-12 sm:rounded-3xl sm:px-12 lg:px-16">
          <div className="absolute inset-0 -z-10 opacity-20 mix-blend-multiply">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" width="200" height="200" x="50%" y="50%" patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                  <path d="M.5 200V.5H200" fill="none" stroke="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ils nous font confiance
          </h2>
          <div className="flex justify-center mt-8">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    // Témoignages par défaut en cas d'erreur ou si aucun témoignage n'est trouvé
    const defaultTestimonials = [
      {
        id: '1',
        name: 'Marie Laurent',
        position: 'Directrice des Opérations',
        company: 'TechCorp',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        content: 'AutoPro a transformé notre façon de travailler. Notre productivité a augmenté de 200% en seulement 3 mois.',
        rating: 5,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Thomas Dubois',
        position: 'CEO',
        company: 'InnovTech',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'L\'interface intuitive et les analyses détaillées nous permettent de prendre des décisions éclairées rapidement.',
        rating: 5,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Sophie Martin',
        position: 'Responsable IT',
        company: 'GlobalSoft',
        image: 'https://randomuser.me/api/portraits/women/22.jpg',
        content: 'Le support client est exceptionnel. Nos problèmes sont résolus en moins de 24 heures.',
        rating: 4,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-12 sm:rounded-3xl sm:px-12 lg:px-16">
          <div className="absolute inset-0 -z-10 opacity-20 mix-blend-multiply">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" width="200" height="200" x="50%" y="50%" patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                  <path d="M.5 200V.5H200" fill="none" stroke="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
            Ils nous font confiance
          </h2>
          <Slider {...sliderSettings} className="testimonial-slider">
            {defaultTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-3 h-full">
                <figure className="rounded-xl bg-white p-6 shadow-lg h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 rounded-bl-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{testimonial.rating}/5</span>
                  </div>
                  <blockquote className="text-sm leading-6 text-gray-700 flex-grow mt-4 mr-2">
                    <p className="font-medium">"{testimonial.content}"</p>
                  </blockquote>
                  {renderRating(testimonial.rating)}
                  <figcaption className="mt-4 flex items-center gap-x-4 border-t border-gray-100 pt-4">
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-blue-600">{testimonial.position}, {testimonial.company}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-12 sm:rounded-3xl sm:px-12 lg:px-16">
        <div className="absolute inset-0 -z-10 opacity-20 mix-blend-multiply">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" width="200" height="200" x="50%" y="50%" patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                <path d="M.5 200V.5H200" fill="none" stroke="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
          Ils nous font confiance
        </h2>
        <Slider {...sliderSettings} className="testimonial-slider">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-3 h-full">
              <figure className="rounded-xl bg-white p-6 shadow-lg h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 rounded-bl-xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{testimonial.rating}/5</span>
                </div>
                <blockquote className="text-sm leading-6 text-gray-700 flex-grow mt-4 mr-2">
                  <p className="font-medium">"{testimonial.content}"</p>
                </blockquote>
                {renderRating(testimonial.rating)}
                <figcaption className="mt-4 flex items-center gap-x-4 border-t border-gray-100 pt-4">
                  <Avatar
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-blue-600">{testimonial.position}, {testimonial.company}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
