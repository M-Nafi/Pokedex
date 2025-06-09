let numberOfPokemons = 30;
let more = 30;
let currentPokemon;
let currentPokemonIndex = 0;
let allPokemon = [];
let cardBackgroundColors = [];
let baseStatsChart;

/**
 * Fetches a Pokemon from the PokeAPI and adds it to the list of all Pokemon
 * @param {string} data - The Pokemon's name or ID
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
 * Generates the HTML for the main container and appends it
 * to the #main-container element.
 * @param {object} currentPokemon - The Pokemon object
 * @param {number} index - The index of the Pokemon in the allPokemon array
 * @param {string} typesHTML - The HTML for the Pokemon's types
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
 * Loads a set number of Pokemon by calling loadPokemon for each
 * Pokemon ID ranging from 1 to numberOfPokemons.
 */
function loadPokemons() {
    for (let i = 1; i <= numberOfPokemons; i++) {
        loadPokemon(i);
    }
}

/**
 * Loads the next set of Pokemon by calling loadPokemon for each Pokemon ID
 * ranging from the current numberOfPokemons + 1 to numberOfPokemons + more.
 * @async
 */
async function loadMore() {
    for (let i = numberOfPokemons + 1; i <= numberOfPokemons + more; i++) {
        loadPokemon(i);
    }
    numberOfPokemons += more;
}

/**
 * Generates the HTML for a Pokemon card and returns it as a string
 * @param {object} currentPokemon - The Pokemon object
 * @param {string} cardBackgroundColors - The Pokemon's type, used for the card's background color
 * @param {number} index - The index of the Pokemon in the allPokemon array
 * @param {string} typesHTML - The HTML for the Pokemon's types
 * @returns {string} The HTML for the Pokemon card
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
 * Shows the Pokemon details view for the Pokemon at the given index
 * @param {number} pokemonIndex - The index of the Pokemon in the allPokemon array
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
 * Updates the Pokemon details view with information about the specified Pokemon.
 * Sets the inner HTML of the details container to display the Pokemon's details.
 * Updates the current Pokemon index and background color based on the Pokemon's type.
 * @param {object} currentPokemon - The Pokemon object containing details to display.
 * @param {string} typesHTML - The HTML representing the Pokemon's types.
 * @param {number} pokemonIndex - The index of the Pokemon in the allPokemon array.
 */
function detailViewHelp(currentPokemon, typesHTML, pokemonIndex) {
    let detailsContainer = document.getElementById('pokemon-details');
    detailsContainer.innerHTML = showPokemonDiv(currentPokemon, typesHTML);
    currentPokemonIndex = pokemonIndex;
    cardBackgroundColors = currentPokemon.types[0].type.name + '-type';
    detailsContainer.className = `pokemon-details ${cardBackgroundColors}`;
}

/**
 * Generates the HTML for the Pokemon details view and returns it as a string.
 * @param {object} currentPokemon - The Pokemon object containing details to display.
 * @param {string} typesHTML - The HTML representing the Pokemon's types.
 * @returns {string} The HTML for the Pokemon details view.
 */
function showPokemonDiv(currentPokemon, typesHTML) {
    return `
    <div class="Pokename"><h1>${currentPokemon.name}</h1></div>
    <div class="large-types-container">${typesHTML}</div>           
    <img class="pokeball-img-large" src="./img/pokeball.png">
    <img class="pokemon-img-large" src="${currentPokemon.sprites.other['official-artwork'].front_default}">       
  `;
}

/**
 * Switches the view to display the Pokemon details.
 * Hides the main container and other elements while showing the details container.
 */
function switchToPokemonDetailsView() {
    handleMainContainer();
    showDetailsContainer();
    hideElements();
}

/**
 * Hides the main container by adding the 'd-none' class to it.
 */
function handleMainContainer() {
    document.getElementById('main-container').classList.add('d-none');
}

/**
 * Shows the Pokemon details container and the details inside it by removing the 'd-none' class.
 */
