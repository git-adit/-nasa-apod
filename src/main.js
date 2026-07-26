import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");

randomImage();

function loadImage(date = "") {
  app.innerHTML = "<p>Loading...</p>";

  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

  if (date) {
    url += `&date=${date}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // If NASA returns a video, try another random date
      if (data.media_type !== "image") {
        randomImage();
        return;
      }

      app.innerHTML = `
        <button id="randomBtn">🎲 Random Space Image</button>

        <h1>${data.title}</h1>

        <p><strong>${data.date}</strong></p>

        <img src="${data.url}" alt="${data.title}">

        <p>${data.explanation}</p>
      `;

      document
        .querySelector("#randomBtn")
        .addEventListener("click", randomImage);
    })
    .catch((err) => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

function randomImage() {
  const start = new Date("1995-06-16").getTime();
  const end = new Date().getTime();

  const randomTime = start + Math.random() * (end - start);

  const randomDate = new Date(randomTime)
    .toISOString()
    .split("T")[0];

  loadImage(randomDate);
}