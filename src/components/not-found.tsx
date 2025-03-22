import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export function NotFound() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page non trouvée
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Désolé, la page que vous recherchez n&apos;existe pas.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button variant="primary">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
