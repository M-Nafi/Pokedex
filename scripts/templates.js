/**
 * Generiert die HTML-Karte für ein einzelnes Pokémon in der Hauptansicht.
 */
function generatePokemonDiv(currentPokemon, index, typesHTML) {
    const firstType = currentPokemon.types[0].type.name;
    return `
    <div class="pokemon-card ${firstType}-type glass-effect" onclick="showPokemon(${index})">
      <h1 class="card-name text-shadow">${currentPokemon.name}</h1>
      <div class="types-container">${typesHTML}</div>
      <img class="pokemon-img" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${currentPokemon.name}">
      <img class="pokeball" src="./assets/img/pokeball.png" alt="Pokeball">
    </div>
  `;
}

/**
 * Generiert das HTML für das Modal / die Detailansicht.
 */
function showPokemonDiv(currentPokemon, typesHTML) {
    return `
    <div class="navigate">
        <button class="glass-btn glass-effect shadow" onclick="previousPokemon()" aria-label="Vorheriges Pokemon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>

        <button class="glass-btn glass-effect shadow" onclick="closePokemon()" aria-label="Schließen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <button class="glass-btn glass-effect shadow" onclick="nextPokemon()" aria-label="Nächstes Pokemon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    </div>

    <div class="large-types-container">${typesHTML}</div> 
    <div class="Pokename">
        <h1 class="text-shadow">${currentPokemon.name}</h1>
    </div>          
    <img class="pokeball-img-large" src="./assets/img/pokeball.png" alt="Pokeball background">
    <img class="pokemon-img-large" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${currentPokemon.name}">

    <div class="info-container glass-effect">
        <div class="tabs">
            <div class="tab about selected" id="about-tab" onclick="showAbout()">
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
