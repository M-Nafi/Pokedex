let numberOfPokemons = 30;
let more = 30;
let currentPokemon;
let currentPokemonIndex = 0;
let allPokemon = [];
let cardBackgroundColors = [];
let baseStatsChart;

// main view, load Pokemon data and create pokemon cards
async function loadPokemon(data) {
  let url = `https://pokeapi.co/api/v2/pokemon/${data}`;
  let response = await fetch(url);
  let currentPokemon = await response.json();
  allPokemon.push(currentPokemon);
  cardBackgroundColors = currentPokemon.types[0].type.name + "-type";
  let typesHTML = "";
  currentPokemon.types.forEach((type) => {
    typesHTML += `<button class="type-button">${type.type.name}</button>`;
  });
  let mainContainer = document.getElementById("main-container");
  mainContainer.innerHTML += generatePokemonDiv(currentPokemon, cardBackgroundColors, data - 1, typesHTML);
}

// main view and show pokemon cards / first 30 pokemons 
function loadPokemons() {
  for (let i = 1; i <= numberOfPokemons; i++) {
    loadPokemon(i);
  }
}

// loading next 30 pokemons
async function loadMore() {
  for (let i = numberOfPokemons + 1; i <= numberOfPokemons + more; i++) {
    loadPokemon(i);
  }
  numberOfPokemons += more;
}

// generate pokemon div for main and details view 
function generatePokemonDiv(currentPokemon, cardBackgroundColors, i) {
  let firstType = currentPokemon.types[0].type.name;  
  return `
    <div class="pokemon-card ${firstType}-type" onclick="showPokemon(${i})">   
      <img class="pokeball" src="./img/pokeball.png">
      <img class="pokemon-img" src="${currentPokemon.sprites.other["official-artwork"].front_default}">
      <h1 class="card-name" id="name" ">${currentPokemon.name}</h1>
      <div class="types-container">
        <button class="type-button">${firstType}</button>
      </div>    
    </div>
  `;
}

// pokemon details
function showPokemon(pokemonIndex) {
  clearAndDeselectTabs();
  if (allPokemon[pokemonIndex]) {
    let currentPokemon = allPokemon[pokemonIndex];
    let typesHTML = "";
    currentPokemon.types.forEach((type) => {
      typesHTML += `<button class="type-button">${type.type.name}</button>`;
    });
    switchToPokemonDetailsView(); 
    let detailsContainer = document.getElementById("pokemon-details");
    detailsContainer.innerHTML = showPokemonDiv(currentPokemon, typesHTML);
    currentPokemonIndex = pokemonIndex;
    cardBackgroundColors = currentPokemon.types[0].type.name + "-type";
    detailsContainer.className = `pokemon-details ${cardBackgroundColors}`;    
    showAboutInfo(currentPokemon);
  }
  clearAndDeselectTabs();
}

// create pokemon div detail view
function showPokemonDiv(currentPokemon, typesHTML) {
  return `
    <div class="Pokename"><h1>${currentPokemon.name}</h1></div>
    <div class="large-types-container">${typesHTML}</div>           
    <img class="pokeball-img-large" src="./img/pokeball.png">
    <img class="pokemon-img-large" src="${currentPokemon.sprites.other["official-artwork"].front_default}">       
  `;
}

// outsourced function for showpokemon
function switchToPokemonDetailsView() {
  let mainContainer = document.getElementById("main-container");
  let detailsContainer = document.getElementById("pokemon-details");
  let maindetailcontainer = document.getElementById("main-detail-container");  
  mainContainer.classList.add("d-none");
  detailsContainer.classList.remove("d-none");
  maindetailcontainer.classList.remove("d-none");
  document.getElementById("loadmore").classList.add("d-none");
  document.getElementById("about-contents").classList.add("d-none");
  document.getElementById("pokemonheader").classList.add("d-none");
}


// get detailed information about current pokemon 
function showAboutInfo(currentPokemon) {
  let heightElement = document.getElementById("height");
  let weightElement = document.getElementById("weight");
  let abilitiesList = document.getElementById("abilities");

  heightElement.textContent = currentPokemon.height / 10 + " m";
  weightElement.textContent = currentPokemon.weight / 10 + " kg";
  
  let abilitiesHTML = ""; // skill list
  currentPokemon.abilities.forEach((ability) => {
    abilitiesHTML += `<li>${ability.ability.name}</li>`;
  });
  abilitiesList.innerHTML = abilitiesHTML;
}

// function for view base stats chart
function showBaseStatsInfo(currentPokemon) {
  let stats = currentPokemon.stats;
  let statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
  for (let i = 0; i < statNames.length; i++) {
    let baseStats = document.getElementById(statNames[i]);
    if (baseStats) {
      baseStats.textContent = stats[i].baseStat;
    }
  }
}

