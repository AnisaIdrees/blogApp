import{
    db,
    auth,
    addDoc,
    serverTimestamp,
    collection,
    onSnapshot,
    getDocs
} from './firebase.config.js'


const uploadImage = async () => {
    const fileInput = document.getElementById("imageUpload");
    const selectedFile = fileInput.files[0];

    if (!selectedFile) {
        alert("Please select an image!");
        return null;
    }

    const cloudName = "duo0iqvpr";  
    const uploadPreset = "firebaseXcloudinary"; 

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Uploaded Image URL:", data.secure_url);

        document.getElementById("imgPreview").src = data.secure_url;
        document.getElementById("imgPreview").style.display = "block";
        
        return data.secure_url;  
    } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image.");
        return null;
    }
};
document.getElementById("blogForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const content = document.getElementById("content").value.trim();
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to post a blog.");
        return;
    }
    if (!title || !category || !content) {
        alert("All fields are required!");
        return;
    }

    const imageUrl = await uploadImage(); 

    if (!imageUrl) {
        alert("Image upload failed!");
        return;
    }

    try {
        await addDoc(collection(db, "blogs"), {
            title,
            category,
            content,
            imageUrl,
            userId: user.uid,
            author: user.displayName || "Anonymous",
            date: new Date(data.timestamp?.seconds * 1000).toDateString(),
        });
        Swal.fire({
            icon: "success",
            title: "Blog Posted!",
            text: "Your blog has been published successfully.",
            showConfirmButton: false,
            timer: 2000
        });
window.location.pathname='/index.html'
        console.log("Blog Added Successfully!");
        document.getElementById("blogForm").reset();
        document.getElementById("imgPreview").src = "";
        document.getElementById("imgPreview").style.display = "none";
    } catch (error) {
        console.error("Error adding blog: ", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to add blog. Please try again!"
        });
    }
});


//////////////////// fetch data / display 



// const blogRef = collection(db, "blogs"); // Firestore collection reference
// const blogPostList = document.querySelector(".blog-post-list"); // Static Blog Section

// // 🔹 Fetch Blogs & Insert into Static Blog Section
// async function fetchBlogs() {
//   try {
//     const snapshot = await getDocs(blogRef);
//     let blogsHTML = "";

//     snapshot.forEach(doc => {
//       let blog = doc.data();
//       blogsHTML += `
//         <div class="blog-post-card">
//           <img src="${blog.imageUrl}" alt="Blog Image">
//           <p class="category-tag p3 pt-3">| ${blog.category}</p>
//           <h3>${blog.title}</h3>
//           <p style="color: #0000009d;">${blog.content}</p>
//           <p style="color: #000000dc;">${blog.author} | ${blog.timestamp}</p>
//           <button style="padding: 8px; outline: none; border: 1.5px solid #007399; color: #007399; background-color: transparent; border-radius: 5px;">Read More</button>
//         </div>
//       `;
//     });

//     blogPostList.innerHTML = blogsHTML;
//   } catch (error) {
//     console.error("Error fetching blogs:", error.message);
//   }
// }

// // 🔹 Call Function

// 🔹 Pagination Variables
let currentPage = 1;
const postsPerPage = 3;
let blogsData = [];

// 🔹 Fetch Blogs from Firestore
async function fetchBlogs() {
    try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        blogsData = querySnapshot.docs.map(doc => doc.data());
        displayBlogs();
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

// 🔹 Display Blogs with Pagination
function displayBlogs() {
    const blogContainer = document.querySelector(".blog-post-list");
    blogContainer.innerHTML = ""; 

    let start = (currentPage - 1) * postsPerPage;
    let end = start + postsPerPage;
    let blogsToShow = blogsData.slice(start, end);

    blogsToShow.forEach(blogData => {
        const blogCard = `
            <div class="blog-post-card">
                <img src="${blogData.imageUrl || 'default-image.jpg'}" alt="Blog Post Image">
                <p class="category-tag">| ${blogData.category || 'Uncategorized'}</p>
                <h3>${blogData.title || 'Untitled'}</h3>
                <p style="color: #000000dc;">${blogData.author || 'Unknown'} | ${formatDate(blogData.date)}</p>
                <button class="read-more-btn">Read More</button>
            </div>
        `;
        blogContainer.innerHTML += blogCard;
    });

    updatePaginationButtons();
}

// 🔹 Update Pagination Buttons
function updatePaginationButtons() {
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage * postsPerPage >= blogsData.length;
}

// 🔹 Next & Previous Page Functions
function nextPage() {
    if (currentPage * postsPerPage < blogsData.length) {
        currentPage++;
        displayBlogs();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayBlogs();
    }
}

// 🔹 Convert Timestamp to Date
function formatDate(timestamp) {
    if (!timestamp || !timestamp.seconds) return "No Date";
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

// 🔹 Function Call & Event Listeners
fetchBlogs();
document.getElementById("prevBtn").addEventListener("click", prevPage);
document.getElementById("nextBtn").addEventListener("click", nextPage);