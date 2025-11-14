const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/api/player/:tag', async (req, res) => {
  const tag = req.params.tag;
  try {
    const response = await fetch(`https://api.clashroyale.com/v1/players/%23${tag}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'No se pudo obtener el jugador' });
    }

    const data = await response.json();
    res.json({
      name: data.name,
      tag: data.tag,
      expLevel: data.expLevel,
      trophies: data.trophies,
      clan: data.clan?.name || 'Sin clan',
      arena: data.arena?.name || 'Desconocida',
      wins: data.wins,
      favoriteCard: data.currentFavouriteCard?.name || 'No definida'
    });
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/player/:tag/battlelog', async (req, res) => {
  const tag = req.params.tag;
  try {
    const response = await fetch(`https://api.clashroyale.com/v1/players/%23${tag}/battlelog`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'No se pudo obtener el historial de batallas' });
    }

    const data = await response.json();
    res.json(data.slice(0, 5)); // Solo las últimas 5 batallas
  } catch (error) {
    console.error('Error en battlelog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/cards', async (req, res) => {
  try {
    const response = await fetch('https://api.clashroyale.com/v1/cards', {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'No se pudo obtener las cartas' });
    }

    const data = await response.json();
    res.json(data.items); // devuelve solo el array de cartas
  } catch (error) {
    console.error('Error en la API de cartas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/card/:name', async (req, res) => {
  const cardName = req.params.name;
  try {
    const response = await fetch(`https://api.clashroyale.com/v1/cards`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`
      }
    });

    const data = await response.json();
    const card = data.items.find(c => c.name.toLowerCase() === cardName.toLowerCase());

    if (!card) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }

    res.json(card);
  } catch (err) {
    console.error('Error al obtener carta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});





