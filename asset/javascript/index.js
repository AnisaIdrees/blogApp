import {
    auth,
    createUserWithEmailAndPassword,
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
            date,
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
