import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");

let imagesViewed = 0;

loadRandomImage();

function loadRandomImage() {
  app.innerHTML = "<p>Loading image...</p>";

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1`)
    .then((response) => response.json())
    .then((data) => {
      const apod = data[0];

      // sometimes NASA gives a video instead
      if (apod.media_type !== "image") {
        loadRandomImage();
        return;
      }

      imagesViewed++;

      app.innerHTML = `
        <button id="randomBtn">Random Space Image</button>

        <h1>NASA Astronomy Picture Viewer</h1>

        <p class="subtitle">Click the button to explore a random picture from NASA's Astronomy Picture of the Day collection.</p>

        <p><strong>Images Viewed:</strong> ${imagesViewed}</p>

        <h2>${apod.title}</h2>

        <p><strong>${apod.date}</strong></p>

        <img src="${apod.url}" alt="${apod.title}">

        <p>${apod.explanation}</p>
      `;

      document
        .getElementById("randomBtn")
        .addEventListener("click", loadRandomImage);
    })
    .catch((err) => {
      app.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
    });
}

document
  .getElementById("nasaBtn")
  .addEventListener("click", () => {
    window.open("https://www.nasa.gov/", "_blank");
  });