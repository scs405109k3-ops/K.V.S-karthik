import React, { useState } from 'react';
import { NamasteIcon } from './icons';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../firebase';

const LoginScreen: React.FC = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFriendlyErrorMessage = (err: any): string => {
    switch (err.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return err.message || 'An unknown error occurred.';
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-namaste-dark text-white p-4">
      <div className="text-center mb-8">
        <NamasteIcon className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-5xl font-bold">Namaste AI</h1>
        <p className="text-xl mt-2 text-namaste-light-grey">
          {isSigningUp ? 'Create your account' : 'Sign in to your account'}
        </p>
      </div>
      
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          {isSigningUp && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-namaste-light-dark border border-namaste-grey rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="bg-namaste-light-dark border border-namaste-grey rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-namaste-light-dark border border-namaste-grey rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={isSigningUp ? handleSignUp : handleSignIn}
            className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors disabled:bg-opacity-50"
            disabled={isLoading || !email || !password || (isSigningUp && !name)}
          >
            {isLoading ? '...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
          </button>
        </div>

        <p className="text-center mt-6 text-namaste-light-grey">
          {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            onClick={() => {
              setIsSigningUp(!isSigningUp);
              setError(null);
            }} 
            className="font-semibold text-blue-400 hover:underline"
          >
            {isSigningUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;