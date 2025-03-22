import { CheckCircle } from 'lucide-react';

const solutions = [
  {
    title: 'Industrie manufacturière',
    description: 'Automatisation des chaînes de production et contrôle qualité',
    benefits: [
      'Réduction des temps d\'arrêt',
      'Amélioration de la qualité',
      'Optimisation des coûts',
    ],
  },
  {
    title: 'Services financiers',
    description: 'Automatisation des processus bancaires et conformité',
    benefits: [
      'Traitement automatique des transactions',
      'Détection des fraudes',
      'Reporting réglementaire',
    ],
  },
  {
    title: 'Commerce de détail',
    description: 'Gestion des stocks et expérience client',
    benefits: [
      'Optimisation des inventaires',
      'Personnalisation des offres',
      'Analyse prédictive',
    ],
  },
];

export function Solutions() {
  return (
    <div className="bg-white py-10 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-sm font-semibold leading-6 text-blue-600 uppercase tracking-wider">Nos solutions</h2>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-8">
            Solutions adaptées à votre secteur
          </h1>
          <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Des solutions d'automatisation sur mesure pour répondre aux besoins spécifiques de votre industrie.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="flex flex-col bg-white rounded-2xl border border-gray-200 p-8 shadow hover:shadow-lg transition-all hover:border-blue-100 group"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-600 mb-8 text-base">{solution.description}</p>
                <ul className="space-y-4 mt-auto">
                  {solution.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle
                        className="h-5 w-5 flex-none text-blue-600 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}