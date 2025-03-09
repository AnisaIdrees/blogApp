import{
    auth,
    createUserWithEmailAndPassword,
} from './firebase.config.js';

//---------------------create account / sign up ---------------------------------//
const register =async (ele)=>{
    ele.preventDefault()

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword=document.getElementById('Confirm-password').value;
    console.log(email,password,confirmPassword);

    
    if(password!==confirmPassword){
     console.log('password do not match');
     return;
    }
    

    try {
       let userCredential= await   createUserWithEmailAndPassword(
        auth, 
        email, 
        password
    );
     let user = userCredential.user;
     console.log(user.uid);
     

    } catch (error) {
        console.log(error,message);
        
    }
}
document.getElementById('signUp-btn')?.addEventListener('click',register);