// function for view moves
function showMovesInfo(currentPokemon) {
  let movesList = document.getElementById("moves-list");
  let movesHTML = "";
  movesList.innerHTML = ""; 
  currentPokemon.moves.slice(0, 5).forEach((move) => { 
    movesHTML += `<li>${move.move.name}</li>`;
  });
  movesList.innerHTML = movesHTML;
}

// function about tab
function showAbout() {
  clearAndDeselectTabs();
  let aboutContents = document.getElementById("about-contents");
  aboutContents.classList.remove("d-none");
  showAboutInfo(allPokemon[currentPokemonIndex]);
  document.getElementById("about-tab").classList.add("selected"); 
}

// function base stats tab
function showBaseStats() {
  clearAndDeselectTabs();
  let baseContents = document.getElementById("base-contents");
  baseContents.classList.remove("d-none");
  createBaseStatsChart(allPokemon[currentPokemonIndex]);
  document.getElementById("base-stats-tab").classList.add("selected"); 
}

// function moves tab
function showMoves() {
  clearAndDeselectTabs();
  let moveContents = document.getElementById("move-contents");
  moveContents.classList.remove("d-none");
  showMovesInfo(allPokemon[currentPokemonIndex]);
  document.getElementById("moves-tab").classList.add("selected"); 
}

// functions for navigation
function closePokemon() {
  let detailsContainer = document.getElementById("pokemon-details");
  let mainContainer = document.getElementById("main-container");
  let maindetailcontainer = document.getElementById("main-detail-container");

  detailsContainer.classList.add("d-none");
  mainContainer.classList.remove("d-none");
  maindetailcontainer.classList.add("d-none");
  document.getElementById("loadmore").classList.remove("d-none");
  document.getElementById("pokemonheader").classList.remove("d-none");
  clearAndDeselectTabs();
}

// forward function for navigate
function nextPokemon() {
  if (currentPokemonIndex < allPokemon.length - 1) {
    navigation();
    showPokemon(currentPokemonIndex + 1);
  }
}

// backward function for navigate
function previousPokemon() {
  if (currentPokemonIndex > 0) {
    navigation();
    showPokemon(currentPokemonIndex - 1);
  }
}

// outsourced codes for forward and backward navigation
function navigation() {
  document.getElementById("about-tab").classList.remove("selected");
  document.getElementById("base-stats-tab").classList.remove("selected");
  document.getElementById("moves-tab").classList.remove("selected");

  document.getElementById("tab-contents").classList.remove("d-none");
  document.getElementById("about-contents").classList.add("d-none");
  document.getElementById("base-contents").classList.add("d-none");
  document.getElementById("move-contents").classList.add("d-none");
}

// function for deselct tabs after navigate pokemons 
function clearAndDeselectTabs() {
  let aboutContents = document.getElementById("about-contents");
  let baseContents = document.getElementById("base-contents");
  let moveContents = document.getElementById("move-contents");

  aboutContents.classList.add("d-none");
  baseContents.classList.add("d-none");
  moveContents.classList.add("d-none");

  let aboutTab = document.getElementById("about-tab");
  let baseStatsTab = document.getElementById("base-stats-tab");
  let movesTab = document.getElementById("moves-tab");

  aboutTab.classList.remove("selected");
  baseStatsTab.classList.remove("selected");
  movesTab.classList.remove("selected");
}

// function for creating chart for base stats
function createBaseStatsChart(currentPokemon) {
  const canvas = document.getElementById("base-stats-chart");
  const ctx = canvas.getContext("2d");

  if (baseStatsChart) {
    baseStatsChart.destroy(); 
  }

  const labels = [
    "HP", "Attack", "Defense", "Spec. Attack", "Spec. Defense", "Speed",
  ];
  const baseStats = [
    currentPokemon.stats[0].base_stat,
    currentPokemon.stats[1].base_stat,
    currentPokemon.stats[2].base_stat,
    currentPokemon.stats[3].base_stat,
    currentPokemon.stats[4].base_stat,
    currentPokemon.stats[5].base_stat,
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Base Stats",
        data: baseStats,
        backgroundColor: ["rgb(253, 236, 166)"],
        borderColor: ["rgb(53, 106, 188)"],
        borderWidth: 3,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        x: {
          beginAtZero: true,
          max: 200,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };
  baseStatsChart = new Chart(ctx, config); 
}

// function for searching pokemon names
function filterNames(event) { 
  event.preventDefault(); 
  let input = document.getElementById("search"); 
  let filter = input.value.trim().toLowerCase();   
  let cards = document.getElementsByClassName("pokemon-card"); 

  for (let i = 0; i < cards.length; i++) {     
    let name = cards[i].getElementsByClassName("card-name")[0].textContent.toLowerCase(); 
    // using "getElementsByClassName" for directly accessing --> css-class
    
    if (name.includes(filter)) {
      showPokemon(i);
      input.value = "";  
      return;
    }
  }  
  // if pokemon is not found, display this message
  swal.fire("This Pokemon is not available. Please load more"); 
  input.value = "";  
}





