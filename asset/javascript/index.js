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
        console.log('useer login he');
        
    } catch (error) {
        console.log(error.message);
    }
};

document.getElementById("sigInWithGoogle")?.addEventListener("click", signWithGoogle);





//  Ensure DOM is Loaded Before Running Script
document.addEventListener("DOMContentLoaded", () => {
    const writeLink = document.getElementById("write-link");  // Write Button
    const loginLink = document.getElementById("login-link");  // Login/Logout Button

    // ❌ If Elements Are Missing, Stop Execution
    if (!writeLink || !loginLink) {
        console.error("❌ Error: Required elements not found in DOM!");
        return;
    }

    // Firebase Authentication Check
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(" User logged in:", user);
            writeLink.style.display = "block"; // Show Write Button
            loginLink.textContent = "Logout"; // Change Login to Logout
            loginLink.href = "#"; // Prevent Default Action
            console.log(user ,'user login he ');
            

            loginLink.removeEventListener("click", handleLogout); // Avoid Multiple Listeners
            loginLink.addEventListener("click", handleLogout);
        } else {
            console.log("No user logged in.");
            writeLink.style.display = "none"; // Hide Write Button
            loginLink.textContent = "Login"; // Show Login
            loginLink.href = "./asset/html/login.html"; // Redirect to Login Page
        }
    });

    // // Logout Function
    // async function handleLogout(e) {
    //     e.preventDefault();
    //     try {
    //         await signOut(auth);
    //         console.log("User logged out!");
    //         window.location.href = "./index.html"; // Reload to update UI
    //     } catch (logoutError) {
    //         console.error("Logout Error:", logoutError);
    //         alert("Logout failed! Please try again.");
    //     }


    // }

    // ✅ Logout Function with SweetAlert
async function handleLogout(e) {
    e.preventDefault();
    try {
        // Logout Confirmation Alert
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!"
        });

        if (result.isConfirmed) {
            await signOut(auth);
            console.log("✅ User logged out!");

            // 🎉 Success Message
            await Swal.fire({
                title: "Logged Out!",
                text: "You have been successfully logged out.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            window.location.href = "./index.html"; // Reload to update UI
        }

    } catch (logoutError) {
        console.error("❌ Logout Error:", logoutError);
        
        //  Error Alert
        Swal.fire({
            title: "Error!",
            text: "Logout failed! Please try again.",
            icon: "error",
            confirmButtonColor: "#d33"
        });
    }
}

});
