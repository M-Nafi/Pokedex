let numberOfPokemons = 30;
let more = 30;
let currentPokemon;
let currentPokemonIndex = 0;
let allPokemon = [];
let cardBackgroundColors = [];
let baseStatsChart;

async function loadPokemon(data) {
    let url = `https://pokeapi.co/api/v2/pokemon/${data}`;
    let response = await fetch(url);
    let pokemon = await response.json();
    allPokemon.push(pokemon);
    let index = allPokemon.length - 1;
    let typesHTML = '';
    pokemon.types.forEach((type) => {
        typesHTML += `<button class="type-button">${type.type.name}</button>`;
    });
    cardBackgroundColors = pokemon.types[0].type.name + '-type';
    generateMainContainer(pokemon, index, typesHTML);
}

function generateMainContainer(currentPokemon, index, typesHTML) {
    let mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML += generatePokemonDiv(
        currentPokemon,
        cardBackgroundColors,
        index,
        typesHTML
    );
}

function loadPokemons() {
    for (let i = 1; i <= numberOfPokemons; i++) {
        loadPokemon(i);
    }
}

async function loadMore() {
    for (let i = numberOfPokemons + 1; i <= numberOfPokemons + more; i++) {
        loadPokemon(i);
    }
    numberOfPokemons += more;
}

function generatePokemonDiv(
    currentPokemon,
    cardBackgroundColors,
    index,
    typesHTML
) {
    let firstType = currentPokemon.types[0].type.name;
    return `
    <div class="pokemon-card ${firstType}-type" onclick="showPokemon(${index})">
      <img class="pokeball" src="./img/pokeball.png">
      <img class="pokemon-img" src="${currentPokemon.sprites.other['official-artwork'].front_default}">
      <h1 class="card-name">${currentPokemon.name}</h1>
      <div class="types-container">${typesHTML}</div>
    </div>
  `;
}

function showPokemon(pokemonIndex) {
    if (allPokemon[pokemonIndex]) {
        let currentPokemon = allPokemon[pokemonIndex];
        let typesHTML = '';
        currentPokemon.types.forEach((type) => {
            typesHTML += `<button class="type-button">${type.type.name}</button>`;
        });
        switchToPokemonDetailsView();
        detailViewHelp(currentPokemon, typesHTML, pokemonIndex);
        showAboutInfo(currentPokemon);
    }
    document.getElementById('loadmore').classList.add('d-none');
}

function detailViewHelp(currentPokemon, typesHTML, pokemonIndex) {
    let detailsContainer = document.getElementById('pokemon-details');
    detailsContainer.innerHTML = showPokemonDiv(currentPokemon, typesHTML);
    currentPokemonIndex = pokemonIndex;
    cardBackgroundColors = currentPokemon.types[0].type.name + '-type';
    detailsContainer.className = `pokemon-details ${cardBackgroundColors}`;
}

function showPokemonDiv(currentPokemon, typesHTML) {
    return `
    <div class="navigate">
        <img class="navigation-image" src="./img/previous1.png" onclick="previousPokemon()"/>
        <img class="navigation-image" src="./img/cancel1.png" onclick="closePokemon()"/>
        <img class="navigation-image" src="./img/next1.png" onclick="nextPokemon()"/>
    </div>
    <div class="Pokename"><h1>${currentPokemon.name}</h1></div>
    <div class="large-types-container">${typesHTML}</div>           
    <img class="pokeball-img-large" src="./img/pokeball.png">
    <img class="pokemon-img-large" src="${currentPokemon.sprites.other['official-artwork'].front_default}">

    
    <div class="info-container">
        <div class="tabs">
            <div class="tab about" id="about-tab" onclick="showAbout()">
                <h2 class="info-container-names">About</h2>
            </div>
            <div class="tab base-stats" id="base-stats-tab" onclick="showBaseStats()">
                <h2 class="info-container-names">Base Stats</h2>
            </div>
            <div class="tab moves" id="moves-tab" onclick="showMoves()">
                <h2 class="info-container-names">Moves</h2>
            </div>
        </div>

        <div class="tab-contents" id="tab-contents">
            <div id="about-contents" class="tab-content">
                <p><b>Height:</b> <span id="height"></span></p>
                <p><b>Weight:</b> <span id="weight"></span></p>
                <p><b>Abilities:</b></p>
                <ul id="abilities"></ul>
            </div>

            <div id="base-contents" class="tab-content d-none">
                <canvas id="base-stats-chart"></canvas>
            </div>

            <div id="move-contents" class="tab-content d-none">
                <ul id="moves-list"></ul>
            </div>
        </div>
    </div>
    `;
}

function switchToPokemonDetailsView() {
    handleMainContainer();
    showDetailsContainer();
    hideElements();
}

function handleMainContainer() {
    document.getElementById('main-container').classList.add('d-none');
}

function showDetailsContainer() {
    document.getElementById('pokemon-details').classList.remove('d-none');
    document.getElementById('main-detail-container').classList.remove('d-none');
}

function hideElements() {
    let loadmore = document.getElementById('loadmore');
    if (loadmore) loadmore.classList.add('d-none');

    let header = document.getElementById('pokemonheader');
    if (header) header.classList.add('d-none');

    let about = document.getElementById('about-contents');
    if (about) about.classList.add('d-none');
}

