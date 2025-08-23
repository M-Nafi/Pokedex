let numberOfPokemons = 30;
let more = 30;
let currentPokemon;
let currentPokemonIndex = 0;
let allPokemon = [];
let cardBackgroundColors = [];
let baseStatsChart;

/**
 * Fetches a Pokemon from the PokeAPI, adds it to the allPokemon array and
 * generates a Pokemon card for the main container.
 */
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

/**
 * Generates a Pokemon card and adds it to the main container.
 */
function generateMainContainer(currentPokemon, index, typesHTML) {
    let mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML += generatePokemonDiv(
        currentPokemon,
        cardBackgroundColors,
        index,
        typesHTML
    );
}

/**
 * Loads the first 30 Pokemon from the PokeAPI and generates their cards in the
 * main container.
 */
function loadPokemons() {
    for (let i = 1; i <= numberOfPokemons; i++) {
        loadPokemon(i);
    }
}

/**
 * Loads more Pokemon from the PokeAPI and generates their cards in the
 * main container.
 *
 * @async
 */
async function loadMore() {
    for (let i = numberOfPokemons + 1; i <= numberOfPokemons + more; i++) {
        loadPokemon(i);
    }
    numberOfPokemons += more;
}

/**
 * Generates a Pokemon card div with the given Pokemon data, background color,
 * index and types HTML.
 */
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

/**
 * Shows the Pokemon details view for the Pokemon with the given index.
 */
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

/**
 * Sets up the Pokemon details view with the given Pokemon data, types HTML
 * and index.
 */
function detailViewHelp(currentPokemon, typesHTML, pokemonIndex) {
    let detailsContainer = document.getElementById('pokemon-details');
    detailsContainer.innerHTML = showPokemonDiv(currentPokemon, typesHTML);
    currentPokemonIndex = pokemonIndex;
    cardBackgroundColors = currentPokemon.types[0].type.name + '-type';
    detailsContainer.className = `pokemon-details ${cardBackgroundColors}`;
}

/**
 * Generates a Pokemon details view div with the given Pokemon data and types HTML.
 */
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
                <p><b>Height:</b> <span id="height" style="margin-left:5px;"></span></p>
                <p><b>Weight:</b> <span id="weight" style="margin-left:5px;"></span></p>
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

/**
 * Handles the switch to the details view of a Pokemon, by hiding the main view, showing the details view, and hiding other elements.
 */
function switchToPokemonDetailsView() {
    handleMainContainer();
    showDetailsContainer();
    hideElements();
}

/**
 * Hides the main container with all Pokemon cards from the PokeAPI.
 */
function handleMainContainer() {
    document.getElementById('main-container').classList.add('d-none');
}

/**
 * Shows the details container and Pokemon details view when a Pokemon is clicked.
 */
function showDetailsContainer() {
    document.getElementById('pokemon-details').classList.remove('d-none');
    document.getElementById('main-detail-container').classList.remove('d-none');
}

/**
 * Hides elements that are not needed in the Pokemon details view, such as the "Load more" button, the header and the about tab.
 */
function hideElements() {
    let loadmore = document.getElementById('loadmore');
    if (loadmore) loadmore.classList.add('d-none');

    let header = document.getElementById('pokemonheader');
    if (header) header.classList.add('d-none');

    let about = document.getElementById('about-contents');
    if (about) about.classList.add('d-none');
}

/**
 * Shows the information about the given Pokemon in the about tab of the details view.
 */
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

/**
 * Shows the base stats of the given Pokemon in the base stats tab of the details view.
 */
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

/**
 * Shows the moves of the given Pokemon in the moves tab of the details view.
 * Shows the 5 first moves of the Pokemon.
 */
function showMovesInfo(currentPokemon) {
    let movesList = document.getElementById('moves-list');
    let movesHTML = '';
    movesList.innerHTML = '';
    currentPokemon.moves.slice(0, 5).forEach((move) => {
        movesHTML += `<li>${move.move.name}</li>`;
    });
    movesList.innerHTML = movesHTML;
}

/**
 * Shows the information about the current Pokemon in the about tab of the details view.
 * Called when the about tab is clicked.
 */
function showAbout() {
    clearAndDeselectTabs();
    let aboutContents = document.getElementById('about-contents');
    aboutContents.classList.remove('d-none');
    showAboutInfo(allPokemon[currentPokemonIndex]);
    document.getElementById('about-tab').classList.add('selected');
}

/**
 * Shows the base stats of the current Pokemon in the base stats tab of the details view.
 * Called when the base stats tab is clicked.
 */
function showBaseStats() {
    clearAndDeselectTabs();
    let baseContents = document.getElementById('base-contents');
    baseContents.classList.remove('d-none');
    createBaseStatsChart(allPokemon[currentPokemonIndex]);
    document.getElementById('base-stats-tab').classList.add('selected');
}

