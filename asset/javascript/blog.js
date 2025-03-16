import{
    db,
    auth,
    addDoc,
    serverTimestamp,
    collection,
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
            timestamp: serverTimestamp()
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
