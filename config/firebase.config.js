/**
 * Cấu hình firebase 
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_scuWAgYKmoBqG_33oBAWrLLSHp9sVq0",
    authDomain: "digit-door-lock.firebaseapp.com",
    databaseURL: "https://digit-door-lock-default-rtdb.firebaseio.com",
    projectId: "digit-door-lock",
    storageBucket: "digit-door-lock.firebasestorage.app",
    messagingSenderId: "511304217765",
    appId: "1:511304217765:web:79343fe438abf66b25894c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports Firebase