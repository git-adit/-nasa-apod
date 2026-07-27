import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");

let imagesViewed = 0;

loadRandomImage();

function loadRandomImage() {
  app.innerHTML = "<p>Loading a random NASA image...</p>";

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1`)
    .then((response) => response.json())
    .then((data) => {
      const apod = data[0];

      // NASA sometimes returns videos instead of pictures
      if (apod.media_type !== "image") {
        loadRandomImage();
        return;
      }

      imagesViewed++;

      app.innerHTML = `
        <button id="randomBtn">Random Space Image</button>

        <h1>NASA Astronomy Picture Viewer</h1>

        <p class="subtitle">
          Every time you click the button you'll get a random image from NASA's APOD collection.
        </p>

        <p><strong>Images Viewed:</strong> ${imagesViewed}</p>

        <button id="nasaBtn">Visit NASA Website</button>

        <h2>${apod.title}</h2>

        <p><strong>${apod.date}</strong></p>

        <img src="${apod.url}" alt="${apod.title}">

        <hr>

        <p>${apod.explanation}</p>
      `;

      document
        .getElementById("randomBtn")
        .addEventListener("click", loadRandomImage);

      document
        .getElementById("nasaBtn")
        .addEventListener("click", () => {
          window.open("https://www.nasa.gov/", "_blank");
        });
    })
    .catch((err) => {
      app.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
    });
}