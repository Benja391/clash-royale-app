export async function handler(event, context) {
  try {
    const response = await fetch("https://api.clashroyale.com/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API error", status: response.status }),
      };
    }

    const data = await response.json();

    // La API devuelve { items: [...] }
    return {
      statusCode: 200,
      body: JSON.stringify(data.items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
}
