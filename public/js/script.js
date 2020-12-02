
function sendData(data, link) {
  $('.flash-span').text('').fadeIn();;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: `http://localhost:3000/${link}`,
    data: JSON.stringify(data),
    success: function (data) {
      let html = "";
      if (link == 'signup') {
        html = $('.flash-span').addClass('flash-span success-span').text('Success registraion, waiting autorization');
      } else {
        html = $('.flash-span').addClass('flash-span success-span').text('Success login, waiting autorization');
      }
      setTimeout(() => {
        location.reload()
      }, 1000);
      return html;
    },
    error: ((err) => {
      let html = $('.flash-span').text('Something wrong check your email or password').fadeIn();;
      return html;
    })
  });
}

const signinButton = document.querySelector("#signin-button");
const signupButton = document.querySelector("#signup-button");
const signinForm = document.querySelector("#signinForm");
let nameInput, emailInput, passwordInput;
const signupForm = document.querySelector("#signupForm");
let flashSpan = '';
const genresContainer = document.querySelector(".genres-nav");
const popularContainer = document.querySelector(".popular-container");
signinButton.addEventListener("click", (e) => {
  e.preventDefault();
  emailInput = signinForm.querySelector("#email-input");
  passwordInput = signinForm.querySelector("#password-input");
  flashSpan = signinForm.querySelector(".flash-span");
  const data = {
    email: emailInput.value,
    password: passwordInput.value,
  };
  let link = "signin";
  sendData(data, link);
});
signupButton.addEventListener("click", (e) => {
  e.preventDefault();
  emailInput = signupForm.querySelector("#email-input");
  nameInput = signupForm.querySelector('#username-input')
  passwordInput = signupForm.querySelector("#password-input");
  flashSpan = signupForm.querySelector(".flash-span");
  const data = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
  let link = "signup";
  sendData(data, link);
});

$(document).ready(function(){
  $('.kv-ltr-theme-uni-star').rating({
      hoverOnClear: false,
      theme: 'krajee-uni'
  });
});