/**
 * Event-Listener für die Suchleiste im Header einrichten.
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('pokemon-search');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput) {
        searchInput.addEventListener('keyup', filterNames);
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', filterNames);
    }
});

/**
 * Filtert die angezeigten Pokémon-Karten live anhand der Eingabe.
 */
function filterNames() {
    const input = document.getElementById('pokemon-search');
    if (!input) return;

    const filter = input.value.trim().toLowerCase();
    const cards = document.getElementsByClassName('pokemon-card');
    let found = 0;

    for (let i = 0; i < cards.length; i++) {
        const nameElement = cards[i].getElementsByClassName('card-name')[0];
        const name = nameElement ? nameElement.textContent.toLowerCase() : '';

        if (filter === '' || name.includes(filter)) {
            cards[i].style.display = '';
            found++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    if (filter !== '' && found === 0 && typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Kein Pokémon gefunden',
            text: 'Bitte lade mehr Pokémon oder überprüfe deinen Suchbegriff.'
        });
    }
}

/**
 * Steuert das Öffnen der Detailansicht.
 */
function showPokemon(pokemonIndex) {
    if (!allPokemon[pokemonIndex]) return;

    currentPokemonIndex = pokemonIndex;
    const currentPokemon = allPokemon[pokemonIndex];
    
    let typesHTML = '';
    currentPokemon.types.forEach((type) => {
        typesHTML += `<button class="type-button glass-effect shadow">${type.type.name}</button>`;
    });

    const detailsContainer = document.getElementById('pokemon-details');
    detailsContainer.innerHTML = showPokemonDiv(currentPokemon, typesHTML);
    detailsContainer.className = `pokemon-details ${currentPokemon.types[0].type.name}-type`;

    // Ansicht umschalten
    document.getElementById('main-container').classList.add('d-none');
    document.getElementById('loadmore').classList.add('d-none');
    document.getElementById('main-detail-container').classList.remove('d-none');
    detailsContainer.classList.remove('d-none');

    // Standardmäßig "About" Tab befüllen
    showAbout();
}

/**
 * Schließt die Detailansicht und stellt das Haupt-Layout wieder her.
 */
function closePokemon() {
    document.getElementById('pokemon-details').classList.add('d-none');
    document.getElementById('main-detail-container').classList.add('d-none');
    
    // Hauptinhalte wieder anzeigen
    document.getElementById('main-container').classList.remove('d-none');
    document.getElementById('loadmore').classList.remove('d-none');
    
    clearAndDeselectTabs();
}

/* Tabs & Details Logik */
function showAbout() {
    clearAndDeselectTabs();
    document.getElementById('about-contents').classList.remove('d-none');
    document.getElementById('about-tab').classList.add('selected');
    
    const pokemon = allPokemon[currentPokemonIndex];
    document.getElementById('height').textContent = (pokemon.height / 10) + ' m';
    document.getElementById('weight').textContent = (pokemon.weight / 10) + ' kg';

    let abilitiesHTML = '';
    pokemon.abilities.forEach((ability) => {
        abilitiesHTML += `<li>${ability.ability.name}</li>`;
    });
    document.getElementById('abilities').innerHTML = abilitiesHTML;
}

function showBaseStats() {
    clearAndDeselectTabs();
    document.getElementById('base-contents').classList.remove('d-none');
    document.getElementById('base-stats-tab').classList.add('selected');
    createBaseStatsChart(allPokemon[currentPokemonIndex]);
}

function showMoves() {
    clearAndDeselectTabs();
    document.getElementById('move-contents').classList.remove('d-none');
    document.getElementById('moves-tab').classList.add('selected');

    const pokemon = allPokemon[currentPokemonIndex];
    let movesHTML = '';
    pokemon.moves.slice(0, 5).forEach((move) => {
        movesHTML += `<li>${move.move.name}</li>`;
    });
    document.getElementById('moves-list').innerHTML = movesHTML;
}

function clearAndDeselectTabs() {
    ['about-contents', 'base-contents', 'move-contents'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('d-none');
    });
    ['about-tab', 'base-stats-tab', 'moves-tab'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('selected');
    });
}

function nextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        showPokemon(currentPokemonIndex + 1);
    }
}

function previousPokemon() {
    if (currentPokemonIndex > 0) {
        showPokemon(currentPokemonIndex - 1);
    }
}

function createBaseStatsChart(currentPokemon) {
    const canvas = document.getElementById('base-stats-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (baseStatsChart) {
        baseStatsChart.destroy();
    }

    const labels = ['HP', 'Attack', 'Defense', 'Spec. Attack', 'Spec. Defense', 'Speed'];
    const baseStats = currentPokemon.stats.map(s => s.base_stat);

    baseStatsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Base Stats',
                data: baseStats,
                backgroundColor: ['rgb(253, 236, 166)'],
                borderColor: ['rgb(53, 106, 188)'],
                borderWidth: 2
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 200 } },
            plugins: { legend: { display: false } }
        }
    });
}

/**
 * Filtert die bereits geladenen Pokémon im Haupt-Container nach ihrem Typ.
 */
function filterBySelectedType() {
    const selectedType = document.getElementById('type-select').value;
    const cards = document.getElementsByClassName('pokemon-card');
    let foundCount = 0;

    for (let i = 0; i < cards.length; i++) {
        // Prüft, ob die Karte die CSS-Klasse des gewählten Typs besitzt (z.B. "fire-type")
        if (selectedType === 'all' || cards[i].classList.contains(`${selectedType}-type`)) {
            cards[i].style.display = '';
            foundCount++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    // Falls bei den aktuell geladenen Pokémon kein Treffer dabei ist
    if (foundCount === 0 && selectedType !== 'all' && typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Kein Pokémon gefunden',
            text: 'Unter den aktuell geladenen Pokémon ist keines dieses Typs. Klicke auf "Load More", um mehr zu laden!'
        });
    }
}

/**
 * Setzt den Filter zurück und zeigt wieder alle Pokémon an (Home-Button).
 */
function resetFilter() {
    const typeSelect = document.getElementById('type-select');
    const searchInput = document.getElementById('pokemon-search');

    if (typeSelect) typeSelect.value = 'all';
    if (searchInput) searchInput.value = '';

    const cards = document.getElementsByClassName('pokemon-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = '';
    }
}
