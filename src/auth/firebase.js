import firebase from "firebase/app";
import "firebase/auth";

import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

const env = process.env;

const firebaseConfig = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGINGSENDER_ID,
  appId: env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const signInWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await firebase.auth().signInWithPopup(provider);

    return user.getIdToken();
  } catch (error) {
    logWarnOrErrInDevelopment(error, "warn");
    throw error;
  }
};

export { signInWithGoogle };
