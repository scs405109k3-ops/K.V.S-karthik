import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { 
  auth, 
  signOut,
  onAuthStateChanged
} from './firebase';

import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-namaste-dark text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return user ? <ChatScreen user={user} onSignOut={handleSignOut} /> : <LoginScreen />;
};

export default App;