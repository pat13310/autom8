import { Bot, Cog, Zap, BarChart, Clock, Shield } from 'lucide-react';

const services = [
  {
    name: 'Automatisation des processus',
    description: 'Optimisez vos flux de travail grâce à nos solutions d\'automatisation intelligentes.',
    icon: Bot,
  },
  {
    name: 'Intégration de systèmes',
    description: 'Connectez vos outils et applications pour une meilleure synergie.',
    icon: Cog,
  },
  {
    name: 'Optimisation des performances',
    description: 'Améliorez l\'efficacité de vos processus métier.',
    icon: Zap,
  },
  {
    name: 'Analyses et rapports',
    description: 'Suivez vos KPIs avec des tableaux de bord personnalisés.',
    icon: BarChart,
  },
  {
    name: 'Automatisation en temps réel',
    description: 'Réagissez instantanément aux événements importants.',
    icon: Clock,
  },
  {
    name: 'Sécurité intégrée',
    description: 'Protection avancée de vos données et processus.',
    icon: Shield,
  },
];

export function Services() {
  return (
    <div className="bg-white py-10 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h2 className="text-sm font-semibold leading-6 text-blue-600 uppercase tracking-wider">nos services</h2>

          <h1 className="pt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-3">
            Solutions d'automatisation complètes
          </h1>
          <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services d'automatisation conçus pour transformer votre entreprise.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 shadow hover:shadow-lg transition-all hover:border-blue-100 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <service.icon
                      className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                </div>
                <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}