import { Testimonial } from '../types/testimonial';
import { Button } from './ui/button';
import { Trash, X } from 'lucide-react';

interface DeleteTestimonialModalProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteTestimonialModal({
  testimonial,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: DeleteTestimonialModalProps) {
  if (!isOpen || !testimonial) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Confirmer la suppression</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Nom:</span>
                  <span className="text-gray-900">{testimonial.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Entreprise:</span>
                  <span className="text-gray-900">{testimonial.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Poste:</span>
                  <span className="text-gray-900">{testimonial.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Mis en avant:</span>
                  <span className="text-gray-900">{testimonial.is_featured ? 'Oui' : 'Non'}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic line-clamp-2">{testimonial.content}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="gap-1"
              size="sm"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              variant="primary"
              className="gap-1 bg-red-600 hover:bg-red-700 text-white"
              size="sm"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
