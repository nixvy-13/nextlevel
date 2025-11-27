export default {
  async scheduled(event, env, ctx) {
    const DOMAIN = "https://nextlevel.nixvy.ninja"; 
    const API_URL = `${DOMAIN}/api/tasks/regenerateRecurrent`;

    console.log("Cron activado: Llamando al endpoint...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": env.API_SECRET_KEY,
        },
      });

      console.log(`Respuesta: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error("Error al ejecutar el cron:", error);
    }
  },
};