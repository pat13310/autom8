import { Shield, Lock, Clock, UserCheck } from 'lucide-react';

export function Privacy() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Politique de Confidentialité
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Nous accordons une importance particulière à la protection de vos données personnelles.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Collecte des données personnelles</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>Dans le cadre de nos services, nous collectons les données suivantes :</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    'Nom et prénom',
                    'Adresse email',
                    'Numéro de téléphone',
                    'Adresse postale',
                    'Données de connexion',
                    'Historique d\'utilisation',
                    'Préférences utilisateur',
                    'Données techniques'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Utilisation des données</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>Vos données sont utilisées pour :</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      title: 'Gestion du compte',
                      description: 'Administration de votre espace personnel et accès aux services'
                    },
                    {
                      title: 'Amélioration des services',
                      description: 'Analyse et optimisation de nos solutions pour mieux répondre à vos besoins'
                    },
                    {
                      title: 'Communication',
                      description: 'Envoi d\'informations sur nos services et actualités'
                    },
                    {
                      title: 'Support client',
                      description: 'Assistance et réponse à vos demandes'
                    }
                  ].map((item) => (
                    <div key={item.title} className="rounded-lg bg-gray-50 p-6">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="mt-2 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Conservation des données</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Nous conservons vos données personnelles pendant la durée nécessaire aux finalités 
                  pour lesquelles elles ont été collectées, dans le respect de la législation en vigueur.
                </p>
                <div className="mt-6 rounded-lg bg-gray-50 p-6">
                  <h3 className="font-semibold text-gray-900">Durées de conservation</h3>
                  <ul className="mt-4 space-y-3">
                    <li>Données de compte : Durée de l'inscription + 3 ans</li>
                    <li>Données de transaction : 10 ans</li>
                    <li>Données de navigation : 13 mois</li>
                    <li>Cookies : 13 mois maximum</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Vos droits</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    'Droit d\'accès',
                    'Droit de rectification',
                    'Droit à l\'effacement',
                    'Droit à la limitation',
                    'Droit à la portabilité',
                    'Droit d\'opposition'
                  ].map((right) => (
                    <div key={right} className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>{right}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-lg bg-blue-50 p-6">
                  <p className="font-semibold text-blue-900">Pour exercer vos droits :</p>
                  <p className="mt-2 text-blue-800">
                    Contactez notre Délégué à la Protection des Données :<br />
                    Email : dpo@autopro.com<br />
                    Adresse : 123 rue de l'Innovation, 75001 Paris
                  </p>
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