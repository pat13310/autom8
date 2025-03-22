import { ArrowRight, Bot, Zap, BarChart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TestimonialsSection } from '../components/testimonials-section';

const features = [
  {
    name: 'Automatisation Intelligente',
    description: 'Optimisez vos processus métier avec notre IA avancée qui s\'adapte à vos besoins spécifiques.',
    icon: Bot,
  },
  {
    name: 'Performance Accrue',
    description: 'Augmentez votre productivité jusqu\'à 300% et réduisez les erreurs de 95%.',
    icon: Zap,
  },
  {
    name: 'Analyses en Temps Réel',
    description: 'Tableaux de bord personnalisés avec KPIs et métriques essentielles pour votre activité.',
    icon: BarChart,
  },
  {
    name: 'Sécurité Renforcée',
    description: 'Protection de niveau entreprise avec chiffrement de bout en bout et conformité RGPD.',
    icon: Shield,
  },
];

const stats = [
  { value: '98%', label: 'Satisfaction client' },
  { value: '2M+', label: 'Automatisations' },
  { value: '24/7', label: 'Support client' },
  { value: '99.9%', label: 'Disponibilité' },
];

export function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-blue-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-20 sm:py-28 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                L'automatisation intelligente pour votre entreprise
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Transformez votre entreprise avec nos solutions d'automatisation alimentées par l'IA. 
                Simplifiez vos opérations, augmentez votre productivité et prenez des décisions éclairées.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-4">
                <Link to="/demo">
                  <Button size="lg" className="group gap-2">
                    Démarrer gratuitement
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button  size="lg" className='text-gray-600' variant="outline">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="mx-auto">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <dd className="text-3xl font-semibold tracking-tight text-blue-600">
                    {stat.value}
                  </dd>
                  <dt className="text-sm text-gray-600">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Plus rapide, plus efficace</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            La puissance de l'automatisation à votre service
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Découvrez comment nos solutions innovantes peuvent transformer votre entreprise et vous donner 
            un avantage concurrentiel décisif.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors">
                  <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
              </div>
              <p className="mt-4 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial section */}
      <TestimonialsSection />

      {/* CTA section */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-800 to-indigo-900 px-6 py-16 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-20">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.15" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#38bdf8" />
              </radialGradient>
            </defs>
          </svg>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prêt à transformer votre entreprise ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-8 text-blue-100">
            Découvrez comment AutoPro peut révolutionner votre façon de travailler.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            <Link to="/demo">
              <Button size="lg" className="group w-full gap-2 bg-white text-blue-900 hover:bg-blue-50 sm:w-auto">
                Voir la démonstration
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full border-2 border-white text-blue-600 hover:bg-white hover:text-blue-900 sm:w-auto">
                Nous contacter
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-blue-100">Aucun engagement • Annulation à tout moment</p>
          </div>
        </div>
      </div>
    </div>
  );
}