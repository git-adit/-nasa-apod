import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const app = document.querySelector("#app");

loadRandomImage();

function loadRandomImage() {
  app.innerHTML = "<p>Loading...</p>";

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1`)
    .then(response => response.json())
    .then(data => {
      const apod = data[0];

      // If NASA returns a video, try again
      if (apod.media_type !== "image") {
        loadRandomImage();
        return;
      }

      app.innerHTML = `
        <button id="randomBtn">🎲 Random Space Image</button>

        <h1>${apod.title}</h1>

        <p><strong>${apod.date}</strong></p>

        <img src="${apod.url}" alt="${apod.title}" />

        <p>${apod.explanation}</p>
      `;

      document
        .getElementById("randomBtn")
        .addEventListener("click", loadRandomImage);
    })
    .catch(err => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}