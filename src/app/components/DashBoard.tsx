"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Users, 
  Clock, 
  Star,
  Folder,
  Grid3X3,
  List,
  ChevronDown,
  Settings,
  Bell,
  User
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'document' | 'database' | 'page';
  lastModified: string;
  collaborators: string[];
  isStarred: boolean;
  preview: string;
}

interface Workspace {
  id: string;
  name: string;
  documents: Document[];
  members: number;
}

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('personal');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data - replace with actual API calls
  const [workspaces] = useState<Workspace[]>([
    {
      id: 'personal',
      name: 'Personal Workspace',
      members: 1,
      documents: [
        {
          id: '1',
          title: 'Project Planning',
          type: 'document',
          lastModified: '2 hours ago',
          collaborators: ['user1'],
          isStarred: true,
          preview: 'Planning document for the new feature release...'
        },
        {
          id: '2',
          title: 'Meeting Notes',
          type: 'document',
          lastModified: '1 day ago',
          collaborators: ['user1', 'user2'],
          isStarred: false,
          preview: 'Notes from the weekly team sync meeting...'
        },
        {
          id: '3',
          title: 'Task Database',
          type: 'database',
          lastModified: '3 days ago',
          collaborators: ['user1', 'user2', 'user3'],
          isStarred: true,
          preview: 'Kanban board for tracking project tasks...'
        }
      ]
    }
  ]);

  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspace);
  
  const filteredDocuments = currentWorkspace?.documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateDocument = () => {
    // Navigate to new document editor
    router.push('/document/new');
  };

  const handleOpenDocument = (docId: string) => {
    router.push(`/document/${docId}`);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">SyncSpace</h1>
              </div>
              
              <div className="hidden md:flex items-center space-x-1">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Folder className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{currentWorkspace?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <span className="text-sm text-gray-700 hidden md:block">
                    {session.user?.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        Workspace Settings
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 space-y-4">
            {/* Create New Button */}
            <button 
              onClick={handleCreateDocument}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Document</span>
            </button>

            {/* Navigation */}
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>All Documents</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Star className="w-5 h-5" />
                <span>Starred</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5" />
                <span>Recent</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5" />
                <span>Shared with me</span>
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search and Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Documents Grid/List */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first document'}
              </p>
              {!searchQuery && (
                <button 
                  onClick={handleCreateDocument}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Document
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => handleOpenDocument(doc.id)}
                  className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
                    viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center space-x-4'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-xs text-gray-500 uppercase tracking-wider">
                            {doc.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.preview}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{doc.lastModified}</span>
                        <div className="flex -space-x-1">
                          {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                            <div key={index} className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white">
                              {collaborator.slice(0, 1).toUpperCase()}
                            </div>
                          ))}
                          {doc.collaborators.length > 3 && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                              +{doc.collaborators.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{doc.preview}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{doc.lastModified}</span>
                        <div className="flex -space-x-1">
                          {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                            <div key={index} className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white">
                              {collaborator.slice(0, 1).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {doc.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;