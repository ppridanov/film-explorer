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
const flashSpan = document.querySelector(".flash-span");
const genresContainer = document.querySelector(".genres-nav");
const popularContainer = document.querySelector(".popular-container");
signinButton.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    username: emailInput.value,
    password: passwordInput.value,
    link: "/login",
  };
  sendData(data);
});
signupButton.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    username: emailInput.value,
    password: passwordInput.value,
    link: "/register",
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
getGenres({ apiKey: "be108878e83f4cfcd89e3a228bde78c9" });
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
      data.results.forEach((el) => {
        const div = document.createElement("div");
        div.classList.add("card");
        const img = document.createElement("img");
        img.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w185${el.poster_path}`
        );
        div.appendChild(img);
        const divBody = document.createElement("div");
        divBody.classList.add("card-body");
        const h5 = document.createElement("h5");
        h5.classList.add("card-title");
        h5.textContent = el.original_title;
        divBody.appendChild(h5);
        const overview = document.createElement("p");
        overview.classList.add("card-text");
        let overviewSliced = el.overview.slice(0, 100);
        if (overviewSliced.length < el.overview.length) {
          overviewSliced += " ";
        }
        const link = document.createElement("a");
        link.setAttribute("href", "#");
        link.textContent = "->";
        overview.textContent = overviewSliced;
        overview.appendChild(link);
        divBody.appendChild(overview);
        const release = document.createElement("p");
        release.classList.add("card-text");
        const smallSpan = document.createElement("span");
        smallSpan.classList.add("text-muted");
        smallSpan.textContent = el.release_date;
        release.appendChild(smallSpan);
        divBody.appendChild(release);
        div.appendChild(divBody);
      });
    });
}

getFilms({ apiKey: "be108878e83f4cfcd89e3a228bde78c9" });
$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    items: 4,
    dots: false,
    loop: true,
  });
});
