import { Shield, Lock, FileCheck, UserCheck } from 'lucide-react';

export function RGPD() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Conformité RGPD
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Notre engagement pour la protection de vos données personnelles.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Traitement des données personnelles</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  En tant que responsable de traitement, AutoPro s'engage à respecter les obligations 
                  prévues par le RGPD (Règlement Général sur la Protection des Données) et à garantir 
                  la protection des données à caractère personnel traitées dans le cadre de ses activités.
                </p>
                <div className="mt-6 rounded-lg bg-blue-50 p-6">
                  <h3 className="font-semibold text-blue-900">Notre engagement</h3>
                  <ul className="mt-4 space-y-3 text-blue-800">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      Protection des données dès la conception
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      Transparence des traitements
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      Minimisation des données collectées
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      Sécurisation des données
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Base légale des traitements</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>Nous traitons vos données sur les bases légales suivantes :</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      title: 'Consentement',
                      description: 'Votre accord explicite pour le traitement de vos données'
                    },
                    {
                      title: 'Contrat',
                      description: 'Nécessaire à l\'exécution de nos services'
                    },
                    {
                      title: 'Obligation légale',
                      description: 'Conformité avec la législation en vigueur'
                    },
                    {
                      title: 'Intérêt légitime',
                      description: 'Amélioration de nos services dans le respect de vos droits'
                    }
                  ].map((basis) => (
                    <div key={basis.title} className="rounded-lg bg-gray-50 p-6">
                      <h3 className="font-semibold text-gray-900">{basis.title}</h3>
                      <p className="mt-2 text-sm">{basis.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <FileCheck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Mesures de sécurité</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour 
                  garantir un niveau de sécurité adapté au risque.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    'Chiffrement des données',
                    'Pseudonymisation',
                    'Sauvegardes régulières',
                    'Tests de sécurité',
                    'Formation du personnel',
                    'Accès restreint'
                  ].map((measure) => (
                    <div key={measure} className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>{measure}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Exercice de vos droits</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Pour exercer vos droits RGPD ou pour toute question relative à la protection de vos données, 
                  vous pouvez contacter notre Délégué à la Protection des Données :
                </p>
                <div className="mt-6 rounded-lg bg-blue-50 p-6">
                  <p className="font-semibold text-blue-900">Contact DPO :</p>
                  <div className="mt-4 space-y-2 text-blue-800">
                    <p>Email : dpo@autopro.com</p>
                    <p>Adresse : 123 rue de l'Innovation, 75001 Paris</p>
                    <p>Téléphone : +33 1 23 45 67 89</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          
          </div>
        </div>
      </div>
    </div>
  );
}