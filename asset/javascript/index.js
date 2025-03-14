import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    collection,
    doc,
    addDoc,
    setDoc,
    db,

} from './firebase.config.js';

//------------------------------------  create account / sign up   -------------------------------------//

const register = async (ele) => {
    ele.preventDefault()

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('Confirm-password').value;
    let confirmForMesg = document.getElementById('messageText')
    console.log(name, email, password, confirmPassword);


    if (password === confirmPassword) {
        confirmForMesg.innerHTML = `Password matched`;
        confirmForMesg.style.color = "green";

    }
    else {
        confirmForMesg.innerHTML = `password does not matched`;
        confirmForMesg.style.color = "red"

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passwords do not match!',
            confirmButtonText: "OK",
        });
    };

    try {
        let userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        let user = userCredential.user;
        console.log(user.uid, user);

        /// firestore save data
        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            password,
        });

        // SweetAlert2 success popup
        await Swal.fire({
            icon: 'success',
            title: 'Signup Successful!',
            text: 'Welcome to ' + name,
            // timer: 2000,
            showConfirmButton: true,
            confirmButtonText: "OK",
        });
        window.location.href = '/index.html'
        console.log('user added to db');

    } catch (error) {
        console.log("Signup Error:", error.code, error.message);
        Swal.fire({
            icon: 'error',
            title: 'Signup Failed!',
            text: error.message,
        });

    }
}
document.getElementById('signUp-btn')?.addEventListener('click', register);







//----------------------------------------- login code ---------------------------------------//
const login = async (ele) => {
    ele.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    console.log(password, email);


    try {
        let loginUser = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = loginUser.user;
        console.log("current user login >>>> ", user);

        Swal.fire({
            title: "✅Login Successful!",
            text: "Welcome to" + email,
            icon: "success",
            confirmButtonText: "OK",
        });


        window.location.href = '/index.html'

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        Swal.fire({
            title: "❌ Login Failed!",
            text: error.message,
            icon: "error",
            confirmButtonText: "Try Again",
        });
    }

}
document.getElementById('loginBtn')?.addEventListener('click', login);








////------------------------------------- login with  google----------------------------------------------////

const provider = new GoogleAuthProvider();


provider.setCustomParameters({ prompt: "select_account" });

const signWithGoogle = async () => {

    try {
        const result = await signInWithPopup(auth, provider)
        console.log("user google sy signIn hochuka hai.");
        console.log(result.user);

        Swal.fire({
            title: "🎉 Google Sign-In Successful!",
            text: "Welcome, " + result.user.displayName,
            icon: "success",
            confirmButtonText: "OK",
        });

        window.location.href = '/index.html'
    } catch (error) {
        console.log(error.message);
    }
};

document.getElementById("sigInWithGoogle")?.addEventListener("click", signWithGoogle);




// --------------------- sign out----------------------------------//
document.getElementById("signOut")?.addEventListener("click", async () => {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            await signOut(auth);
            Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
            console.log("Logout hogya!");
        
        }
    } catch (error) {
        Swal.fire("Error!", "Logout nahi hua. Please try again.", "error");
        console.log("Logout nahiiiiii hua!", error);
    }
});

//----------------------------------onAuthStateChange ----------------------------------//