function showDetailsContainer() {
    document.getElementById('pokemon-details').classList.remove('d-none');
    document.getElementById('main-detail-container').classList.remove('d-none');
}

/**
 * Hides elements that are not needed when the details view is displayed.
 * Elements that are hidden include the "Load more" button, the "About" details
 * and the header.
 */
function hideElements() {
    document.getElementById('loadmore').classList.add('d-none');
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('pokemonheader').classList.add('d-none');
}

/**
 * Populates the "About" details with the Pokemon's height, weight and abilities.
 * @param {object} currentPokemon - The Pokemon object containing the details to display.
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
 * Populates the base stats information of a Pokemon in the DOM.
 * Updates the text content of elements with IDs corresponding to
 * each stat (hp, attack, defense, special-attack, special-defense, speed)
 * with the Pokemon's base stat values.
 * @param {object} currentPokemon - The Pokemon object containing base stats to display.
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
 * Populates the moves information of a Pokemon in the DOM.
 * Updates the innerHTML of the element with ID 'moves-list' with
 * the names of the Pokemon's first 5 moves in an unordered list.
 * @param {object} currentPokemon - The Pokemon object containing moves to display.
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
 * Displays the "About" tab with the current Pokemon's details.
 * Clears and deselects other tabs, shows the "About" content, and
 * highlights the "About" tab. Populates the details with the current
 * Pokemon's height, weight, and abilities.
 */
function showAbout() {
    clearAndDeselectTabs();
    let aboutContents = document.getElementById('about-contents');
    aboutContents.classList.remove('d-none');
    showAboutInfo(allPokemon[currentPokemonIndex]);
    document.getElementById('about-tab').classList.add('selected');
}

/**
 * Displays the "Base Stats" tab with the current Pokemon's stats.
 * Clears and deselects other tabs, shows the "Base Stats" content, and
 * highlights the "Base Stats" tab. Creates a bar chart in the "Base Stats"
 * tab with the current Pokemon's base stats.
 */
function showBaseStats() {
    clearAndDeselectTabs();
    let baseContents = document.getElementById('base-contents');
    baseContents.classList.remove('d-none');
    createBaseStatsChart(allPokemon[currentPokemonIndex]);
    document.getElementById('base-stats-tab').classList.add('selected');
}

/**
 * Displays the "Moves" tab with the current Pokemon's moves.
 * Clears and deselects other tabs, shows the "Moves" content, and
 * highlights the "Moves" tab. Populates the details with the current
 * Pokemon's first 5 moves in an unordered list.
 */
function showMoves() {
    clearAndDeselectTabs();
    let moveContents = document.getElementById('move-contents');
    moveContents.classList.remove('d-none');
    showMovesInfo(allPokemon[currentPokemonIndex]);
    document.getElementById('moves-tab').classList.add('selected');
}

/**
 * Closes the Pokemon details view and returns to the main list view.
 * Hides the details view container, shows the main container, hides the main
 * detail container, and clears any selected tab in the details view.
 */
function closePokemon() {
    hideDetailsContainer();
    showMainContainer();
    hideMainDetailContainer();
    clearAndDeselectTabs();
}

/**
 * Hides the Pokemon details container and shows the "Load more" button.
 * Used when the user closes the Pokemon details view and returns to the main
 * list view.
 */
function hideDetailsContainer() {
    document.getElementById('pokemon-details').classList.add('d-none');
    document.getElementById('loadmore').classList.remove('d-none');
}

/**
 * Shows the main container and the header by removing the 'd-none' class
 * from both elements. Used when the user closes the Pokemon details view
 * and returns to the main list view.
 */
function showMainContainer() {
    document.getElementById('main-container').classList.remove('d-none');
    document.getElementById('pokemonheader').classList.remove('d-none');
}

/**
 * Hides the main detail container element which contains the Pokemon details
 * view by adding the 'd-none' class to it. Used when the user closes the
 * Pokemon details view and returns to the main list view.
 */
