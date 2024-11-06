import React from 'react';
import { ChevronLeft, ChevronRight, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { signOut } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-zinc-900">
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-black p-1">
          <ChevronLeft className="w-5 h-5 text-zinc-200" />
        </button>
        <button className="rounded-full bg-black p-1">
          <ChevronRight className="w-5 h-5 text-zinc-200" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-zinc-200 hover:text-white">
          <Bell className="w-5 h-5" />
        </button>
        <button 
          onClick={signOut}
          className="flex items-center gap-2 rounded-full bg-black px-3 py-2 text-zinc-200 hover:text-white"
        >
          <User className="w-4 h-4" />
          <span className="text-sm">Profile</span>
        </button>
      </div>
    </header>
  );
}