import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, Lock, Unlock, LogOut } from 'lucide-react';
import { ref, get, remove, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  username: string;
  role: string;
  blocked: boolean;
  createdAt: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const data = snapshot.val() || {};

      const formattedUsers = Object.entries(data)
        .filter(([_, user]: [string, any]) => user.username !== 'admin')
        .map(([id, user]: [string, any]) => ({
          id,
          username: user.username,
          role: user.role,
          blocked: user.blocked || false,
          createdAt: user.createdAt
        }));

      setUsers(formattedUsers);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await remove(ref(db, `users/${userId}`));
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    try {
      await update(ref(db, `users/${userId}`), {
        blocked: !currentlyBlocked
      });
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, blocked: !currentlyBlocked }
          : user
      ));
      
      toast.success(`User ${currentlyBlocked ? 'unblocked' : 'blocked'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/create-user"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create User
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-zinc-400">Manage user accounts and permissions</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-zinc-700">
                    <th className="pb-3">Username</th>
                    <th className="pb-3">Created At</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-zinc-700/50">
                      <td className="py-4">
                        <span className="font-medium">{user.username}</span>
                      </td>
                      <td className="py-4 text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.blocked 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-green-500/10 text-green-500'
                        }`}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleBlock(user.id, user.blocked)}
                            className={`p-2 rounded-full ${
                              user.blocked
                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            }`}
                          >
                            {user.blocked ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}