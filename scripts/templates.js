function generatePokemonDiv(currentPokemon, index, typesHTML) {
    const firstType = currentPokemon.types[0].type.name;
    return `
    <button type="button" class="pokemon-card ${firstType}-type glass-effect" data-pokemon-index="${index}" aria-label="Details zu ${currentPokemon.name} anzeigen" onclick="showPokemon(${index})">
      <span class="card-name text-shadow">${currentPokemon.name}</span>
      <span class="types-container">${typesHTML}</span>
      <img class="pokemon-img" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${currentPokemon.name}" width="160" height="160" loading="${index === 0 ? 'eager' : 'lazy'}" fetchpriority="${index === 0 ? 'high' : 'auto'}" decoding="async">
      <img class="pokeball" src="./assets/img/pokeball.png" alt="" aria-hidden="true" width="270" height="270" loading="${index === 0 ? 'eager' : 'lazy'}" fetchpriority="${index === 0 ? 'high' : 'auto'}" decoding="async">
    </button>
  `;
}

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
    <img class="pokeball-img-large" src="./assets/img/pokeball.png" alt="" aria-hidden="true">
    <img class="pokemon-img-large" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${currentPokemon.name}">

    <div class="info-container glass-effect">
        <div class="tabs" role="tablist" aria-label="Pokémon-Informationen">
            <button type="button" class="tab about selected" id="about-tab" role="tab" aria-controls="about-contents" aria-selected="true" tabindex="0" onclick="showAbout()" onkeydown="handleTabKeydown(event)">About</button>
            <button type="button" class="tab base-stats" id="base-stats-tab" role="tab" aria-controls="base-contents" aria-selected="false" tabindex="-1" onclick="showBaseStats()" onkeydown="handleTabKeydown(event)">Base Stats</button>
            <button type="button" class="tab moves" id="moves-tab" role="tab" aria-controls="move-contents" aria-selected="false" tabindex="-1" onclick="showMoves()" onkeydown="handleTabKeydown(event)">Moves</button>
        </div>

        <div class="tab-contents" id="tab-contents">
            <div id="about-contents" class="tab-content" role="tabpanel" aria-labelledby="about-tab" tabindex="0">
                <p><b>Height:</b> <span id="height" style="margin-left:5px;"></span></p>
                <p><b>Weight:</b> <span id="weight" style="margin-left:5px;"></span></p>
                <p><b>Abilities:</b></p>
                <ul id="abilities"></ul>
            </div>

            <div id="base-contents" class="tab-content d-none" role="tabpanel" aria-labelledby="base-stats-tab" tabindex="0">
                <canvas id="base-stats-chart"></canvas>
                <p id="chart-error" class="d-none" role="status">Basiswerte konnten nicht geladen werden. Bitte prüfe deine Internetverbindung und versuche es erneut.</p>
            </div>

            <div id="move-contents" class="tab-content d-none" role="tabpanel" aria-labelledby="moves-tab" tabindex="0">
                <ul id="moves-list"></ul>
            </div>
        </div>
    </div>
    `;
}
