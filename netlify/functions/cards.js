import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const response = await fetch("https://api.clashroyale.com/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
      },
    });

    const data = await response.json();

    // 🧪 Debug para ver qué devuelve realmente
    console.log("API RAW RESPONSE:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data), // devolvemos TODO
    };
  } catch (error) {
    console.log("ERROR API:", error);
    return {
      statusCode: 500,
      body: "ERROR: " + error.toString(),
    };
  }
}