/**
 * Shows the moves of the current Pokemon in the moves tab of the details view.
 * Called when the moves tab is clicked.
 * Clears and deselects all tabs, shows the moves tab, shows the 5 first moves of the Pokemon, and selects the moves tab.
 */
function showMoves() {
    clearAndDeselectTabs();
    let moveContents = document.getElementById('move-contents');
    moveContents.classList.remove('d-none');
    showMovesInfo(allPokemon[currentPokemonIndex]);
    document.getElementById('moves-tab').classList.add('selected');
}

/**
 * Closes the Pokemon details view and shows the main container with all the Pokemon.
 * Called when the cancel button in the details view is clicked.
 */
function closePokemon() {
    hideDetailsContainer();
    showMainContainer();
    hideMainDetailContainer();
    clearAndDeselectTabs();
}

/**
 * Hides the details container and shows the load more button.
 */
function hideDetailsContainer() {
    document.getElementById('pokemon-details').classList.add('d-none');
    document.getElementById('loadmore').classList.remove('d-none');
}

/**
 * Shows the main container with all Pokemon cards and the header with the search bar.
 * Hides the details container.
 * Called when the cancel button in the details view is clicked.
 */
function showMainContainer() {
    document.getElementById('main-container').classList.remove('d-none');
    document.getElementById('pokemonheader').classList.remove('d-none');
}

/**
 * Hides the main detail container.
 */
function hideMainDetailContainer() {
    document.getElementById('main-detail-container').classList.add('d-none');
}

/**
 * Shows the next Pokemon in the Pokemon list.
 * If the current Pokemon is the last one in the list, does nothing.
 * Calls the navigation function and then the showPokemon function with the index of the next Pokemon.
 */
function nextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        navigation();
        showPokemon(currentPokemonIndex + 1);
    }
}

/**
 * Shows the previous Pokemon in the Pokemon list.
 * If the current Pokemon is the first one in the list, does nothing.
 * Calls the navigation function and then the showPokemon function with the index of the previous Pokemon.
 */
function previousPokemon() {
    if (currentPokemonIndex > 0) {
        navigation();
        showPokemon(currentPokemonIndex - 1);
    }
}

/**
 * Handles the navigation between the main container and the details container.
 * Hides all tab contents and then shows the one that was selected.
 * Called when the previous or next button in the details view is clicked.
 */
function navigation() {
    handleTabs();
    hideTabs();
    document.getElementById('tab-contents').classList.remove('d-none');
}

/**
 * Deselects all tabs by removing the 'selected' class from them.
 */
function handleTabs() {
    document.getElementById('about-tab').classList.remove('selected');
    document.getElementById('base-stats-tab').classList.remove('selected');
    document.getElementById('moves-tab').classList.remove('selected');
}

/**
 * Hides all tab contents by adding the 'd-none' class to them.
 * Called by the navigation function.
 */
function hideTabs() {
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('base-contents').classList.add('d-none');
    document.getElementById('move-contents').classList.add('d-none');
}

/**
 * Clears all tab contents and deselects all tabs.
 * Calls the handle functions for each tab.
 */
function clearAndDeselectTabs() {
    handleAboutTab();
    handleBaseStatsTab();
    handleMovesTab();
}

/**
 * Hides the about tab contents and deselects the about tab.
 * Called when a different tab is selected.
 */
function handleAboutTab() {
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('about-tab').classList.remove('selected');
}

/**
 * Hides the base stats tab contents and deselects the base stats tab.
 * Called when a different tab is selected.
 */
function handleBaseStatsTab() {
    document.getElementById('base-contents').classList.add('d-none');
    document.getElementById('base-stats-tab').classList.remove('selected');
}

/**
 * Hides the moves tab contents and deselects the moves tab.
 * Called when a different tab is selected.
 */
function handleMovesTab() {
    document.getElementById('move-contents').classList.add('d-none');
    document.getElementById('moves-tab').classList.remove('selected');
}

/**
 * Creates a bar chart with the base stats of the given Pokemon.
 * Called when the base stats tab is clicked.
 * Destroys the previous chart if it exists.
 */
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

/**
 * Filters the list of Pokemon cards in the main container according to the user's
 * input in the search bar.
 * If the search bar is empty, all cards are shown.
 * If the search bar is not empty, only cards whose name contains the search
 * string are shown.
 * If the search string does not match any Pokemon, shows a warning/sweetalert message
 * and clears the search bar.
 */
function filterNames() {
    let input = document.getElementById('search');
    let filter = input.value.trim().toLowerCase();
    let cards = document.getElementsByClassName('pokemon-card');
    let found = 0;

    for (let i = 0; i < cards.length; i++) {
        let nameElement = cards[i].getElementsByClassName('card-name')[0];
        let name = nameElement ? nameElement.textContent.toLowerCase() : '';

        if (filter === '' || name.includes(filter)) {
            cards[i].style.display = '';
            found++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    if (filter !== '' && found === 0) {
        swal.fire('This Pokémon is not available. Please load more');
    }
}
