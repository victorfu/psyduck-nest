import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZl7c2kkjAZgqkklI5Ka-z0wNFOvxZ6E0",
  authDomain: "psyduck-nest.firebaseapp.com",
  projectId: "psyduck-nest",
  storageBucket: "psyduck-nest.appspot.com",
  messagingSenderId: "264052303367",
  appId: "1:264052303367:web:8f0446c9ce7f68784aaca2",
  measurementId: "G-H2ED1EBKZS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth: Auth = getAuth(app);

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export const uploadImage = (file: File, callback?: (url: string) => void) => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `images/${timestamp}-${file.name}`);
  const metadata = {
    contentType: file.type,
  };
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      console.error(error);
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      void getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        callback?.(downloadURL);
      });
    },
  );
};
