import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from './MarkdownRenderer';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  Link, 
  Image, 
  Quote, 
  Code, 
  Undo2, 
  Redo2,
  List,
  ListOrdered,
  Table,
  Palette,
  Plus
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  title: string;
}

const colors = {
  text: [
    { name: 'Bleu', hex: '#3b82f6', category: 'primary', description: 'Titres et liens' },
    { name: 'Vert', hex: '#10b981', category: 'success', description: 'Succès et validations' },
    { name: 'Rouge', hex: '#ef4444', category: 'danger', description: 'Erreurs et alertes' },
    { name: 'Orange', hex: '#f97316', category: 'warning', description: 'Avertissements' },
    { name: 'Violet', hex: '#8b5cf6', category: 'accent', description: 'Mise en valeur' },
    { name: 'Gris', hex: '#6b7280', category: 'neutral', description: 'Texte standard' },
    { name: 'Jaune', hex: '#fbbf24', category: 'warning', description: 'Avertissements lumineux' },
    { name: 'Cyan', hex: '#06b6d4', category: 'info', description: 'Informations' },
    { name: 'Rose', hex: '#ec4899', category: 'accent', description: 'Mise en valeur douce' },
    { name: 'Marron', hex: '#7c4d00', category: 'neutral', description: 'Texte standard sombre' },
    { name: 'Noir', hex: '#000000', category: 'neutral', description: 'Texte noir' },
  ],
  background: [
    { name: 'Bleu clair', hex: '#eff6ff', category: 'primary', description: 'Sections importantes' },
    { name: 'Vert clair', hex: '#f0fdf4', category: 'success', description: 'Messages de succès' },
    { name: 'Rouge clair', hex: '#fef2f2', category: 'danger', description: 'Messages d\'erreur' },
    { name: 'Orange clair', hex: '#fff7ed', category: 'warning', description: 'Avertissements' },
    { name: 'Violet clair', hex: '#f5f3ff', category: 'accent', description: 'Sections spéciales' },
    { name: 'Gris clair', hex: '#f9fafb', category: 'neutral', description: 'Sections secondaires' }
  ]
};

const ToolbarButton = ({ icon, onClick, title }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="h-8 w-8 p-0 hover:bg-muted"
    onClick={onClick}
    title={title}
  >
    {icon}
  </Button>
);

