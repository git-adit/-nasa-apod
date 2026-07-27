import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");

let imagesViewed = 0;

// today's date, used to cap the date picker so people can't pick future dates
const todayStr = new Date().toISOString().split("T")[0];
// APOD started June 16, 1995 — used as the earliest allowed date
const minDateStr = "1995-06-16";

loadRandomImage();

function loadRandomImage() {
  fetchApod(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1`, true);
}

function loadImageForDate(dateStr) {
  fetchApod(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dateStr}`, false);
}

function fetchApod(url, isRandom) {
  app.innerHTML = "<p>Loading a NASA image...</p>";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // the random endpoint returns an array, the date endpoint returns an object
      const apod = Array.isArray(data) ? data[0] : data;

      // NASA sometimes returns videos instead of pictures
      if (apod.media_type !== "image") {
        if (isRandom) {
          loadRandomImage();
        } else {
          app.innerHTML = `<p>That date's APOD is a video, not an image. Try another date!</p>`;
          renderControls();
        }
        return;
      }

      imagesViewed++;
      render(apod);
    })
    .catch((err) => {
      app.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
    });
}

function render(apod) {
  app.innerHTML = `
    <h1>NASA Astronomy Picture Viewer</h1>

    <p class="subtitle">
      Get a random image from NASA's APOD collection, or pick a specific date.
    </p>

    <div id="controls"></div>

    <p><strong>Images Viewed:</strong> ${imagesViewed}</p>

    <button id="nasaBtn">Visit NASA Website</button>

    <h2>${apod.title}</h2>

    <p><strong>${apod.date}</strong></p>

    <img src="${apod.url}" alt="${apod.title}">

    <hr>

    <p>${apod.explanation}</p>

    <p class="note">
      I built this to practice working with a real external API and hiding an API key with
      environment variables. The date picker was the part I was most proud of figuring out —
      it took a bit to realize the date endpoint returns an object instead of an array like
      the random one does.
    </p>
  `;

  renderControls();

  document.getElementById("nasaBtn").addEventListener("click", () => {
    window.open("https://www.nasa.gov/", "_blank");
  });
}

function renderControls() {
  const controls = document.getElementById("controls");
  if (!controls) return;

  controls.innerHTML = `
    <button id="randomBtn">Random Space Image</button>
    <input type="date" id="dateInput" min="${minDateStr}" max="${todayStr}">
    <button id="dateBtn">Get This Date</button>
  `;

  document.getElementById("randomBtn").addEventListener("click", loadRandomImage);

  document.getElementById("dateBtn").addEventListener("click", () => {
    const chosen = document.getElementById("dateInput").value;
    if (chosen) {
      loadImageForDate(chosen);
    }
  });
}