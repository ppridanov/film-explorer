function sendData(data, link) {
  fetch(`http://localhost:3000/${link}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({
      email: data.email,
      password: data.password
    })
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log(err));
  console.log(JSON.stringify(data));
}

const signinButton = document.querySelector("#signin-button");
const signupButton = document.querySelector("#signup-button");
const signinForm = document.querySelector("#signinForm");
let nameInput, emailInput, passwordInput;
const signupForm = document.querySelector("#signupForm");
const flashSpan = document.querySelector(".flash-span");
const genresContainer = document.querySelector(".genres-nav");
const popularContainer = document.querySelector(".popular-container");
signinButton.addEventListener("click", (e) => {
  e.preventDefault();
  emailInput = signinForm.querySelector("#email-input");
  passwordInput = signinForm.querySelector("#password-input");
  const data = {
    email: emailInput.value,
    password: passwordInput.value,
  };
  let url = "signin";
  sendData(data, url);
});
signupButton.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    username: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
  let link = "signup";
  sendData(data, link);
});
