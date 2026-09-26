const TYPE_COLORS = {
    grass: 'rgba(120, 200, 80, 0.85)',
    poison: 'rgba(160, 64, 160, 0.85)',
    fire: 'rgba(240, 128, 48, 0.85)',
    water: 'rgba(104, 144, 240, 0.85)',
    electric: 'rgba(248, 208, 48, 0.85)',
    flying: 'rgba(168, 144, 240, 0.85)',
    bug: 'rgba(168, 184, 32, 0.85)',
    normal: 'rgba(168, 168, 120, 0.85)',
    ground: 'rgba(224, 192, 104, 0.85)',
    fairy: 'rgba(238, 153, 172, 0.85)',
    fighting: 'rgba(192, 48, 40, 0.85)',
    psychic: 'rgba(248, 88, 136, 0.85)',
    rock: 'rgba(184, 160, 56, 0.85)',
    steel: 'rgba(184, 184, 208, 0.85)',
    ice: 'rgba(152, 216, 216, 0.85)',
    ghost: 'rgba(112, 88, 152, 0.85)',
    dragon: 'rgba(112, 56, 248, 0.85)'
};

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

function setPokemonGradient(element, types) {
    const color1 = TYPE_COLORS[types[0].type.name] || 'rgba(168, 168, 120, 0.85)';
    const color2 = types[1] ? TYPE_COLORS[types[1].type.name] : color1;
    element.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
}

function showPokemon(pokemonIndex) {
    if (!allPokemon[pokemonIndex]) return;

    currentPokemonIndex = pokemonIndex;
    const currentPokemon = allPokemon[pokemonIndex];
    
    let typesHTML = '';
    currentPokemon.types.forEach((t) => {
        typesHTML += `<button class="type-button glass-effect shadow ${t.type.name}-type">${t.type.name}</button>`;
    });

    const detailsContainer = document.getElementById('pokemon-details');
    detailsContainer.innerHTML = showPokemonDiv(currentPokemon, typesHTML);
    setPokemonGradient(detailsContainer, currentPokemon.types);

    document.getElementById('main-container').classList.add('d-none');
    document.getElementById('loadmore').classList.add('d-none');
    document.getElementById('main-detail-container').classList.remove('d-none');
    detailsContainer.classList.remove('d-none');
    showAbout();
}

function closePokemon() {
    document.getElementById('pokemon-details').classList.add('d-none');
    document.getElementById('main-detail-container').classList.add('d-none');
    document.getElementById('main-container').classList.remove('d-none');
    document.getElementById('loadmore').classList.remove('d-none');
    
    clearAndDeselectTabs();
}

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
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Base Stats',
                data: baseStats,
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 180,
                    ticks: { display: false },
                    grid: { color: 'rgba(255, 255, 255, 0.2)' },
                    angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                    pointLabels: { color: 'white', font: { size: 11 } }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function filterBySelectedType() {
    const selectedType = document.getElementById('type-select').value;
    const cards = document.getElementsByClassName('pokemon-card');
    let foundCount = 0;

    for (let i = 0; i < cards.length; i++) {
        if (selectedType === 'all' || cards[i].classList.contains(`${selectedType}-type`)) {
            cards[i].style.display = '';
            foundCount++;
        } else {
            cards[i].style.display = 'none';
        }
    }

    if (foundCount === 0 && selectedType !== 'all' && typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Kein Pokémon gefunden',
            text: 'Unter den aktuell geladenen Pokémon ist keines dieses Typs. Klicke auf "Load More", um mehr zu laden!'
        });
    }
}

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
