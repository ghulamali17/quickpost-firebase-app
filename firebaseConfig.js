import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCZpZWIJ0mLgOqAzMC5jMbBdOgAgn_rL2M",
    authDomain: "ecommerce-19ff4.firebaseapp.com",
    projectId: "ecommerce-19ff4",
    storageBucket: "ecommerce-19ff4.firebasestorage.app",
    messagingSenderId: "521272247200",
    appId: "1:521272247200:web:7996007c1a00fe39ecdac5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, auth,db}
