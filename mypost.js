import { 
  collection, getDocs, query, where, deleteDoc, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

let myPostDiv = document.querySelector("#myPosts");
let loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
  window.location.replace("./index.html");
}

// ** Display User's Posts**
let getMyPosts = async () => {
  try {
    myPostDiv.innerHTML = "";
    const q = query(collection(db, "posts"), where("uid", "==", loggedInUser));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      myPostDiv.innerHTML = `<p class="no-posts">No posts available.</p>`;
      return;
    }

    querySnapshot.forEach((post) => {
      let postData = post.data();
      let postId = post.id;

      myPostDiv.innerHTML += `
        <div class="post-box" id="post-${postId}">
          <div class="post-header">
            <strong>${postData.name}</strong>
            <span>${postData.formattedDate}</span>
          </div>
          <p id="text-${postId}" class="post-text">${postData.postText}</p>
          <input type="text" id="edit-${postId}" class="edit-input" value="${postData.postText}" style="display:none;">
          <div class="post-actions">
            <button class="edit-btn" onclick="editPost('${postId}')">
              <i class="fas fa-pencil-alt"></i> Edit
            </button>
            <button class="update-btn" onclick="updatePost('${postId}')">Update</button>
            <button class="delete-btn" onclick="deletePost('${postId}')">Delete</button>
          </div>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
};

// **Edit Post**
window.editPost = (postId) => {
  document.getElementById(`text-${postId}`).style.display = "none";
  document.getElementById(`edit-${postId}`).style.display = "block";
};

// **Update Post**
window.updatePost = async (postId) => {
  let updatedText = document.getElementById(`edit-${postId}`).value;
  
  if (!updatedText.trim()) {
    alert("Post cannot be empty!");
    return;
  }

  try {
    await updateDoc(doc(db, "posts", postId), { postText: updatedText });
    alert("Post updated successfully!");
    getMyPosts(); 
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

// **Delete Post**
window.deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    alert("Post deleted successfully!");
    getMyPosts(); 
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

// **Logout**
document.querySelector("#signOut").addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("loggedInUser");
    window.location.replace("./index.html");
  } catch (error) {
    console.error("Logout error:", error);
  }
});

getMyPosts();
