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
            date: serverTimestamp() 
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



// let currentPage = 1;
// const postsPerPage = 3;
// let blogsData = []; // Sare blogs store honge

// // 🔹 **Firestore se blogs fetch karna**
// async function fetchBlogs() {
//     try {
//         const querySnapshot = await getDocs(collection(db, "blogs"));
//         blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         displayBlogs(); // Blogs ko show karne ka function call karo
//     } catch (error) {
//         console.error("Error fetching blogs:", error);
//     }

// // 🔹 **Blogs ko Page-wise Show Karna**
// function displayBlogs(filteredBlogs = null) {
//     const blogContainer = document.querySelector(".blog-post-list");
//     blogContainer.innerHTML = `
//         <h2 class="p-3" style="color: #000000dc;">Blog Posts</h2>
//         <div class="blog-search">
//             <input type="text" id="searchInput" placeholder="Search by title, author, category, content..." onkeyup="filterPosts()">
//             <i class="ri-search-line"></i>
//         </div>
//     `;

//     let blogsToShow = filteredBlogs || blogsData; // Agar search use ho to filteredBlogs show honge
//     let start = (currentPage - 1) * postsPerPage;
//     let end = start + postsPerPage;
//     let paginatedBlogs = blogsToShow.slice(start, end);

//     paginatedBlogs.forEach(blogData => {
//         const blogCard = document.createElement("div");
//         blogCard.classList.add("blog-post-card");
//         blogCard.setAttribute("data-title", blogData.title || "Untitled");
//         blogCard.setAttribute("data-author", blogData.author || "Unknown");
//         blogCard.setAttribute("data-category", blogData.category || "Uncategorized");
//         blogCard.setAttribute("data-content", blogData.content || "");

//         blogCard.innerHTML = `
//             <img src="${blogData.imageUrl || 'default-image.jpg'}" alt="Blog Post Image">
//             <p class="category-tag p3 pt-3">| ${blogData.category || 'Uncategorized'}</p>
//             <h3>${blogData.title || 'Untitled'}</h3>
//             <p style="color: #0000009d;">${blogData.content.slice(0, 100)}...</p>
//             <p style="color: #000000dc;">${blogData.author || 'Unknown'} | ${formatDate(blogData.date)}</p>
//             <button style="padding: 8px; outline: none; border: 1.5px solid #007399; color: #007399; background-color: transparent; border-radius: 5px;">Read More</button>
//         `;

//         blogContainer.appendChild(blogCard);
//     });

//     // Pagination buttons add karna
//     blogContainer.innerHTML += `
//         <div class="pagination">
//             <button id="prevBtn" style="background-color:#007399;" onclick="prevPage()">Previous</button>
//             <button id="nextBtn" style="background-color:#007399;" onclick="nextPage()">Next</button>
//         </div>
//     `;

//     updatePaginationButtons(blogsToShow);
// }

// // 🔹 **Pagination Controls**
// function updatePaginationButtons(filteredBlogs = null) {
//     let totalBlogs = filteredBlogs ? filteredBlogs.length : blogsData.length;

//     document.getElementById("prevBtn").disabled = currentPage === 1;
//     document.getElementById("nextBtn").disabled = currentPage * postsPerPage >= totalBlogs;
// }

// // 🔹 **Next & Previous Page Functions**
// function nextPage() {
//     if (currentPage * postsPerPage < blogsData.length) {
//         currentPage++;
//         displayBlogs();
//     }
// }

// function prevPage() {
//     if (currentPage > 1) {
//         currentPage--;
//         displayBlogs();
//     }
// }

// // 🔹 **Timestamp ko Date me Convert Karna**
// function formatDate(timestamp) {
//     if (!timestamp) return "No Date";
//     const date = new Date(timestamp.seconds * 1000); // Firebase timestamp ko JS date me convert karna
//     return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
// }

// // 🔹 **Search Blogs**
// function filterPosts() {
//     let searchQuery = document.getElementById("searchInput").value.toLowerCase();

