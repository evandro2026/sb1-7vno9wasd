import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface CreateUserData {
  username: string;
  password: string;
}

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async ({ username, password }: CreateUserData): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Basic validation
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
      }

      // Check if username is reserved
      if (username.toLowerCase() === 'admin') {
        throw new Error('This username is reserved');
      }

      // Check if user exists
      const userRef = ref(db, `users/${username.toLowerCase()}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        throw new Error('Username already exists');
      }

      // Create user with timestamp
      const userData = {
        username: username.toLowerCase(),
        password,
        isAdmin: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        uid: username.toLowerCase()
      };

      await set(userRef, userData);
      toast.success('User created successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading
  };
}