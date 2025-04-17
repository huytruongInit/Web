// IMPORT 
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { auth  } from "../config/firebase.config.js";

// KIỂM TRA XEM USER ĐÃ ĐĂNG NHẬP CHƯA
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        window.location.href = "index.html"
    }
    else {
      // User is signed out
    }
});
// HẾT KIỂM TRA XEM USER ĐÃ ĐĂNG NHẬP CHƯA

// ĐĂNG NHẬP
const formSignIn = document.querySelector("[form-signIn]");
if(formSignIn) {
    formSignIn.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        // sign-in with firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;

                // redirect
                window.location.href = "index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    });
}
// HẾT ĐĂNG NHẬP

// ĐĂNG XUẤT
const btnsignOut = document.querySelector("[signOut]");
if(btnsignOut) {
    btnsignOut.addEventListener("click", (event) => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                window.location.href = "sign-in.html";
            })
            .catch((error) => {
                // An error happened.
            });
    });
}
// HẾT ĐĂNG XUẤT