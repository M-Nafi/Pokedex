let numberOfPokemons = 30;
let more = 30;
let currentPokemonIndex = 0;
let allPokemon = [];
let baseStatsChart = null;
let sweetAlertPromise = null;

async function loadPokemons() {
    await loadPokemonRange(1, numberOfPokemons);
}

async function loadPokemon(data) {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${data}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`PokéAPI antwortete mit HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Fehler beim Laden von Pokémon ${data}:`, error);
        return null;
    }
}

async function loadPokemonRange(start, end) {
    const batchSize = 6;
    addPokemonPlaceholders(start, end);

    for (let batchStart = start; batchStart <= end; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize - 1, end);
        await Promise.all(
            Array.from({ length: batchEnd - batchStart + 1 }, async (_, offset) => {
                const pokemonId = batchStart + offset;
                const pokemon = await loadPokemon(pokemonId);

                if (!pokemon) {
                    const placeholder = document.getElementById(`pokemon-placeholder-${pokemonId}`);
                    if (placeholder) {
                        placeholder.classList.remove('pokemon-card-placeholder');
                        placeholder.classList.add('pokemon-card-error');
                        placeholder.removeAttribute('aria-hidden');
                        placeholder.textContent = 'Pokémon konnte nicht geladen werden';
                    }
                    return;
                }

                const index = pokemonId - 1;
                allPokemon[index] = pokemon;
                const typesHTML = pokemon.types
                    .map((type) => `<span class="type-button glass-effect shadow ${type.type.name}-type">${type.type.name}</span>`)
                    .join('');

                generateMainContainer(pokemon, index, typesHTML, pokemonId);
            })
        );
    }
}

function addPokemonPlaceholders(start, end) {
    const mainContainer = document.getElementById('main-container');
    const placeholders = document.createDocumentFragment();

    for (let id = start; id <= end; id++) {
        if (document.getElementById(`pokemon-placeholder-${id}`)) continue;

        const placeholder = document.createElement('div');
        placeholder.id = `pokemon-placeholder-${id}`;
        placeholder.className = 'pokemon-card pokemon-card-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        placeholders.append(placeholder);
    }

    mainContainer.append(placeholders);
}

function generateMainContainer(currentPokemon, index, typesHTML, pokemonId) {
    const placeholder = document.getElementById(`pokemon-placeholder-${pokemonId}`);
    if (!placeholder) {
        throw new Error(`Platzhalter für Pokémon ${pokemonId} nicht gefunden`);
    }

    placeholder.outerHTML = generatePokemonDiv(currentPokemon, index, typesHTML);
}

function loadSweetAlert() {
    if (window.Swal) return Promise.resolve(window.Swal);
    if (sweetAlertPromise) return sweetAlertPromise;

    sweetAlertPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@9';
        script.onload = () => {
            if (!window.Swal) {
                sweetAlertPromise = null;
                reject(new Error('SweetAlert wurde geladen, ist aber nicht verfügbar'));
                return;
            }
            resolve(window.Swal);
        };
        script.onerror = () => {
            sweetAlertPromise = null;
            reject(new Error('SweetAlert konnte nicht geladen werden'));
        };
        document.head.append(script);
    });

    return sweetAlertPromise;
}

async function showNoPokemonAlert(options) {
    const swal = await loadSweetAlert();
    await swal.fire(options);
}

async function loadMore() {
    const start = numberOfPokemons + 1;
    const end = numberOfPokemons + more;
    numberOfPokemons += more;

    await loadPokemonRange(start, end);
}

document.addEventListener('DOMContentLoaded', loadPokemons);
