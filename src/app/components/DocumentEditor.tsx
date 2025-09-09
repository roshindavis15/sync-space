"use client";

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Share, 
  Star,
  Users,
  Type,
  Hash,
  List,
  CheckSquare,
  Quote,
  Code,
  Image,
  Plus,
  GripVertical,
  Trash2
} from 'lucide-react';

interface Block {
  id: string;
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bullet_list' | 'numbered_list' | 'todo' | 'quote' | 'code';
  content: string;
  position: number;
  properties?: {
    checked?: boolean;
    level?: number;
  };
}

interface SlashCommand {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: Block['type'];
  keywords: string[];
}

const DocumentEditor: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const documentId = params?.id as string;

  // Document state
  const [title, setTitle] = useState('Untitled Document');
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'initial',
      type: 'paragraph',
      content: '',
      position: 0
    }
  ]);

  // Editor state
  const [focusedBlockId, setFocusedBlockId] = useState<string>('initial');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashQuery, setSlashQuery] = useState('');
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  // Slash commands
  const slashCommands: SlashCommand[] = [
    {
      id: 'paragraph',
      name: 'Text',
      description: 'Just start typing with plain text',
      icon: <Type className="w-4 h-4" />,
      type: 'paragraph',
      keywords: ['text', 'paragraph', 'p']
    },
    {
      id: 'heading_1',
      name: 'Heading 1',
      description: 'Big section heading',
      icon: <Hash className="w-4 h-4" />,
      type: 'heading_1',
      keywords: ['heading', 'h1', 'title', 'big']
    },
    {
      id: 'heading_2',
      name: 'Heading 2',
      description: 'Medium section heading',
      icon: <Hash className="w-4 h-4" />,
      type: 'heading_2',
      keywords: ['heading', 'h2', 'subtitle', 'medium']
    },
    {
      id: 'heading_3',
      name: 'Heading 3',
      description: 'Small section heading',
      icon: <Hash className="w-4 h-4" />,
      type: 'heading_3',
      keywords: ['heading', 'h3', 'small']
    },
    {
      id: 'bullet_list',
      name: 'Bulleted list',
      description: 'Create a simple bulleted list',
      icon: <List className="w-4 h-4" />,
      type: 'bullet_list',
      keywords: ['bullet', 'list', 'ul', 'unordered']
    },
    {
      id: 'numbered_list',
      name: 'Numbered list',
      description: 'Create a list with numbering',
      icon: <List className="w-4 h-4" />,
      type: 'numbered_list',
      keywords: ['numbered', 'list', 'ol', 'ordered', '1']
    },
    {
      id: 'todo',
      name: 'To-do list',
      description: 'Track tasks with a to-do list',
      icon: <CheckSquare className="w-4 h-4" />,
      type: 'todo',
      keywords: ['todo', 'task', 'check', 'checkbox']
    },
    {
      id: 'quote',
      name: 'Quote',
      description: 'Capture a quote',
      icon: <Quote className="w-4 h-4" />,
      type: 'quote',
      keywords: ['quote', 'blockquote', 'citation']
    },
    {
      id: 'code',
      name: 'Code',
      description: 'Capture a code snippet',
      icon: <Code className="w-4 h-4" />,
      type: 'code',
      keywords: ['code', 'snippet', 'programming', 'monospace']
    }
  ];

  // Filter slash commands based on query
  const filteredCommands = slashCommands.filter(command =>
    command.name.toLowerCase().includes(slashQuery.toLowerCase()) ||
    command.keywords.some(keyword => keyword.includes(slashQuery.toLowerCase()))
  );

  // Generate new block ID
  const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new block
  const addBlock = (type: Block['type'], afterBlockId: string, content: string = '') => {
    const afterBlock = blocks.find(b => b.id === afterBlockId);
    const newPosition = afterBlock ? afterBlock.position + 0.5 : blocks.length;
    
    const newBlock: Block = {
      id: generateBlockId(),
      type,
      content,
      position: newPosition
    };

    setBlocks(prev => [...prev, newBlock].sort((a, b) => a.position - b.position));
    setFocusedBlockId(newBlock.id);
    
    // Focus the new block after render
    setTimeout(() => {
      const element = document.getElementById(newBlock.id);
      element?.focus();
    }, 0);

    return newBlock.id;
  };

  // Update block content
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  // Delete block
  const deleteBlock = (blockId: string) => {
    if (blocks.length === 1) return; // Don't delete the last block
    
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    const prevBlock = blocks[blockIndex - 1];
    
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    
    if (prevBlock) {
      setFocusedBlockId(prevBlock.id);
      setTimeout(() => {
        const element = document.getElementById(prevBlock.id);
        element?.focus();
      }, 0);
    }
  };

  // Handle key events
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (block.content.trim() === '' && block.type !== 'paragraph') {
        // Convert empty non-paragraph block to paragraph
        updateBlock(blockId, { type: 'paragraph' });
      } else {
        // Create new block
        addBlock('paragraph', blockId);
      }
    }

    // Handle Backspace on empty block
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      if (block.type !== 'paragraph') {
        updateBlock(blockId, { type: 'paragraph' });
      } else if (blocks.length > 1) {
        deleteBlock(blockId);
      }
    }

    // Handle slash command
    if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setShowSlashMenu(true);
      setSlashQuery('');
      
      // Position slash menu
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      setSlashMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }

    // Hide slash menu on escape
    if (e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  // Handle block input
  const handleInput = (e: React.FormEvent<HTMLDivElement>, blockId: string) => {
    const content = e.currentTarget.textContent || '';
    updateBlock(blockId, { content });

    // Handle slash command filtering
    if (showSlashMenu && content.startsWith('/')) {
      setSlashQuery(content.slice(1));
    } else if (showSlashMenu && !content.startsWith('/')) {
      setShowSlashMenu(false);
    }
  };

  // Apply slash command
  const applySlashCommand = (command: SlashCommand) => {
    const block = blocks.find(b => b.id === focusedBlockId);
    if (!block) return;

    updateBlock(focusedBlockId, { 
      type: command.type, 
      content: '' 
    });
    
    setShowSlashMenu(false);
    
    // Focus the block after type change
    setTimeout(() => {
      const element = document.getElementById(focusedBlockId);
      element?.focus();
    }, 0);
  };

  // Render block based on type
  const renderBlock = (block: Block) => {
    const baseClasses = "outline-none focus:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors";
    const commonProps = {
      id: block.id,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: (e: React.FormEvent<HTMLDivElement>) => handleInput(e, block.id),
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, block.id),
      onFocus: () => setFocusedBlockId(block.id),
      className: baseClasses,
      'data-placeholder': getPlaceholder(block.type)
    };

    const style = {
      position: 'relative' as const,
      '::before': block.content === '' ? {
        content: `"${getPlaceholder(block.type)}"`,
        position: 'absolute' as const,
        color: '#9CA3AF',
        pointerEvents: 'none' as const
      } : undefined
    };

    switch (block.type) {
      case 'heading_1':
        return <h1 {...commonProps} className={`${baseClasses} text-3xl font-bold text-gray-900`} />;
      case 'heading_2':
        return <h2 {...commonProps} className={`${baseClasses} text-2xl font-bold text-gray-900`} />;
      case 'heading_3':
        return <h3 {...commonProps} className={`${baseClasses} text-xl font-bold text-gray-900`} />;
      case 'bullet_list':
        return (
          <div className="flex items-start space-x-2">
            <span className="text-gray-400 mt-1">•</span>
            <div {...commonProps} className={`${baseClasses} flex-1`} />
          </div>
        );
      case 'numbered_list':
        return (
          <div className="flex items-start space-x-2">
            <span className="text-gray-400 mt-1">1.</span>
            <div {...commonProps} className={`${baseClasses} flex-1`} />
          </div>
        );
      case 'todo':
        return (
          <div className="flex items-start space-x-2">
            <input 
              type="checkbox" 
              className="mt-1 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              checked={block.properties?.checked || false}
              onChange={(e) => updateBlock(block.id, { 
                properties: { ...block.properties, checked: e.target.checked }
              })}
            />
            <div {...commonProps} className={`${baseClasses} flex-1 ${block.properties?.checked ? 'line-through text-gray-500' : ''}`} />
          </div>
        );
      case 'quote':
        return (
          <div className="border-l-4 border-gray-300 pl-4">
            <div {...commonProps} className={`${baseClasses} italic text-gray-700`} />
          </div>
        );
      case 'code':
        return (
          <div className="bg-gray-100 rounded-lg p-3">
            <div {...commonProps} className={`${baseClasses} font-mono text-sm bg-transparent`} />
          </div>
        );
      default:
        return <div {...commonProps} className={`${baseClasses} text-gray-900`} />;
    }
  };

  // Get placeholder text for block type
  const getPlaceholder = (type: Block['type']) => {
    switch (type) {
      case 'heading_1': return 'Heading 1';
      case 'heading_2': return 'Heading 2';
      case 'heading_3': return 'Heading 3';
      case 'bullet_list': return 'List item';
      case 'numbered_list': return 'List item';
      case 'todo': return 'To-do';
      case 'quote': return 'Quote';
      case 'code': return 'Code';
      default: return "Type '/' for commands";
    }
  };

  // Close slash menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(event.target as Node)) {
        setShowSlashMenu(false);
      }
    };

    if (showSlashMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSlashMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-500 focus:rounded px-2 py-1"
                  placeholder="Untitled"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Users className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Star className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div ref={editorRef} className="space-y-2">
          {blocks.map((block) => (
            <div 
              key={block.id} 
              className="group relative"
              draggable
              onDragStart={() => setDraggedBlock(block.id)}
              onDragEnd={() => setDraggedBlock(null)}
            >
              {/* Block Handle */}
              <div className="absolute left-0 top-0 -ml-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <button 
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
                  onMouseDown={() => setDraggedBlock(block.id)}
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => addBlock('paragraph', block.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Block Content */}
              <div className="pl-6">
                {renderBlock(block)}
              </div>

              {/* Delete Button */}
              {blocks.length > 1 && (
                <button 
                  onClick={() => deleteBlock(block.id)}
                  className="absolute right-0 top-0 -mr-8 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Slash Command Menu */}
        {showSlashMenu && (
          <div 
            ref={slashMenuRef}
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 w-80"
            style={{ 
              top: slashMenuPosition.top, 
              left: slashMenuPosition.left 
            }}
          >
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              BASIC BLOCKS
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredCommands.map((command) => (
                <button
                  key={command.id}
                  onClick={() => applySlashCommand(command)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="text-gray-400">
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{command.name}</div>
                    <div className="text-sm text-gray-500">{command.description}</div>
                  </div>
                </button>
              ))}
            </div>
            
            {filteredCommands.length === 0 && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No matching blocks found
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentEditor;