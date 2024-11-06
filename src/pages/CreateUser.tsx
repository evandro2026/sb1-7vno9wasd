import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCreateUser } from '../hooks/useCreateUser';

export function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { createUser, isLoading } = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUser({ 
        username: username.trim(), 
        password: password.trim() 
      });
      navigate('/admin');
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to create user:', error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setUsername(value);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New User</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter username"
              required
              minLength={3}
              maxLength={20}
              disabled={isLoading}
              autoComplete="off"
              pattern="[a-zA-Z0-9_-]+"
            />
            <p className="mt-1 text-xs text-zinc-400">
              3-20 characters, letters, numbers, underscores, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter password"
              required
              minLength={6}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Minimum 6 characters
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-400 text-black font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}