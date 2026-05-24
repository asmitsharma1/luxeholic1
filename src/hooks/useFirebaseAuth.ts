import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
} from "@/integrations/firebase";

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set initial user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    setError(null);
    const result = await signUpWithEmail(email, password, displayName);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const signInGoogle = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    const result = await signOutUser();
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const resetUserPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInGoogle,
    signOut,
    resetPassword: resetUserPassword,
  };
};
