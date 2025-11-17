import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const response = await fetch("https://api.clashroyale.com/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
      },
    });

    // Si la API falla
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Error obteniendo las cartas" }),
      };
    }

    const data = await response.json();

    // Algunos endpoints devuelven objetos {items: []}
    const cards = data.items || data;

    return {
      statusCode: 200,
      body: JSON.stringify(cards),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error interno en Netlify Function",
        details: error.message,
      }),
    };
  }
}
