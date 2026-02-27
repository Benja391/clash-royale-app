import './player.js';
import { showCards } from './cards.js';
import { showDeck } from './deck.js';
import { showCardDetails } from './modal.js';
import './auth.js';
import './theme.js';

window.addEventListener('DOMContentLoaded', () => {
  showCards(); // ✅ carga las cartas automáticamente al abrir la app
  showDeck(); // ✅ muestra el mazo guardado al abrir la app
  showCardDetails(); // ✅ prepara el modal para mostrar detalles de cartas al hacer clic
});
