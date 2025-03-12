import {
    auth,
    createUserWithEmailAndPassword,
    collection,
    doc,
    addDoc,
    setDoc,

} from './firebase.config.js';

//---------------------create account / sign up ---------------------------------//

const register = async (ele) => {
    ele.preventDefault()

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('Confirm-password').value;
    let confirmForMesg = document.getElementById('messageText')
    console.log(email, password, confirmPassword);


    if (password === confirmPassword) {
        confirmForMesg.innerHTML = `Password matched`;
        confirmForMesg.style.color = "green";

    }
    else {
        confirmForMesg.innerHTMl = `password do not matched`;
        confirmForMesg.style.color = "red"
    }

    try {
        let userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        let user = userCredential.user;
        console.log(user.uid, user);

        // firestore save data





    } catch (error) {
        console.log(error, message);

    }
}
document.getElementById('signUp-btn')?.addEventListener('click', register);