import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle: string;
  postId: string;
  postDate: string;
  postAuthor: string;
}

export function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  postId,
  postDate,
  postAuthor
}: DeletePostModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmation de suppression">
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 mr-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Êtes-vous sûr de vouloir supprimer cet article ?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Cette action est irréversible et toutes les données associées à cet article seront définitivement supprimées.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Détails de l'article</h4>
          <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
            <div className="text-gray-500 font-medium">Titre:</div>
            <div>{postTitle}</div>
            
            <div className="text-gray-500 font-medium">ID:</div>
            <div className="font-mono text-xs">{postId}</div>
            
            <div className="text-gray-500 font-medium">Date de création:</div>
            <div>{new Date(postDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            
            <div className="text-gray-500 font-medium">Auteur:</div>
            <div>{postAuthor}</div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer définitivement
          </Button>
        </div>
      </div>
    </Modal>
  );
}
