import { Building2, Mail, Phone, Globe } from 'lucide-react';

export function Legal() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Mentions Légales
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Informations légales et réglementaires concernant AutoPro et l'utilisation de nos services.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Éditeur du site</h2>
              </div>
              <div className="mt-6 space-y-4 text-gray-600">
                <p className="flex items-center gap-3">
                  <span className="font-semibold">AutoPro SAS</span>
                </p>
                <p>Capital social : 100 000 €</p>
                <p>RCS Paris B 123 456 789</p>
                <p>SIRET : 123 456 789 00001</p>
                <p>Code NAF : 6201Z</p>
                <p>TVA Intracommunautaire : FR 12 345678900</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>contact@autopro.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>123 rue de l'Innovation<br />75001 Paris, France</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>www.autopro.com</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Direction de la publication</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  <span className="font-semibold">Directeur de la publication :</span> Jean Dupont
                </p>
                <p>
                  <span className="font-semibold">Qualité :</span> Président d'AutoPro SAS
                </p>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Hébergement</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>Le site est hébergé par :</p>
                <div className="rounded-lg bg-gray-50 p-6">
                  <p className="font-semibold">Netlify, Inc.</p>
                  <p className="mt-2">2325 3rd Street, Suite 215</p>
                  <p>San Francisco, California 94107</p>
                  <p>United States</p>
                  <p className="mt-2">www.netlify.com</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Propriété intellectuelle</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  L'ensemble du site, y compris sa structure et son contenu (textes, images, photos, logos, 
                  marques, vidéos, sons, bases de données, applications et tous autres médias), est protégé 
                  par le droit d'auteur et autres droits de propriété intellectuelle.
                </p>
                <p>
                  Ces éléments sont la propriété exclusive d'AutoPro SAS. Toute reproduction, représentation, 
                  modification, publication ou adaptation de tout ou partie des éléments du site, quel que 
                  soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable 
                  d'AutoPro SAS.
                </p>
                <p>
                  Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient 
                  sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux 
                  dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                </p>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-10 shadow-lg ring-1 ring-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Crédits</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  <span className="font-semibold">Conception et développement :</span> AutoPro SAS
                </p>
                <p>
                  <span className="font-semibold">Photographies :</span> © AutoPro SAS - Tous droits réservés
                </p>
                <p>
                  <span className="font-semibold">Illustrations :</span> © AutoPro SAS - Tous droits réservés
                </p>
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