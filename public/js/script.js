const signinButton = document.querySelector("#signin-button");
const signupButton = document.querySelector("#signup-button");
const signinForm = document.querySelector("#signinForm");
let nameInput, emailInput, passwordInput;
const signupForm = document.querySelector("#signupForm");
let flashSpan = "";
const genresContainer = document.querySelector(".genres-nav");
const popularContainer = document.querySelector(".popular-container");
const commentInput = (!null) ? document.querySelector("#comment") : null;
const tagsInput = (!null) ? document.querySelector("#tag-comment") : null;
const sendCommentButton = (!null) ? document.querySelector("#send-comment") : null;
const likeFilmButton = document.querySelector('.like-movie');
const unLikeFilmButton = document.querySelector('.unlike-movie');
const filmId = document.querySelector('.film').getAttribute('filmId');

const sendTagButton = document.querySelector('#send-tags');
const tagInput = document.querySelector('#tag-input');
function sendData(data, link) {
  $(".flash-span").text("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: `http://localhost:3000/${link}`,
    data: JSON.stringify(data),
    success: function (data) {
      let html = "";
      if (link == "signup") {
        html = $(".flash-span")
          .addClass("flash-span success-span")
          .text("Success registraion, waiting autorization");
      } else {
        html = $(".flash-span")
          .addClass("flash-span success-span")
          .text("Success login, waiting autorization");
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
      return html;
    },
    error: (err) => {
      let html = $(".flash-span")
        .text("Something wrong check your email or password")
        .fadeIn();
      return html;
    },
  });
}

function sendCommentOrTag(data, link) {
  $.ajax({
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    url: `http://localhost:3000/${link}`,
    data: JSON.stringify(data),
    success: function (data) {
      $('.close-tag-modal').trigger('click');
      document.querySelector('.tagForm').reset();
      document.querySelector('.comment-form').reset();
      setTimeout(() => {
        location.reload('');
      }, 500)
    },
    error: (err) => {
      console.log(err);
    },
  })
}

function addToCollection(id) {
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: `http://localhost:3000/users/movie/add`,
    data: JSON.stringify({filmId: id}),
    success: function (data) {
    },
    error: (err) => {
      console.log(err);
    },
  })
}
function removeFromCollection(id) {
  $.ajax({
    type: "DELETE",
    contentType: "application/json",
    url: `http://localhost:3000/users/movie/delete`,
    data: JSON.stringify({filmId: id}),
    success: function (data) {
    },
    error: (err) => {
      console.log(err);
    },
  })
}
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
  nameInput = signupForm.querySelector("#username-input");
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
if (sendCommentButton) {
  sendCommentButton.addEventListener('click', (e) => {
    e.preventDefault();
    const data = {
      filmId: filmId,
      text: commentInput.value,
    }
    const link = 'comments'
    sendCommentOrTag(data, link);

  })

}
sendTagButton.addEventListener('click', (e) => {
  e.preventDefault();
  const link = 'tags/add'
  const data = {
    filmId:  filmId,
    tags: tagInput.value.split(','),
  }
  console.log(data);
  sendCommentOrTag(data, link)
})
// unLikeFilmButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   addToCollection(filmId);
// } )
likeFilmButton.addEventListener("click", (e) => {
  e.preventDefault();
  removeFromCollection(filmId);
} )

$(document).ready(function () {
  $(".kv-ltr-theme-uni-star").rating({
    hoverOnClear: false,
    theme: "krajee-uni",
  });
});