//     let filteredBlogs = blogsData.filter(blog =>
//         blog.title.toLowerCase().includes(searchQuery) || 
//         blog.category.toLowerCase().includes(searchQuery) ||
//         blog.content.toLowerCase().includes(searchQuery) ||
//         blog.author.toLowerCase().includes(searchQuery)
//     );

//     currentPage = 1; // Jab search ho to first page pe le aao
//     displayBlogs(filteredBlogs);
// }
// }
// // ✅ **Function Call**
// fetchBlogs();




















// 🔹 **Fetch Blogs & Pagination**
let currentPage = 1;
const postsPerPage = 3;
let blogsData = [];

async function fetchBlogs() {
    try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayBlogs();
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

// 🔹 **Display Blogs**
function displayBlogs(filteredBlogs = null) {
    const blogContainer = document.querySelector(".blog-post-list");
    blogContainer.innerHTML = `
        <h2 class="p-3" style="color: #000000dc;">Blog Posts</h2>
        <div class="blog-search">
            <input type="text" id="searchInput" placeholder="Search by title, author, category, content..." onkeyup="filterPosts()">
            <i class="ri-search-line"></i>
        </div>
    `;

    let blogsToShow = filteredBlogs || blogsData;
    let start = (currentPage - 1) * postsPerPage;
    let end = start + postsPerPage;
    let paginatedBlogs = blogsToShow.slice(start, end);

    paginatedBlogs.forEach(blogData => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-post-card");
        blogCard.setAttribute("data-title", blogData.title || "Untitled");
        blogCard.setAttribute("data-author", blogData.author || "Unknown");
        blogCard.setAttribute("data-category", blogData.category || "Uncategorized");
        blogCard.setAttribute("data-content", blogData.content || "");

        blogCard.innerHTML = `
            <img src="${blogData.imageUrl || 'default-image.jpg'}" alt="Blog Post Image">
            <p class="category-tag p3 pt-3">| ${blogData.category || 'Uncategorized'}</p>
            <h3>${blogData.title || 'Untitled'}</h3>
            <p style="color: #0000009d;">${blogData.content.slice(0, 100)}...</p>
            <p style="color: #000000dc;">${blogData.author || 'Unknown'} | ${formatDate(blogData.date)}</p>
            <button style="padding: 8px; outline: none; border: 1.5px solid #007399; color: #007399; background-color: transparent; border-radius: 5px;">Read More</button>
        `;

        blogContainer.appendChild(blogCard);
    });

    // Pagination Buttons
    blogContainer.innerHTML += `
        <div class="pagination">
            <button id="prevBtn" style="background-color:#007399;" onclick="prevPage()">Previous</button>
            <button id="nextBtn" style="background-color:#007399;" onclick="nextPage()">Next</button>
        </div>
    `;

    updatePaginationButtons(blogsToShow);
}

// 🔹 **Pagination Controls**
function updatePaginationButtons(filteredBlogs = null) {
    let totalBlogs = filteredBlogs ? filteredBlogs.length : blogsData.length;

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage * postsPerPage >= totalBlogs;
}

// 🔹 **Next & Previous Page Functions**
function nextPage() {
    if (currentPage * postsPerPage < blogsData.length) {
        currentPage++;
        displayBlogs();
    }
}
document.getElementById("nextBtn")?.addEventListener("click", nextPage);
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayBlogs();
    }
}
document.getElementById("prevBtn")?.addEventListener("click", prevPage);

// 🔹 **Format Date**
function formatDate(timestamp) {
    if (!timestamp) return "No Date";
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

// 🔹 **Search Blogs**
function filterPosts() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();

    let filteredBlogs = blogsData.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery) || 
        blog.category.toLowerCase().includes(searchQuery) ||
        blog.content.toLowerCase().includes(searchQuery) ||
        blog.author.toLowerCase().includes(searchQuery)
    );

    currentPage = 1; // Jab search ho to first page pe le aao
    displayBlogs(filteredBlogs);
}

// ✅ **Initialize Fetch**
fetchBlogs();