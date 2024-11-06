import React, { useState } from 'react';
import { Home, Library, PlusSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AddPlaylistModal } from './AddPlaylistModal';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <aside className="w-64 bg-black p-6">
        <nav className="space-y-6">
          <div className="space-y-3">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
            >
              <Home />
              Home
            </Link>
            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
              <User />
              {user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
              <Library />
              Your Library
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-white"
            >
              <PlusSquare />
              Create Playlist
            </button>
          </div>

          <nav className="mt-6 pt-6 border-t border-zinc-800 flex flex-col gap-3">
            {/* Playlist list will be populated dynamically */}
          </nav>
        </nav>
      </aside>

      <AddPlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}