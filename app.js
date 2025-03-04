import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Function to store user in Firestore after sign-up
let addUserData = async (user, name) => {
    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: user.email
        });
    } catch (e) {
        console.error("Error adding user to Firestore:", e);
    }
};

// **Sign Up User**
let signUpUser = async (name, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user in Firestore
        await addUserData(user, name);
        localStorage.setItem("loggedInUser", user.uid);

        alert("Sign Up Successful!");
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(`Sign Up Failed: ${error.message}`);
    }
};

// **Sign In User**
let signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem("loggedInUser", user.uid);
        alert("Login Successful!");
        window.location.replace("./dashboard.html");
    } catch (error) {
        console.error("Login error:", error.message);
        alert(`Login Failed: ${error.message}`);
    }
};

// **Event Listeners**
document.addEventListener("DOMContentLoaded", () => {
    let signUpBtn = document.querySelector("#signUp-btn");
    let loginBtn = document.querySelector("#login-btn");

    if (signUpBtn) {
        signUpBtn.addEventListener("click", () => {
            let name = document.querySelector("#name").value;
            let email = document.querySelector("#email").value;
            let password = document.querySelector("#password").value;

            if (!name || !email || !password) {
                alert("Please enter name, email, and password.");
                return;
            }

            signUpUser(name, email, password);
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            let email = document.querySelector("#email").value;
            let password = document.querySelector("#password").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            signInUser(email, password);
        });
    }
});
