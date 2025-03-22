import { Menu, X, LogOut, ChevronDown, FileText, MessageSquareQuote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Blog', href: '/blog' },
  { name: 'Tarifs', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

// Fonction pour vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
  try {
    const userJson = localStorage.getItem('autom8_user');
    return !!userJson;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Vérifier l'authentification au chargement et à chaque changement de route
  useEffect(() => {
    setIsAuthenticated(isUserLoggedIn());
  }, [location]);

  // Fermer le menu admin quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('autom8_user');
    window.location.reload();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
      <nav className="mx-auto flex max-w-[2000px] items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl sm:text-2xl font-bold text-transparent">
              AutoPro
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu principal</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={adminMenuRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors text-gray-900 hover:text-blue-600"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                <span>Administration</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link 
                    to="/admin/blog" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gestion du Blog
                  </Link>
                  <Link 
                    to="/admin/testimonials" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <MessageSquareQuote className="h-4 w-4 mr-2" />
                    Témoignages Clients
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setAdminMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/demo">
              <Button variant="primary" size="sm">
                Démonstration
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl sm:text-2xl font-bold text-transparent">
                AutoPro
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Fermer le menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <div className="mb-4">
                      <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Administration
                      </h3>
                      <div className="mt-2 space-y-1">
                        <Link
                          to="/admin/blog"
                          className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-gray-500" />
                            Gestion du Blog
                          </div>
                        </Link>
                        <Link
                          to="/admin/testimonials"
                          className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <MessageSquareQuote className="h-5 w-5 mr-2 text-gray-500" />
                            Témoignages Clients
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div
                      className="block"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                      </Button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/demo"
                    className="block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full">
                      Démonstration
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}