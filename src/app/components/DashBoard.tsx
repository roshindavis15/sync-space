"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Users, 
  Clock, 
  Star, 
  Filter,
  MoreHorizontal,
  Edit3,
  Share2,
  ChevronDown,
  User,
  Home,
  Archive
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  preview: string;
  lastEdited: string;
  collaborators: string[];
  isStarred: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data - replace with real data from your backend
  const mockNotes: Note[] = [
    {
      id: "1",
      title: "Project Roadmap Q1 2024",
      preview: "Planning and timeline for the first quarter including feature releases...",
      lastEdited: "2 hours ago",
      collaborators: ["A", "B"],
      isStarred: true
    },
    {
      id: "2", 
      title: "Team Meeting Notes",
      preview: "Weekly standup notes and action items for the development team...",
      lastEdited: "1 day ago",
      collaborators: ["C", "D", "E"],
      isStarred: false
    },
    {
      id: "3",
      title: "Design System Guidelines",
      preview: "Comprehensive guide for our design system components and usage...",
      lastEdited: "3 days ago",
      collaborators: ["B"],
      isStarred: true
    }
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleCreateNew = () => {
    // Navigate to new document or open modal
    console.log("Create new document");
  };

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "starred") return matchesSearch && note.isStarred;
    if (activeFilter === "shared") return matchesSearch && note.collaborators.length > 1;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SyncSpace
              </span>
            </div>

            {/* Right side - Search, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}

                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-white/10">
                      <div className="text-white font-medium">{session?.user?.name || "User"}</div>
                      <div className="text-gray-400 text-sm">{session?.user?.email}</div>
                    </div>
                    <div className="p-1">
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <nav className="space-y-2">
                <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <FileText className="w-5 h-5" />
                  <span>All Documents</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Star className="w-5 h-5" />
                  <span>Starred</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Users className="w-5 h-5" />
                  <span>Shared</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Archive className="w-5 h-5" />
                  <span>Archive</span>
                </a>
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-gray-400 text-sm font-medium mb-3">Storage</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Used</span>
                    <span className="text-white">2.1 GB of 15 GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '14%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-gray-300">Continue where you left off or start something new.</p>
              </div>
              <button 
                onClick={handleCreateNew}
                className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Document
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Documents</p>
                    <p className="text-2xl font-bold text-white">{mockNotes.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Collaborators</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Recent Activity</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              {/* Filter Tabs */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex space-x-1 mb-4 sm:mb-0">
                  {[
                    { key: 'all', label: 'All Documents' },
                    { key: 'starred', label: 'Starred' },
                    { key: 'shared', label: 'Shared' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === filter.key
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="md:hidden mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <div key={note.id} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {note.title}
                            </h3>
                            {note.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                          </div>
                          <p className="text-gray-400 mb-3 line-clamp-2">{note.preview}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Edited {note.lastEdited}</span>
                            </div>
                            {note.collaborators.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <div className="flex -space-x-1">
                                  {note.collaborators.map((collaborator, idx) => (
                                    <div key={idx} className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-semibold">
                                      {collaborator}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No documents found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery ? "Try adjusting your search terms" : "Create your first document to get started"}
                    </p>
                    <button 
                      onClick={handleCreateNew}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center mx-auto"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create New Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}