function hideMainDetailContainer() {
    document.getElementById('main-detail-container').classList.add('d-none');
}

/**
 * Shows the Pokemon details view for the Pokemon at the next index in the
 * allPokemon array. Increments the currentPokemonIndex and then calls the
 * showPokemon function with the incremented index.
 */
function nextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        navigation();
        showPokemon(currentPokemonIndex + 1);
    }
}

/**
 * Shows the Pokemon details view for the Pokemon at the previous index in the
 * allPokemon array. Decrements the currentPokemonIndex and then calls the
 * showPokemon function with the decremented index.
 */
function previousPokemon() {
    if (currentPokemonIndex > 0) {
        navigation();
        showPokemon(currentPokemonIndex - 1);
    }
}

/**
 * Handles the navigation between the main list view and the Pokemon details
 * view. First resets the tabs by removing the 'selected' class from each of
 * them, then hides all the tabs by adding the 'd-none' class to the
 * 'tabs' element, and finally shows the Pokemon details view by removing the
 * 'd-none' class from the 'tab-contents' element.
 */
function navigation() {
    handleTabs();
    hideTabs();
    document.getElementById('tab-contents').classList.remove('d-none');
}

/**
 * Resets the tabs by removing the 'selected' class from each of them.
 * Called when navigating between the main list view and the Pokemon details
 * view, and when changing the selected Pokemon in the Pokemon details view.
 */
function handleTabs() {
    document.getElementById('about-tab').classList.remove('selected');
    document.getElementById('base-stats-tab').classList.remove('selected');
    document.getElementById('moves-tab').classList.remove('selected');
}

/**
 * Hides the contents of all the tabs in the Pokemon details view.
 * Adds the 'd-none' class to the 'about-contents', 'base-contents', and
 * 'move-contents' elements. Used when navigating between the main list view
 * and the Pokemon details view.
 */
function hideTabs() {
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('base-contents').classList.add('d-none');
    document.getElementById('move-contents').classList.add('d-none');
}

/**
 * Clears and deselects all the tabs in the Pokemon details view.
 * Hides all the content elements of the tabs, removes the 'selected' class
 * from the tab elements, and is used when navigating between the main list
 * view and the Pokemon details view, and when changing the selected Pokemon
 * in the Pokemon details view.
 */
function clearAndDeselectTabs() {
    handleAboutTab();
    handleBaseStatsTab();
    handleMovesTab();
}

/**
 * Hides the content of the 'About' tab and deselects the 'About' tab.
 * Called when navigating between the main list view and the Pokemon details
 * view, and when changing the selected Pokemon in the Pokemon details view.
 */
function handleAboutTab() {
    document.getElementById('about-contents').classList.add('d-none');
    document.getElementById('about-tab').classList.remove('selected');
}

/**
 * Hides the content of the 'Base Stats' tab and deselects the 'Base Stats' tab.
 * Called when navigating between the main list view and the Pokemon details
 * view, and when changing the selected Pokemon in the Pokemon details view.
 */
function handleBaseStatsTab() {
    document.getElementById('base-contents').classList.add('d-none');
    document.getElementById('base-stats-tab').classList.remove('selected');
}

/**
 * Hides the content of the 'Moves' tab and deselects the 'Moves' tab.
 * Called when navigating between the main list view and the Pokemon details
 * view, and when changing the selected Pokemon in the Pokemon details view.
 */
function handleMovesTab() {
    document.getElementById('move-contents').classList.add('d-none');
    document.getElementById('moves-tab').classList.remove('selected');
}

/**
 * Creates a bar chart in the 'Base Stats' tab using the current Pokemon's
 * base stats. The chart is created using the Chart.js library.
 * @param {Object} currentPokemon - The current Pokemon object.
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
 * Handles searching for a pokemon by name
 * @param {Event} event the DOM event for the search form's submit event
 */
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
