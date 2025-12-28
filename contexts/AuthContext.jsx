"use client";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(undefined);

  const createOrUpdateUserDoc = async (authUser) => {
    try {
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          displayName: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL,
          timestampCreate: Timestamp.now(),
          favorites: []
        });
      } else {
        // Update existing user document with email if missing
        const userData = userDoc.data();
        if (!userData.email && authUser.email) {
          await setDoc(userRef, {
            email: authUser.email
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error creating/updating user document:', error);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createOrUpdateUserDoc(user);
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: user === undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
