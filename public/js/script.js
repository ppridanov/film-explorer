function sendData(data) {
  console.log(data);
  fetch(`http://localhost:3000${data.link}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: data.username, password: data.password }),
  })
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      if (data.message && data.message == "Success signin") {
        document.querySelector(".waiting-spinner").style = "display: flex";
        setTimeout(() => location.reload(), 500);
      }
      if (data.message && data.message == "Success signup") {
        flashSpan.style = "display: flex; color: green";
        flashSpan.textContent = "Success signin";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const signinButton = document.querySelector("#signin-button");
const signupButton = document.querySelector("#signup-button");
const passwordInput = document.querySelector("#password-input");
const emailInput = document.querySelector("#email-input");
const usernameInput = document.querySelector("#username-input");
const flashSpan = document.querySelector(".flash-span");
const genresContainer = document.querySelector(".genres-nav");
const popularContainer = document.querySelector(".popular-container");
signinButton.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    username: emailInput.value,
    password: passwordInput.value,
    link: "/api/signin",
  };
  sendData(data);
});
signupButton.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    username: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    link: "/api/signup",
  };
  sendData(data);
});

function getGenres(data) {
  fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${data.apiKey}&language=en-US`,
    {
      method: "GET",
      cors: "no-cors",
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      data.genres.forEach((element) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.setAttribute("href", "#");
        link.setAttribute("_id", element.id);
        link.classList.add("dropdown-item");
        link.textContent = element.name;
        li.appendChild(link);
        genresContainer.appendChild(li);
      });
    });
}
function getFilms(data) {
  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${data.apiKey}&language=en-US&page=1`,
    {
      method: "GET",
      cors: "no-cors",
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      data.results.forEach((el, index) => {
        if (index === 5) {
          const p = document.querySelector("p"),
            a = document.querySelector("a");
          a.classList.add("btn", "btn-primary", "btn-lg", "m-4");
          a.setAttribute("href", "http://localhost:3000/films/popular/1");
          a.setAttribute("role", "button");
          a.textContent = "More films";
          p.appendChild(a);
          popularContainer.appendChild(a);
        }
        if (index >= 5) {
          return;
        }
        const a = document.createElement("a"),
          title = document.createElement("p"),
          img = document.createElement("img"),
          p = document.createElement("p");
        a.classList.add(
          "col-lg-2",
          "col-md-3",
          "col-sm-4",
          "col-xs-12",
          "d-flex",
          "flex-column",
          "m-2",
          "card",
          "justify-content-fs",
          "align-items-center"
        );
        img.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w185${el.poster_path}`
        );
        title.textContent = el.original_title;
        title.classList.add("text-dark", "font-weight-bold", "mt-1", "mb-0");
        title.setAttribute("style", "min-height: 48px;");
        let overviewSliced = el.overview.slice(0, 50);
        if (overviewSliced.length < el.overview.length) {
          overviewSliced += "...";
        }
        p.textContent = overviewSliced;
        p.classList.add("text-secondary");
        a.setAttribute("href", `https://localhost/film/${el.id}`);
        const elementsArray = [img, title, p];
        elementsArray.forEach((item) => {
          a.appendChild(item);
        });
        popularContainer.appendChild(a);
      });
    });
}

