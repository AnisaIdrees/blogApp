
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from "./firebase.config.js";

const blogsContainer = document.getElementById("blogs-container");
const blogModal = document.getElementById("blogModal");
const editModal = document.getElementById("editModal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("edit-content");

let selectedBlogId = null;

// Fetch Blogs
async function fetchBlogs() {
    blogsContainer.innerHTML = "";
    const snapshot = await db.collection("blogs").get();

    snapshot.forEach(doc => {
        const blog = doc.data();
        const blogElement = document.createElement("div");
        blogElement.innerHTML = `
            <h3>${blog.title}</h3>
            <p>${blog.content.substring(0, 100)}...</p>
            <button onclick="viewDetails('${doc.id}', '${blog.title}', '${blog.content}')">View Details</button>
        `;
        blogsContainer.appendChild(blogElement);
    });
}

// View Blog Details in Modal
function viewDetails(id, title, content) {
    selectedBlogId = id;
    modalTitle.innerText = title;
    modalContent.innerText = content;
    blogModal.style.display = "flex";
}

// Open Edit Modal
function openEditModal() {
    editTitle.value = modalTitle.innerText;
    editContent.value = modalContent.innerText;
    editModal.style.display = "flex";
}

// Close Modals
function closeModal() {
    blogModal.style.display = "none";
}
function closeEditModal() {
    editModal.style.display = "none";
}

// Update Blog
async function updateBlog() {
    await db.collection("blogs").doc(selectedBlogId).update({
        title: editTitle.value,
        content: editContent.value
    });
    alert("Blog updated!");
    modalTitle.innerText = editTitle.value;
    modalContent.innerText = editContent.value;
    closeEditModal();
}

// Delete Blog
async function deleteBlog() {
    if (confirm("Are you sure?")) {
        await db.collection("blogs").doc(selectedBlogId).delete();
        alert("Blog deleted!");
        closeModal();
        fetchBlogs();
    }
}

// Load Blogs
fetchBlogs();
