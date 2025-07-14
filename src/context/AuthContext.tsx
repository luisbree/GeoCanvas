
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Fetch the allowed users list from environment variables
const ALLOWED_USERS_STRING = process.env.NEXT_PUBLIC_ALLOWED_USERS || "";
const allowedUsers = ALLOWED_USERS_STRING.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);


interface AuthContextType {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user and checking authorization
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "No se pudo iniciar sesión con Google.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // State will be updated by onAuthStateChanged
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        // Check if the list is empty (everyone is allowed) or if the user is in the list
        const userIsAllowed = allowedUsers.length === 0 || allowedUsers.includes(currentUser.email.toLowerCase());
        setIsAuthorized(userIsAllowed);
        
        if (!userIsAllowed) {
            toast({
                title: "Acceso denegado",
                description: "No tenés permiso para acceder a las funciones completas de la aplicación.",
                variant: "destructive",
                duration: 9000,
            });
        }
      } else {
        setIsAuthorized(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const value = { user, isAuthorized, loading, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
