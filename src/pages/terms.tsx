import { Scale, Users, Key, AlertCircle } from 'lucide-react';

export function Terms() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Conditions Générales d'Utilisation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Les présentes conditions régissent l'utilisation de nos services.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">1. Objet</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les 
                  modalités et conditions d'utilisation des services proposés sur le site AutoPro, ainsi 
                  que de définir les droits et obligations des parties dans ce cadre.
                </p>
                <p>
                  Elles constituent le contrat entre AutoPro et l'utilisateur. L'accès au site est 
                  subordonné à l'acceptation sans réserve des présentes CGU.
                </p>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">2. Accès aux services</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Les services sont accessibles à tout utilisateur disposant d'un accès à Internet. Tous 
                  les coûts afférents à l'accès aux services, que ce soient les frais matériels, logiciels 
                  ou d'accès à Internet sont exclusivement à la charge de l'utilisateur.
                </p>
                <div className="mt-6 rounded-lg bg-gray-50 p-6">
                  <h3 className="font-semibold text-gray-900">Conditions d'accès</h3>
                  <ul className="mt-4 space-y-3">
                    <li>Être une personne physique majeure ou morale</li>
                    <li>Disposer d'une connexion Internet</li>
                    <li>Accepter les présentes CGU</li>
                    <li>Fournir des informations exactes et à jour</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">3. Propriété intellectuelle</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  L'ensemble des éléments constituant le site (textes, graphiques, logiciels, images, etc.) 
                  est la propriété exclusive d'AutoPro. Toute reproduction, représentation, modification ou 
                  adaptation totale ou partielle du site est strictement interdite.
                </p>
                <div className="mt-6 rounded-lg bg-yellow-50 p-6">
                  <p className="font-semibold text-yellow-800">Important :</p>
                  <p className="mt-2 text-yellow-700">
                    Toute utilisation non autorisée des contenus ou services du site pourra faire l'objet 
                    de poursuites judiciaires.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">4. Responsabilité</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  AutoPro ne pourra être tenue responsable des dommages directs ou indirects causés au 
                  matériel de l'utilisateur lors de l'accès au site, et résultant de l'apparition d'un 
                  bug ou d'une incompatibilité.
                </p>
                <p>
                  AutoPro ne pourra également être tenue responsable des dommages indirects consécutifs 
                  à l'utilisation du site.
                </p>
                <div className="mt-6 rounded-lg bg-gray-50 p-6">
                  <h3 className="font-semibold text-gray-900">Limitations de responsabilité</h3>
                  <ul className="mt-4 space-y-3">
                    <li>Interruptions techniques</li>
                    <li>Attaques informatiques</li>
                    <li>Incompatibilités matérielles</li>
                    <li>Force majeure</li>
                  </ul>
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