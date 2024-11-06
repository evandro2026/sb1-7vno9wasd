import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { auth, db } from '../lib/firebase';
import { ref, set, get } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const createAdminIfNotExists = async () => {
    try {
      // Check if admin exists in the database
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val();
      
      const adminExists = users && Object.values(users).some(
        (user: any) => user.username === 'admin'
      );

      if (!adminExists) {
        // Create admin account
        const adminEmail = 'admin@music.com';
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, '159753');
        const { uid } = userCredential.user;

        // Store admin data in the database
        await set(ref(db, `users/${uid}`), {
          username: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error checking/creating admin:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createAdminIfNotExists();
      await signIn(username.toLowerCase(), password);

      if (username.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-zinc-900 to-zinc-900">
      <div className="bg-zinc-800/50 p-8 rounded-lg shadow-lg w-96 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">Music Player</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-zinc-700/50 border-transparent focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white px-4 py-2"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-zinc-700/50 border-transparent focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white px-4 py-2"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-black font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}