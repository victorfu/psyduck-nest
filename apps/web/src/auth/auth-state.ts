import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { authService } from "./auth-service";
import localforage from "localforage";

const authStatePromise = new Promise<void>((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    updateAuthState(user);
    unsubscribe(); // Unsubscribe after first load
    resolve();
  });
});

// Set up ongoing auth state monitoring
onAuthStateChanged(auth, updateAuthState);

function updateAuthState(user: User | null) {
  authService.isAuthenticated = !!user;
  authService.user = user;

  user?.getIdToken().then((token) => {
    localforage.setItem("token", token);
  });
}

export function waitForAuthReady() {
  return authStatePromise;
}
