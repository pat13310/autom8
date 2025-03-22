import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Lock, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  main: [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Mentions Légales', href: '/legal' },
    { name: 'Politique de Confidentialité', href: '/privacy' },
    { name: 'CGU', href: '/terms' },
    { name: 'RGPD', href: '/rgpd' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Instagram', href: '#', icon: Instagram },
  ],
  admin: [
    { name: 'Administration', href: '/admin/login', icon: Lock },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[2000px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo et description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl font-bold text-transparent">
              AutoPro
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-xs">
              Solutions d'automatisation intelligente pour transformer votre entreprise.
            </p>
          </div>

          {/* Navigation principale */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
            <ul className="mt-2 space-y-1">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens légaux */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Légal</h3>
            <ul className="mt-2 space-y-1">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">123 rue de l'Innovation, 75001 Paris, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href="tel:+33123456789" className="text-sm text-gray-600 hover:text-blue-600">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href="mailto:contact@autopro.com" className="text-sm text-gray-600 hover:text-blue-600">
                  contact@autopro.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-gray-500">
              {new Date().getFullYear()} AutoPro. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
              <Link
                to="/admin/login"
                className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs ml-2 border-l border-gray-200 pl-2"
                aria-label="Administration"
              >
                <Lock className="h-4 w-4" />
                <span>Administration</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}