const insertTemplate = (
  template: string,
  textArea: HTMLTextAreaElement,
  selectionOffset = 0
) => {
  const start = textArea.selectionStart;
  const end = textArea.selectionEnd;
  const text = textArea.value;
  const before = text.substring(0, start);
  const selection = text.substring(start, end);
  const after = text.substring(end, text.length);
  const newText = before + template.replace('$1', selection) + after;
  textArea.value = newText;
  textArea.focus();
  const newStart = start + selectionOffset;
  const newEnd = newStart + selection.length;
  textArea.selectionStart = newStart;
  textArea.selectionEnd = newEnd;
  return newText;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [customColor, setCustomColor] = useState('#3b82f6'); // Couleur par défaut
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastCursorPosition, setLastCursorPosition] = useState<number>(0);
  const [lastScrollPosition, setLastScrollPosition] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effet pour restaurer la position du curseur après un rendu
  useEffect(() => {
    if (textareaRef.current && activeTab === 'edit') {
      const textarea = textareaRef.current;
      textarea.scrollTop = lastScrollPosition;
      textarea.focus();
      textarea.setSelectionRange(lastCursorPosition, lastCursorPosition);
    }
  }, [value, activeTab, lastCursorPosition, lastScrollPosition]);

  // Mettre à jour le contenu et positionner le curseur
  const updateContentAndPosition = (newValue: string, newCursorPos: number) => {
    // Sauvegarder la position de défilement
    const scrollTop = textareaRef.current?.scrollTop || 0;
    
    // Mettre à jour le contenu
    onChange(newValue);
    
    // Mettre à jour l'historique
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Restaurer la position de défilement et positionner le curseur
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = scrollTop;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  };

  const handleUndo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleRedo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleToolbarAction = (
    e: React.MouseEvent<HTMLButtonElement>,
    action: string
  ) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let replacement = '';

    switch (action) {
      case 'bold':
        replacement = `<b>${selectedText}</b>`;
        break;
      case 'italic':
        replacement = `<i>${selectedText}</i>`;
        break;
      case 'heading1':
        replacement = `<h1 class="text-2xl font-bold">${selectedText}</h1><br>`;
        break;
      case 'heading2':
        replacement = `<h2 class="text-xl font-semibold">${selectedText}</h2><br>`;
        break;
      case 'heading3':
        replacement = `<h3 class="text-lg font-medium">${selectedText}</h3><br>`;
        break;
      case 'link':
        replacement = `<a href="url">${selectedText}</a>`;
        break;
      case 'image':
        replacement = `<img src="url" alt="${selectedText}">`;
        break;
      case 'quote':
        replacement = `<blockquote>${selectedText}</blockquote>`;
        break;
      case 'code':
        replacement = `<code>${selectedText}</code>`;
        break;
      default:
        break;
    }

    const newContent = value.substring(0, start) + replacement + value.substring(end);
    const newCursorPos = start + replacement.length;
    updateContentAndPosition(newContent, newCursorPos);
  };

  const insertHeading = (level: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const action = `heading${level}` as 'heading1' | 'heading2' | 'heading3';
    handleToolbarAction(e, action);
  };

  const insertCallout = (type: 'info' | 'warning' | 'success') => (e: React.MouseEvent<HTMLButtonElement>) => {
    const template = `> [!${type}]\n> $1\n`;
    handleToolbarAction(e, template);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Gérer les raccourcis clavier pour Undo/Redo
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      handleUndo(e as unknown as React.MouseEvent<HTMLButtonElement>);
      return;
    }
    
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      handleRedo(e as unknown as React.MouseEvent<HTMLButtonElement>);
      return;
    }
    
    // Raccourcis pour le formatage
    if (e.ctrlKey) {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      let newContent = value;
      let newCursorPos = start;
      
      switch (e.key) {
        case 'b': // Gras
          e.preventDefault();
          const boldText = `<b>${selectedText}</b>`;
          newContent = value.substring(0, start) + boldText + value.substring(end);
          newCursorPos = start + boldText.length;
          updateContentAndPosition(newContent, newCursorPos);
          return;
          
        case 'i': // Italique
          e.preventDefault();
          const italicText = `<i>${selectedText}</i>`;
          newContent = value.substring(0, start) + italicText + value.substring(end);
          newCursorPos = start + italicText.length;
          updateContentAndPosition(newContent, newCursorPos);
          return;
          
        case 'h': // Titre (h1)
          e.preventDefault();
          const headingText = `<h1 class="text-2xl font-bold">${selectedText}</h1>`;
          newContent = value.substring(0, start) + headingText + value.substring(end);
          newCursorPos = start + headingText.length;
          updateContentAndPosition(newContent, newCursorPos);
          return;
          
        case 'k': // Lien
          e.preventDefault();
          const linkText = `<a href="url">${selectedText}</a>`;
          newContent = value.substring(0, start) + linkText + value.substring(end);
          newCursorPos = start + linkText.length;
          updateContentAndPosition(newContent, newCursorPos);
          return;
          
        case 'l': // Liste à puces
          e.preventDefault();
          insertList(e as unknown as React.MouseEvent<HTMLButtonElement>);
          return;
          
        case 'o': // Liste ordonnée
          e.preventDefault();
          insertOrderedList(e as unknown as React.MouseEvent<HTMLButtonElement>);
          return;
      }
    }
    
    // Shift+Entrée pour insérer un <br>
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = 
        value.substring(0, start) + 
        "<br>" + 
        value.substring(end);
      
      const newCursorPos = start + 4; // Après le <br>
      updateContentAndPosition(newValue, newCursorPos);
      return;
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Vérifier si nous sommes dans une liste
      const currentLine = getCurrentLine(value, start);
      const bulletMatch = currentLine.match(/^(\s*)[-*•]\s+(.*)$/);
      const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.*)$/);
      
      if (bulletMatch) {
        // Continuer la liste à puces
        const [, indent, text] = bulletMatch;
        if (text.trim() === '') {
          // Liste vide, terminer la liste et ajouter un saut de ligne
          const lineStart = value.lastIndexOf('\n', start - 1) + 1 || 0;
          const newValue = value.substring(0, lineStart) + "\n" + value.substring(start);
          updateContentAndPosition(newValue, lineStart + 1);
        } else {
          // Ajouter un nouvel élément de liste
          const newValue = 
            value.substring(0, end) + 
            "\n" + indent + "- ";
          updateContentAndPosition(newValue, end + 3 + indent.length);
        }
      } else if (numberMatch) {
        // Continuer la liste numérotée
        const [, indent, number, text] = numberMatch;
        if (text.trim() === '') {
          // Liste vide, terminer la liste et ajouter un saut de ligne
          const lineStart = value.lastIndexOf('\n', start - 1) + 1 || 0;
          const newValue = value.substring(0, lineStart) + "\n" + value.substring(start);
          updateContentAndPosition(newValue, lineStart + 1);
        } else {
          // Ajouter un nouvel élément de liste
          const nextNumber = parseInt(number) + 1;
          const newValue = 
            value.substring(0, end) + 
            "\n" + indent + nextNumber + ". ";
          updateContentAndPosition(newValue, end + 4 + indent.length + (nextNumber >= 10 ? 1 : 0));
        }
      } else {
        // Saut de ligne normal
        const newValue = 
          value.substring(0, start) + 
          "\n" + 
          value.substring(end);
        
        const newCursorPos = start + 1; // Après le saut de ligne
        updateContentAndPosition(newValue, newCursorPos);
      }
    }
  };

  // Obtenir la ligne courante
  const getCurrentLine = (text: string, cursorPos: number): string => {
    const lineStart = text.lastIndexOf('\n', cursorPos - 1) + 1 || 0;
    const lineEnd = text.indexOf('\n', cursorPos);
    return text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
  };

  // Insérer une liste à puces
  const insertList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let replacement = '';
    if (selectedText.trim() === '') {
      replacement = "- Item 1\n- Item 2\n- Item 3";
    } else {
      // Convertir le texte sélectionné en liste
      replacement = selectedText
        .split('\n')
        .map(line => line.trim() ? `- ${line}` : line)
        .join('\n');
    }
    
    const newContent = value.substring(0, start) + replacement + value.substring(end);
    const newCursorPos = start + replacement.length;
    updateContentAndPosition(newContent, newCursorPos);
  };

  // Insérer une liste ordonnée
  const insertOrderedList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let replacement = '';
    if (selectedText.trim() === '') {
      replacement = "1. Item 1\n2. Item 2\n3. Item 3";
    } else {
      // Convertir le texte sélectionné en liste numérotée
      replacement = selectedText
        .split('\n')
        .map((line, index) => line.trim() ? `${index + 1}. ${line}` : line)
        .join('\n');
    }
    
    const newContent = value.substring(0, start) + replacement + value.substring(end);
    const newCursorPos = start + replacement.length;
    updateContentAndPosition(newContent, newCursorPos);
  };

  const insertTable = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tableTemplate = `
<table>
  <tr>
    <th>En-tête 1</th>
    <th>En-tête 2</th>
    <th>En-tête 3</th>
  </tr>
  <tr>
    <td>Cellule 1</td>
    <td>Cellule 2</td>
    <td>Cellule 3</td>
  </tr>
  <tr>
    <td>Cellule 4</td>
    <td>Cellule 5</td>
    <td>Cellule 6</td>
  </tr>
</table>
`;
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newValue = 
      value.substring(0, start) + 
      tableTemplate + 
      value.substring(end);
    
    const newCursorPos = start + tableTemplate.length;
    updateContentAndPosition(newValue, newCursorPos);
  };

  const insertColor = (color: string, type: 'text' | 'background') => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const template = type === 'text' 
      ? `<span style="color: ${color}">$1</span>` 
      : `<span style="background-color: ${color}">$1</span>`;
    
    const textArea = document.querySelector<HTMLTextAreaElement>('#markdown-editor');
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const selectedText = value.substring(start, end);
      
      const replacement = template.replace('$1', selectedText);
      const newContent = value.substring(0, start) + replacement + value.substring(end);
      
      const newCursorPos = start + replacement.length;
      updateContentAndPosition(newContent, newCursorPos);
    }
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    insertColor(color, 'text');
  };

  return (
    <div className="relative z-10" >
      <div className="flex items-center space-x-1 border-b p-1 bg-background sticky top-0" style={{ zIndex: 10 }}>
        <Button variant="ghost" size="sm" onClick={handleUndo} title="Annuler (Ctrl+Z)">
          <Undo2 size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRedo} title="Rétablir (Ctrl+Y)">
          <Redo2 size={18} />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={insertHeading(1)} title="Titre 1">
          <Heading1 size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertHeading(2)} title="Titre 2">
          <Heading2 size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertHeading(3)} title="Titre 3">
          <Heading3 size={18} />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={(e) => handleToolbarAction(e, 'bold')} title="Gras (Ctrl+B)">
          <Bold size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => handleToolbarAction(e, 'italic')} title="Italique (Ctrl+I)">
          <Italic size={18} />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={(e) => handleToolbarAction(e, 'link')} title="Lien (Ctrl+K)">
          <Link size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => handleToolbarAction(e, 'image')} title="Image">
          <Image size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => handleToolbarAction(e, 'quote')} title="Citation">
          <Quote size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => handleToolbarAction(e, 'code')} title="Code">
          <Code size={18} />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={insertList} title="Liste à puces (Ctrl+L)">
          <List size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertOrderedList} title="Liste numérotée (Ctrl+O)">
          <ListOrdered size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertTable} title="Tableau">
          <Table size={18} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Couleur du texte"
            >
              <Palette size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[320px] p-1 bg-white border-0 shadow-none" 
            align="end"
            sideOffset={5}
            style={{ 
              zIndex: 50,
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'transparent'
            }}
          >
            <div className="bg-white rounded-lg border shadow-lg p-1">
              <div>
                <div className="text-[10px] font-medium mb-0.5 text-foreground/80 px-1 py-1 bg-gray-50">Couleur du texte</div>
                <div className="grid grid-cols-4 gap-y-2">
                  {colors.text.map((color) => (
                    <div
                      key={color.hex}
                      onClick={insertColor(color.hex, 'text')}
                      className="group relative flex flex-col items-center gap-0 p-0.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      title={color.description}
                    >
                      <div 
                        className="w-4 h-4 rounded-full ring-1 ring-border/50 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-30 transition-opacity" />
                      </div>
                      <span className="text-[9px] text-center font-medium text-foreground/70 group-hover:text-foreground transition-colors leading-tight">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 my-2">
                  <input 
                    type="color" 
                    id="customColor" 
                    className="ms-7 w-5 h-5 border rounded-full" 
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    title="Choisissez une couleur personnalisée"
                  />
                  <label htmlFor="customColor" className="text-xs font-medium">Couleur personnalisée: <span className="font-bold">{customColor}</span></label>
                  <button className="flex items-center bg-blue-500 text-white rounded p-1">
                    <Plus className="mr-1 h-3 w-3" /> Ajouter
                  </button>
                </div>

              </div>

              <div className="border-t mt-0.5 pt-0.5">
                <div className="text-[10px] font-medium mb-0.5 text-foreground/80 px-1 py-1 bg-gray-50">Couleur de fond</div>
                <div className="grid grid-cols-4 gap-y-2">
                  {colors.background.map((color) => (
                    <div
                      key={color.hex}
                      onClick={insertColor(color.hex, 'background')}
                      className="group relative flex flex-col items-center gap-0 p-0.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      title={color.description}
                    >
                      <div 
                        className="w-4 h-4 rounded-full ring-1 ring-border/50 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-5 transition-opacity"
                          style={{ backgroundColor: color.category === 'neutral' ? '#000' : color.hex }}
                        />
                      </div>
                      <span className="text-[9px] text-center font-medium text-foreground/70 group-hover:text-foreground transition-colors leading-tight">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-0.5 pt-0.5">
                <div className="text-[8px] text-muted-foreground px-0.5">
                  Survolez pour voir l'utilisation
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-[400px]">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="edit">Éditer</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="m-0">
          <textarea
            ref={textareaRef}
            id="markdown-editor"
            value={value}
            onChange={(e) => {
              const textarea = e.target;
              const newValue = e.target.value;
              const cursorPos = textarea.selectionStart;
              const scrollTop = textarea.scrollTop;
              
              // Sauvegarder les positions
              setLastCursorPosition(cursorPos);
              setLastScrollPosition(scrollTop);
              
              // Mettre à jour le contenu
              onChange(newValue);
              
              // Mettre à jour l'historique
              const newHistory = history.slice(0, historyIndex + 1);
              newHistory.push(newValue);
              if (newHistory.length > 50) newHistory.shift();
              setHistory(newHistory);
              setHistoryIndex(newHistory.length - 1);
            }}
            onKeyDown={handleKeyDown}
            className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="Écrivez votre contenu en Markdown ici..."
          />
        </TabsContent>
        
        <TabsContent value="preview" className="m-0">
          <div className="p-4 min-h-[400px] bg-background">
            <MarkdownRenderer 
              content={value} 
              className="prose-sm max-w-none"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
