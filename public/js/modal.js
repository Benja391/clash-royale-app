import { inferCardType, rarityMap } from './cards.js';

async function showCardDetails(name) {
  if (!name || name === 'null') return;

  try {
    const res = await fetch(`/api/card/${encodeURIComponent(name)}`);
    const card = await res.json();
    if (card.error) return;

    const safeName = name.toLowerCase().replace(/[\s\.']/g, '-').replace(/[^a-z0-9\-]/g, '');
    const imgUrl = card.iconUrls?.medium || `https://royaleapi.com/static/img/cards/${safeName}.png`;
    const tipo = inferCardType(card.name);
    const rarezaTraducida = rarityMap[card.rarity?.toLowerCase()] || card.rarity;

    const modal = document.createElement('div');
    modal.id = 'cardModal';
    modal.classList.add('modal-overlay');
    modal.innerHTML = `
      <div class="modal-inner">
        <button class="back-button">←</button>
        <h2>${card.name}</h2>
        <img src="${imgUrl}" alt="${card.name}">
        <p><strong>Rareza:</strong> ${rarezaTraducida}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        ${card.elixirCost !== undefined ? `<p><strong>Coste de elixir:</strong> ${card.elixirCost}</p>` : ''}
        ${card.maxLevel !== undefined ? `<p><strong>Nivel máximo:</strong> ${card.maxLevel}</p>` : ''}
        <p class="note">
          Las estadísticas mostradas son limitadas.<br>
          Para ver más detalles, visitá 
          <a href="https://royaleapi.com/cards" target="_blank" rel="noopener noreferrer">
            RoyaleAPI
          </a> y buscá la carta manualmente.
        </p>
      </div>
    `;
    document.body.appendChild(modal);

    // Cerrar con flechita
    modal.querySelector('.back-button').addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del modal-inner
    modal.addEventListener('click', (e) => {
      if (!e.target.closest('.modal-inner')) closeModal();
    });

  } catch (err) {
    console.error('Error al cargar detalles de la carta:', err);
  }
}

function closeModal() {
  const modal = document.getElementById('cardModal');
  if (modal) modal.remove();
}




export { showCardDetails };