function showAboutInfo(currentPokemon) {
    let heightElement = document.getElementById('height');
    let weightElement = document.getElementById('weight');
    let abilitiesList = document.getElementById('abilities');

    heightElement.textContent = currentPokemon.height / 10 + ' m';
    weightElement.textContent = currentPokemon.weight / 10 + ' kg';

    let abilitiesHTML = '';
    currentPokemon.abilities.forEach((ability) => {
        abilitiesHTML += `<li>${ability.ability.name}</li>`;
    });
    abilitiesList.innerHTML = abilitiesHTML;
}

function showBaseStatsInfo(currentPokemon) {
    let stats = currentPokemon.stats;
    let statNames = [
        'hp',
        'attack',
        'defense',
        'special-attack',
        'special-defense',
        'speed',
    ];
    for (let i = 0; i < statNames.length; i++) {
        let baseStats = document.getElementById(statNames[i]);
        if (baseStats) {
            baseStats.textContent = stats[i].baseStat;
        }
    }
}

function showMovesInfo(currentPokemon) {
    let movesList = document.getElementById('moves-list');
    let movesHTML = '';
    movesList.innerHTML = '';
    currentPokemon.moves.slice(0, 5).forEach((move) => {
        movesHTML += `<li>${move.move.name}</li>`;
    });
    movesList.innerHTML = movesHTML;
}

function showAbout() {
    clearAndDeselectTabs();
    let aboutContents = document.getElementById('about-contents');
    aboutContents.classList.remove('d-none');
    showAboutInfo(allPokemon[currentPokemonIndex]);
    document.getElementById('about-tab').classList.add('selected');
}

function showBaseStats() {
    clearAndDeselectTabs();
    let baseContents = document.getElementById('base-contents');
    baseContents.classList.remove('d-none');
    createBaseStatsChart(allPokemon[currentPokemonIndex]);
    document.getElementById('base-stats-tab').classList.add('selected');
}

function showMoves() {
    clearAndDeselectTabs();
    let moveContents = document.getElementById('move-contents');
    moveContents.classList.remove('d-none');
    showMovesInfo(allPokemon[currentPokemonIndex]);
    document.getElementById('moves-tab').classList.add('selected');
}

function closePokemon() {
    hideDetailsContainer();
    showMainContainer();
    hideMainDetailContainer();
    clearAndDeselectTabs();
}

function hideDetailsContainer() {
    document.getElementById('pokemon-details').classList.add('d-none');
    document.getElementById('loadmore').classList.remove('d-none');
}

function showMainContainer() {
    document.getElementById('main-container').classList.remove('d-none');
    document.getElementById('pokemonheader').classList.remove('d-none');
}

function hideMainDetailContainer() {
    document.getElementById('main-detail-container').classList.add('d-none');
}

function nextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        navigation();
        showPokemon(currentPokemonIndex + 1);
    }
}

function previousPokemon() {
    if (currentPokemonIndex > 0) {
        navigation();
        showPokemon(currentPokemonIndex - 1);
    }
}

function navigation() {
    handleTabs();
    hideTabs();
    document.getElementById('tab-contents').classList.remove('d-none');
}

function handleTabs() {
    document.getElementById('about-tab').classList.remove('selected');
    document.getElementById('base-stats-tab').classList.remove('selected');
    document.getElementById('moves-tab').classList.remove('selected');
}

function hideTabs() {
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('base-contents').classList.add('d-none');
    document.getElementById('move-contents').classList.add('d-none');
}

function clearAndDeselectTabs() {
    handleAboutTab();
    handleBaseStatsTab();
    handleMovesTab();
}

function handleAboutTab() {
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('about-tab').classList.remove('selected');
}

function handleBaseStatsTab() {
    document.getElementById('base-contents').classList.add('d-none');
    document.getElementById('base-stats-tab').classList.remove('selected');
}

function handleMovesTab() {
    document.getElementById('move-contents').classList.add('d-none');
    document.getElementById('moves-tab').classList.remove('selected');
}

function createBaseStatsChart(currentPokemon) {
    const canvas = document.getElementById('base-stats-chart');
    const ctx = canvas.getContext('2d');

    if (baseStatsChart) {
        baseStatsChart.destroy();
    }

    const labels = [
        'HP',
        'Attack',
        'Defense',
        'Spec. Attack',
        'Spec. Defense',
        'Speed',
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
                label: 'Base Stats',
                data: baseStats,
                backgroundColor: ['rgb(253, 236, 166)'],
                borderColor: ['rgb(53, 106, 188)'],
                borderWidth: 3,
            },
        ],
    };

    const config = {
        type: 'bar',
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

function filterNames(event) {
    event.preventDefault();
    let input = document.getElementById('search');
    let filter = input.value.trim().toLowerCase();
    let cards = document.getElementsByClassName('pokemon-card');

    for (let i = 0; i < cards.length; i++) {
        let name = cards[i]
            .getElementsByClassName('card-name')[0]
            .textContent.toLowerCase();

        if (name.includes(filter)) {
            showPokemon(i);
            input.value = '';
            return;
        }
    }
    swal.fire('This Pokemon is not available. Please load more');
    input.value = '';
}
