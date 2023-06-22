//show forms onClick
const login = document.querySelector("#login");
const signup = document.querySelector("#signup");
const signupModal = document.querySelector(".signup-form");
const loginModal = document.querySelector(".login-form");

login.addEventListener("click", () => {
    if (signupModal.classList.contains("show")) {
        signupModal.classList.remove("show");
    }
    loginModal.classList.toggle("show");
});

signup.addEventListener("click", () => {
    if (loginModal.classList.contains("show")) {
        loginModal.classList.remove("show");
    }
    signupModal.classList.toggle("show");
});
