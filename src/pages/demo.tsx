import { Bot, Zap, BarChart, Shield, LucideIcon } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  demo: ReactNode;
}

interface Features {
  [key: string]: Feature;
}

export function Demo() {
  const [activeFeature, setActiveFeature] = useState('automation');

  const features: Features = {
    automation: {
      title: 'Automatisation Intelligente',
      description: 'Découvrez comment notre IA peut automatiser vos tâches répétitives.',
      icon: Bot,
      demo: (
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="space-y-4">
            <div className="h-8 bg-blue-200 rounded animate-pulse" />
            <div className="h-8 bg-blue-200 rounded animate-pulse w-3/4" />
            <div className="h-8 bg-blue-200 rounded animate-pulse w-1/2" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 animate-bounce" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    performance: {
      title: 'Performance Accrue',
      description: 'Visualisez l\'amélioration de vos performances en temps réel.',
      icon: Zap,
      demo: (
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="space-y-6">
            <div className="flex items-end space-x-2 h-48">
              {[40, 65, 45, 80, 75, 90].map((height, i) => (
                <div
                  key={i}
                  className="bg-blue-500 w-12 rounded-t transition-all duration-1000"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">+200%</div>
                <div className="text-sm text-gray-600">Productivité</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">-45%</div>
                <div className="text-sm text-gray-600">Erreurs</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Disponibilité</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    analytics: {
      title: 'Analyses en Temps Réel',
      description: 'Explorez nos tableaux de bord interactifs et nos analyses détaillées.',
      icon: BarChart,
      demo: (
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-32 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-t-transparent animate-spin" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 bg-blue-100 rounded" style={{ width: `${85 - (i * 15)}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    security: {
      title: 'Sécurité Renforcée',
      description: 'Explorez nos systèmes de sécurité et de protection des données.',
      icon: Shield,
      demo: (
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto">
                <Shield className="w-full h-full text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-green-500 rounded-full" />
                <div className="h-2 bg-green-500 rounded-full w-3/4" />
                <div className="h-2 bg-green-500 rounded-full w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-2 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Démonstration Interactive
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explorez nos fonctionnalités principales en action. Sélectionnez une fonctionnalité pour voir une démonstration en direct.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(features).map(([key, feature]) => {
              const Icon = feature.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFeature(key)}
                  className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                    activeFeature === key
                      ? 'bg-blue-50 ring-2 ring-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${
                    activeFeature === key ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h3 className={`mt-2 font-semibold ${
                    activeFeature === key ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                </button>
              );
            })}
          </div>

          <div className="mt-12">
            <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 p-8">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {features[activeFeature].title}
                </h2>
                <p className="mt-2 text-gray-600">
                  {features[activeFeature].description}
                </p>
              </div>
              <div className="mt-8">
                {features[activeFeature].demo}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact">
            <Button size="lg" className="group gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg hover:shadow-xl transition-all duration-200">
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}