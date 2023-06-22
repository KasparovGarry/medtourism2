import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    getFirestore,
    addDoc,
    getDocs,
    collection,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDYZbzFpRyBafZV96rOpNEYOZgWU0mQ4xY",
    authDomain: "med-tourism-c0377.firebaseapp.com",
    projectId: "med-tourism-c0377",
    storageBucket: "med-tourism-c0377.appspot.com",
    messagingSenderId: "12701624734",
    appId: "1:12701624734:web:11a7830090c0e04c5d8e8f",
    measurementId: "G-3NNE72084F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const database = getFirestore();

//get seperate nav elements
const loggedInElements = document.querySelectorAll(".logged-in");
const loggedOutElements = document.querySelectorAll(".logged-out");

// Manage users
onAuthStateChanged(auth, (user) => {
    if (user) {
        loggedInElements.forEach((element) => {
            element.style.display = "block";
        });

        loggedOutElements.forEach((element) => {
            element.style.display = "none";
        });
        console.log("user logged in");
        console.log(user.email);
    } else {
        loggedInElements.forEach((element) => {
            element.style.display = "none";
        });

        loggedOutElements.forEach((element) => {
            element.style.display = "block";
        });

        console.log("user logged out");
    }
});

// Sign In
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    if (password.length < 6) {
        alert("Incorrect password");
        return;
    }

    //register the user
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            signupModal.classList.remove("show");
            signupForm.reset();
        })
        .catch((error) => {
            let errorMessage = error.message;
            let errorCode = error.code;

            alert(errorMessage);
        });
});

//Sign out
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth);
});

//Log in
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //Get user info

    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginModal.classList.remove("show");
            loginForm.reset();
        })
        .catch((error) => {
            let errorMessage = error.message;
            let errorCode = error.code;

            alert(errorMessage);
        });
});

//get data
const comments = collection(database, "comments");
const commentsSnapshot = await getDocs(comments);
const HTMLComments = document.querySelector(".comments");
let commentID = 1;
let html = "";
commentsSnapshot.forEach((doc) => {
    let comment = doc.data();
    let div = `<div class="comment">
    <h3>${comment.email} at ${comment.time} says:</h3>
    <p>${comment.comment}</p>
    </div>`;
    html += div;
    HTMLComments.innerHTML = html;
    commentID += 1;
});

//add comments
const commentForm = document.querySelector("#comment-form");

commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //console.log(auth.currentUser.email);
    let today = new Date();
    let data = {
        ID: commentID,
        email: auth.currentUser.email,
        comment: commentForm["comment-input"].value,
        time: `${
            today.getHours() <= 10 ? `0${today.getHours()}` : today.getHours()
        }:${
            today.getMinutes() <= 10
                ? `0${today.getMinutes()}`
                : today.getMinutes()
        }`,
    };

    addDoc(comments, data).then(() => {
        location.reload();
    });
});
