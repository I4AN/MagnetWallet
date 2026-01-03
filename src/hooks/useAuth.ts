import { useCallback, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../services/firebase";

const provider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo iniciar sesion.");
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo cerrar sesion.");
    }
  }, []);

  return { user, error, signIn, signOut: signOutUser };
}
