import { 
  addDoc, collection, getDocs, deleteDoc, query, where, doc, getDoc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut, deleteUser, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let allPostDiv = document.querySelector("#allPosts");
let postInput = document.querySelector("#post-inp");
let addPostBtn = document.querySelector("#add-post");
let deleteAccountBtn = document.querySelector("#deleteAccountBtn");
let logoutBtn = document.querySelector("#signOut");

// **Modal**
let deleteModal = document.querySelector("#deleteModal");
let confirmDelete = document.querySelector("#confirmDelete");
let cancelDelete = document.querySelector("#cancelDelete");

// **Check if user is logged in**
onAuthStateChanged(auth, (user) => {
  if (!user) {
    localStorage.removeItem("loggedInUser");
    window.location.replace("./index.html");
  }
});

// **Get user details from Firestore**
const getUserDetails = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// **Create a new post**
let createPost = async (text) => {
  if (!text.trim()) {
    alert("Post cannot be empty!");
    return;
  }

  try {
    let userData = await getUserDetails(auth.currentUser.uid);
    if (!userData) {
      alert("Error fetching user details.");
      return;
    }

    let now = new Date();
    let formattedDate = now.toLocaleString("en-GB", { 
      day: "2-digit", month: "2-digit", year: "numeric", 
      hour: "2-digit", minute: "2-digit", hour12: true 
    });

    await addDoc(collection(db, "posts"), {
      postText: text,
      uid: auth.currentUser.uid,
      name: userData.name, 
      formattedDate: formattedDate, 
    });

    postInput.value = ""; 
    getAllPosts(); 
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

// **Display all posts**
let getAllPosts = async () => {
  try {
    allPostDiv.innerHTML = "";
    const posts = await getDocs(collection(db, "posts"));

    let hasPosts = false;
    posts.forEach((post) => {
      let postData = post.data();
      allPostDiv.innerHTML += `
        <div class="post-box">
          <p><strong>${postData.name}</strong> - ${postData.formattedDate}</p>
          <p>${postData.postText}</p>
        </div>`;
      hasPosts = true;
    });

    if (!hasPosts) {
      allPostDiv.innerHTML = "<p>No posts available.</p>";
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// **Logout**
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("loggedInUser");
    window.location.replace("./index.html");
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// **Delete Account Function**
const deleteUserAccount = async () => {
  try {
    let user = auth.currentUser;
    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }

    // Delete all user's posts
    const postsQuery = query(collection(db, "posts"), where("uid", "==", user.uid));
    const postsSnapshot = await getDocs(postsQuery);
    postsSnapshot.forEach(async (post) => {
      await deleteDoc(doc(db, "posts", post.id));
    });

    // Delete user from Firestore
    await deleteDoc(doc(db, "users", user.uid));

    // Delete authentication user
    await deleteUser(user);

    localStorage.removeItem("loggedInUser");
    alert("Account deleted successfully.");
    window.location.replace("./index.html");
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Failed to delete account. Please log in again.");
  }
};

// **Show Delete Modal**
deleteAccountBtn.addEventListener("click", () => {
  deleteModal.style.display = "flex";
});

cancelDelete.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

// **Confirm Delete**
confirmDelete.addEventListener("click", async () => {
  deleteModal.style.display = "none"; 
  deleteUserAccount(); 
});

// **Event Listeners**
addPostBtn.addEventListener("click", () => {
  let postText = postInput.value;
  createPost(postText);
});

getAllPosts();
