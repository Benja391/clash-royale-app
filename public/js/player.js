document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tagInput = document.getElementById('playerTag');
    const resultBox = document.getElementById('result');
    if (!tagInput || !resultBox) return;

    const tag = tagInput.value.trim();
    resultBox.innerHTML = 'Caragando datos..';

    if (!tag || tag.length < 3 || tag.length > 10 || /[^A-Z0-9]/i.test(tag)) {
      resultBox.innerHTML = `<p class="error">Tag inválido. Usá entre 3 y 10 caracteres alfanuméricos.</p>`;
      return;
    }

    try {
      const res = await fetch(`/api/player/${encodeURIComponent(tag)}`);
      const data = await res.json();

      if (data.error) {
        resultBox.innerHTML = `<p class="error">Error: ${data.error}</p>`;
      } else {
        const cardImage = `https://royaleapi.com/static/img/cards/${data.favoriteCard.toLowerCase().replace(/ /g, '-')}.png`;

        resultBox.innerHTML = `
          <div class="card">
            <h2>${data.name} <span>#${data.tag}</span></h2>
            <p><strong>Nivel:</strong> ${data.expLevel}</p>
            <p><strong>Trofeos:</strong> ${data.trophies}</p>
            <p><strong>Clan:</strong> ${data.clan}</p>
            <p><strong>Arena:</strong> ${data.arena}</p>
            <p><strong>Victorias:</strong> ${data.wins}</p>
            <p><strong>Carta favorita:</strong> ${data.favoriteCard}</p>
            <img src="${cardImage}" alt="${data.favoriteCard}" class="card-img">
          </div>
        `;
      }

      const battleRes = await fetch(`/api/player/${tag}/battlelog`);
      const battles = await battleRes.json();

      if (!battles.error && Array.isArray(battles)) {
        const battleHTML = battles.length > 0
          ? battles.map(battle => {
              const opponent = battle.opponent?.[0]?.name || 'Desconocido';
              const type = battle.battleType || battle.type || 'Desconocido';
              const teamCrowns = battle.team?.[0]?.crowns ?? 0;
              const opponentCrowns = battle.opponent?.[0]?.crowns ?? 0;
              const result = teamCrowns > opponentCrowns ? 'Ganada' : teamCrowns < opponentCrowns ? 'Perdida' : 'Empate';
              const date = new Date(battle.battleTime).toLocaleString('es-AR');

              return `<li><strong>${type}</strong> contra <em>${opponent}</em> — ${result}<br><small>${date}</small></li>`;
            }).join('')
          : `<p>No hay batallas recientes disponibles para este jugador.</p>`;

        resultBox.innerHTML += `
          <div class="battlelog">
            <h3>Últimas batallas</h3>
            <ul>${battleHTML}</ul>
          </div>
        `;
      }

    } catch (err) {
      console.error('Error en el frontend:', err);
      resultBox.innerHTML = `<p class="error">Error al conectar con el servidor</p>`;
    }
  });
});
