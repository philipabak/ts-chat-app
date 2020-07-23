import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlHuK19kMdlfolvRNAxIvdTRzWwy-usCA",
  authDomain: "chat-application-7d185.firebaseapp.com",
  databaseURL: "https://chat-application-7d185-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-application-7d185",
  storageBucket: "chat-application-7d185.appspot.com",
  messagingSenderId: "938153404182",
  appId: "1:938153404182:web:8a2b23a610405c49671237"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Database
const db = getDatabase(app); 

export { db };