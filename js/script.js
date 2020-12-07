let tabCountries = null;
let tabFavs = null;

let allCountries = [];
let favCountries = [];

let countCountries = 0;
let countFavs = 0;

let countriesPop = 0;
let favsPop = 0;

let numberFormat = null;

window.addEventListener("load", () => {
  tabCountries = document.querySelector("#tab-countries");
  tabFavs = document.querySelector("#tab-favs");

  countCountries = document.querySelector("#country-list-counter");
  countFavs = document.querySelector("#country-favs-counter");

  countriesPop = document.querySelector("#country-list-population");
  favsPop = document.querySelector("#country-favs-population");

  numberFormat = Intl.NumberFormat("pt-BR");
  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}

function render() {
  renderAllCountries();
  renderFavs();
  renderSummary();
  handleCountryButtons();
}

function renderAllCountries() {
  let countriesHTML = "<div>";

  allCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;

    const countryHTML = `
      <div class="country">
        <div>
          <a id="${id}" class="waves-effect waves-light btn green">+</a>
        </div>
          <img src="${flag}" alt="${name}">
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation} Habitantes</li>
          </ul>
        </div>
      </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += "</div>";
  tabCountries.innerHTML = countriesHTML;
}

function renderFavs() {
  let favsHTML = "<div>";

  favCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;
    console.log(formattedPopulation);

    const favCountryHTML = `
      <div class="country">
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
          <img src="${flag}" alt="${name}">
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation} Habitantes</li>
          </ul>
        </div>
      </div>
    `;

    favsHTML += favCountryHTML;
  });

  favsHTML += "</div>";
  tabFavs.innerHTML = favsHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavs.textContent = favCountries.length;

  totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  favoritesPopulation = favCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  countriesPop.textContent = formatNumber(totalPopulation);
  favsPop.textContent = formatNumber(favoritesPopulation);
}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll(".btn"));
  const favButtons = Array.from(tabFavs.querySelectorAll(".btn"));

  countryButtons.forEach((button) => {
    button.addEventListener("click", () => addToFavs(button.id));
  });

  favButtons.forEach((button) => {
    button.addEventListener("click", () => removeFromFavs(button.id));
  });
}

function addToFavs(buttonId) {
  const countryToAdd = allCountries.find((button) => button.id === buttonId);

  favCountries = [...favCountries, countryToAdd].sort((x, y) => {
    return x.name.localeCompare(y.name);
  });

  allCountries = allCountries.filter((country) => country.id !== buttonId);

  render();
}

function removeFromFavs(buttonId) {
  const countryToRemove = favCountries.find(
    (button) => button.id === button.id
  );

  allCountries = [...allCountries, countryToRemove].sort((x, y) => {
    return x.name.localeCompare(y.name);
  });

  favCountries = favCountries.filter((country) => country.id !== buttonId);

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
