import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBswqr7D9I2oDo7yFYuy_9K9GJ8P2kdeRc",
  authDomain: "vercel-1e0f7.firebaseapp.com",
  databaseURL: "https://vercel-1e0f7-default-rtdb.firebaseio.com",
  projectId: "vercel-1e0f7",
  storageBucket: "vercel-1e0f7.appspot.com",
  messagingSenderId: "693787450429",
  appId: "1:693787450429:web:177fc03a0fc906b200de54",
  measurementId: "G-6NGXF9DVL2"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);