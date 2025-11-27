export default {
  async scheduled(event, env, ctx) {
    // ⚠️ CAMBIAR ESTO: Pon aquí tu dominio real de producción (ej: https://nextlevel.vercel.app)
    const DOMAIN = "https://tu-dominio-real.com"; 
    const API_URL = `${DOMAIN}/api/tasks/regenerateRecurrent`;

    console.log("⏰ Cron disparado: Llamando a regenerar misiones...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Esta variable se configura con: npx wrangler secret put API_SECRET_KEY
          "x-cron-secret": env.API_SECRET_KEY,
        },
      });

      console.log(`Respuesta: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error("Error al ejecutar el cron:", error);
    }
  },
};

