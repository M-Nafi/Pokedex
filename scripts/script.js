let numberOfPokemons = 30;
let more = 30;
let currentPokemonIndex = 0;
let allPokemon = [];
let baseStatsChart = null;

/**
 * Lädt die initialen Pokémon beim Seitenstart.
 */
async function loadPokemons() {
    for (let i = 1; i <= numberOfPokemons; i++) {
        await loadPokemon(i);
    }
}

/**
 * Holt die Daten eines Pokémon von der PokéAPI.
 */
async function loadPokemon(data) {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${data}`;
        const response = await fetch(url);
        const pokemon = await response.json();
        
        allPokemon.push(pokemon);
        const index = allPokemon.length - 1;

        let typesHTML = '';
        pokemon.types.forEach((type) => {
            typesHTML += `<button class="type-button glass-effect shadow ${type.type.name}-type">${type.type.name}</button>`;
        });



        generateMainContainer(pokemon, index, typesHTML);
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Daten:", error);
    }
}

/**
 * Rendert die Karte in das Haupt-Container Element.
 */
function generateMainContainer(currentPokemon, index, typesHTML) {
    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML += generatePokemonDiv(currentPokemon, index, typesHTML);
}

/**
 * Lädt weitere Pokémon nach.
 */
async function loadMore() {
    const start = numberOfPokemons + 1;
    const end = numberOfPokemons + more;
    numberOfPokemons += more;

    for (let i = start; i <= end; i++) {
        await loadPokemon(i);
    }
}
