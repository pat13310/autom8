import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface TierType {
  name: string;
  price: string;
  description: string;
  features: string[];
}

type BillingPeriod = 'monthly' | 'annual';

interface TiersDataType {
  monthly: TierType[];
  annual: TierType[];
}

const tiersData: TiersDataType = {
  monthly: [
    {
      name: 'Starter',
      price: '29',
      description: 'Parfait pour démarrer avec l\'automatisation',
      features: [
        'Jusqu\'à 5 automatisations',
        '100 exécutions par mois',
        'Support par email',
        'Mises à jour de sécurité',
      ],
    },
    {
      name: 'Pro',
      price: '99',
      description: 'Pour les équipes en croissance',
      features: [
        'Automatisations illimitées',
        '1000 exécutions par mois',
        'Support prioritaire',
        'API avancée',
        'Tableaux de bord personnalisés',
      ],
    },
    {
      name: 'Solutions Entreprise',
      price: 'Sur mesure',
      description: 'Accompagnement personnalisé',
      features: [
        'Automatisations illimitées',
        'Exécutions illimitées',
        'Support dédié 24/7',
        'Intégrations sur mesure',
        'Conformité et sécurité avancées',
        'Déploiement sur site ou cloud privé',
        'Formation et accompagnement',
      ],
    },
  ],
  annual: [
    {
      name: 'Starter',
      price: '290',
      description: 'Parfait pour démarrer avec l\'automatisation',
      features: [
        'Jusqu\'à 5 automatisations',
        '100 exécutions par mois',
        'Support par email',
        'Mises à jour de sécurité',
      ],
    },
    {
      name: 'Pro',
      price: '990',
      description: 'Pour les équipes en croissance',
      features: [
        'Automatisations illimitées',
        '1000 exécutions par mois',
        'Support prioritaire',
        'API avancée',
        'Tableaux de bord personnalisés',
      ],
    },
    {
      name: 'Solutions Entreprise',
      price: 'Sur mesure',
      description: 'Accompagnement personnalisé',
      features: [
        'Automatisations illimitées',
        'Exécutions illimitées',
        'Support dédié 24/7',
        'Intégrations sur mesure',
        'Conformité et sécurité avancées',
        'Déploiement sur site ou cloud privé',
        'Formation et accompagnement',
      ],
    },
  ]
};

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const tiers = tiersData[billingPeriod];

  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-sm font-semibold leading-6 text-blue-600 uppercase tracking-wider">Vos Tarifs</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Des prix adaptés à vos besoins
          </p>
          <p className="mt-3 text-base text-gray-600">
            Choisissez le plan qui correspond le mieux à vos besoins d'automatisation.
          </p>
          
          <div className="mt-6 flex justify-center">
            <div className="relative flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                className={`relative w-32 rounded-md py-2 text-sm font-medium ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Mensuel
              </button>
              <button
                type="button"
                className={`relative ml-0.5 w-32 rounded-md py-2 text-sm font-medium ${
                  billingPeriod === 'annual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingPeriod('annual')}
              >
                Annuel
                <span className="absolute -right-1 -top-1 flex h-5 w-12 items-center justify-center rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div 
                key={tier.name} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
                  
                  <div className="mt-4 flex items-baseline">
                    {tier.price === 'Sur mesure' ? (
                      <span className="text-3xl font-bold text-gray-900">
                        {tier.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          {tier.price}
                        </span>
                        <span className="ml-1 text-sm font-medium text-gray-500">
                          €{billingPeriod === 'monthly' ? '/mois' : '/an'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="px-6 pt-2 pb-6 bg-gray-50 flex-grow flex flex-col justify-between">
                  <ul role="list" className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-x-2">
                        <Check className="h-5 w-4 flex-none text-blue-600 mt-0.5" aria-hidden="true" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <Link to="/contact" className="block w-full">
                      <Button variant="primary" className="w-full py-2 text-sm">
                        Commencer
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}