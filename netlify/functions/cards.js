import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const response = await fetch("https://api.clashroyale.com/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error al obtener cartas: " + error.toString(),
    };
  }
}
