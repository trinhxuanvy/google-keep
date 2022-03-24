import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../config";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const storage = getStorage();
const firestore = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account", namespace: "alo" });

const signInWithGoogle = () => {
  signInWithRedirect(auth, provider);
};

export { firebaseApp, auth, storage, firestore, signInWithGoogle };
