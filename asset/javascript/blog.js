// import{

// } from './firebase.config.js'

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();


document.getElementById('blogForm').addEventListener('submit',async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;
    const imageFile = document.getElementById("imageUpload").files[0];

    // const author = document.getElementById("author").value;
    const user = firebase.auth().currentUser;


    if (!user) {
        alert("You must be logged in to post a blog.");
        return;
    }


    if (!imageFile) {
        alert("Please upload an image.");
        return;
    }


})