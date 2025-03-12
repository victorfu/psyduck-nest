import { auth, googleAuthProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
  User,
} from "firebase/auth";

interface AuthService {
  isAuthenticated: boolean;
  user: null | User;
  signIn(username: string, password: string | null): Promise<void>;
  signInWithGoogle(callback?: (user: User) => void): Promise<void>;
  signOut(): Promise<void>;
}

export const authService: AuthService = {
  isAuthenticated: false,
  user: null,
  async signIn(username: string, password: string | null) {
    if (!password) {
      throw new Error("Password is required");
    }
    const result = await signInWithEmailAndPassword(auth, username, password);
    authService.isAuthenticated = true;
    authService.user = result.user;
  },
  async signOut() {
    await signOutFirebase(auth);
    authService.isAuthenticated = false;
    authService.user = null;
  },
  async signInWithGoogle(callback?: (user: User) => void) {
    const result = await signInWithPopup(auth, googleAuthProvider);
    authService.isAuthenticated = true;
    authService.user = result.user;
    callback?.(result.user);
  },
};
