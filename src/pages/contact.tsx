import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Check, Clock } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: '', email: '', message: '' });
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-10">
        <div className="relative z-10 mx-auto max-w-2xl text-center mb-10">
          <div className="absolute inset-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-200 to-blue-400 opacity-20"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <h2 className="text-sm font-semibold leading-6 text-blue-600 uppercase tracking-wider mb-2">Votre contact</h2>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Contactez-nous
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-lg mx-auto">
            Notre équipe est là pour répondre à toutes vos questions sur nos solutions d'automatisation.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-hidden rounded-xl shadow-md">
            <div className="lg:col-span-2 bg-blue-600 text-white p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-blue-500 rounded-full opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 -mb-6 -ml-6 bg-blue-700 rounded-full opacity-30"></div>
              
              <h3 className="text-lg font-semibold mb-5 relative z-10">Nos coordonnées</h3>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white">Email</h3>
                    <a href="mailto:contact@autopro.com" className="text-blue-100 hover:text-white transition-colors text-sm">
                      contact@autopro.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white">Téléphone</h3>
                    <a href="tel:+33123456789" className="text-blue-100 hover:text-white transition-colors text-sm">
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white">Adresse</h3>
                    <p className="text-blue-100 text-sm">
                      123 rue de l'Innovation<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white">Horaires</h3>
                    <p className="text-blue-100 text-sm">
                      Lun-Ven: 9h - 18h<br />
                      Sam-Dim: Fermé
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Envoyez-nous un message</h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Message envoyé !</h4>
                  <p className="mt-1 text-sm text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="sr-only">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        className="px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                        className="px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={7}
                      value={formState.message}
                      onChange={handleChange}
                      required
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer le message
                          <Send className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}