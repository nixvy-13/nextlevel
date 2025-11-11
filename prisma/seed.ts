import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "monokrome";

  const defaultMissions = [
    // SALUD
    {
      title: "Caminar 30 minutos",
      description: "Haz una caminata de 30 minutos para mejorar tu salud cardiovascular",
      category: "SALUD",
      type: "RECURRENT",
      difficulty: 2,
      experienceReward: 25,
      recurrency: 7,
    },
    {
      title: "Beber 8 vasos de agua",
      description: "Mantente hidratado consumiendo 8 vasos de agua durante el día",
      category: "SALUD",
      type: "RECURRENT",
      difficulty: 1,
      experienceReward: 15,
      recurrency: 1,
    },
    {
      title: "Meditar 10 minutos",
      description: "Dedica 10 minutos a meditar para reducir estrés y mejorar tu bienestar mental",
      category: "SALUD",
      type: "RECURRENT",
      difficulty: 2,
      experienceReward: 20,
      recurrency: 1,
    },
    {
      title: "Hacer 50 flexiones",
      description: "Realiza 50 flexiones para fortalecer tu cuerpo",
      category: "SALUD",
      type: "ONCE",
      difficulty: 3,
      experienceReward: 40,
    },

    // ENTRETENIMIENTO
    {
      title: "Ver una película completa",
      description: "Disfruta viendo una película de inicio a fin",
      category: "ENTRETENIMIENTO",
      type: "ONCE",
      difficulty: 1,
      experienceReward: 20,
    },
    {
      title: "Jugar videojuegos 1 hora",
      description: "Tómate una hora para disfrutar de tus videojuegos favoritos",
      category: "ENTRETENIMIENTO",
      type: "RECURRENT",
      difficulty: 1,
      experienceReward: 15,
      recurrency: 3,
    },
    {
      title: "Leer un capítulo de un libro",
      description: "Lee al menos un capítulo de cualquier libro que te interese",
      category: "ENTRETENIMIENTO",
      type: "RECURRENT",
      difficulty: 2,
      experienceReward: 25,
      recurrency: 2,
    },
    {
      title: "Dibujar o pintar",
      description: "Crea una obra de arte, ya sea dibujo o pintura",
      category: "ENTRETENIMIENTO",
      type: "ONCE",
      difficulty: 2,
      experienceReward: 30,
    },

    // SOCIALES
    {
      title: "Llamar a un amigo",
      description: "Contacta a un amigo y pasen tiempo juntos hablando",
      category: "SOCIALES",
      type: "RECURRENT",
      difficulty: 1,
      experienceReward: 20,
      recurrency: 7,
    },
    {
      title: "Salir con amigos",
      description: "Pasa tiempo de calidad con tus amigos",
      category: "SOCIALES",
      type: "RECURRENT",
      difficulty: 2,
      experienceReward: 35,
      recurrency: 14,
    },
    {
      title: "Ayudar a un vecino",
      description: "Brinda ayuda a alguien de tu comunidad",
      category: "SOCIALES",
      type: "ONCE",
      difficulty: 2,
      experienceReward: 30,
    },
    {
      title: "Hacer una llamada familiar",
      description: "Contacta a tu familia y crea momentos significativos",
      category: "SOCIALES",
      type: "RECURRENT",
      difficulty: 1,
      experienceReward: 25,
      recurrency: 7,
    },

    // NATURALEZA
    {
      title: "Plantar una semilla",
      description: "Planta una semilla en una maceta o en el jardín",
      category: "NATURALEZA",
      type: "ONCE",
      difficulty: 1,
      experienceReward: 25,
    },
    {
      title: "Salida al parque",
      description: "Visita un parque y disfruta del aire libre",
      category: "NATURALEZA",
      type: "RECURRENT",
      difficulty: 1,
      experienceReward: 20,
      recurrency: 7,
    },
    {
      title: "Limpiar un área verde",
      description: "Recolecta basura en un parque o área natural cercana",
      category: "NATURALEZA",
      type: "ONCE",
      difficulty: 2,
      experienceReward: 35,
    },
    {
      title: "Observar aves",
      description: "Dedica tiempo a observar y contar las aves que ves en la naturaleza",
      category: "NATURALEZA",
      type: "RECURRENT",
      difficulty: 2,
      experienceReward: 20,
      recurrency: 7,
    },

    // VARIADAS
    {
      title: "Aprender algo nuevo",
      description: "Dedica tiempo a aprender un nuevo skill o habilidad",
      category: "VARIADAS",
      type: "ONCE",
      difficulty: 3,
      experienceReward: 50,
    },
    {
      title: "Cocinar una nueva receta",
      description: "Prepara una receta que nunca hayas hecho antes",
      category: "VARIADAS",
      type: "ONCE",
      difficulty: 2,
      experienceReward: 30,
    },
    {
      title: "Resolver un puzzle o acertijo",
      description: "Completa un puzzle o resuelve un acertijo desafiante",
      category: "VARIADAS",
      type: "ONCE",
      difficulty: 2,
      experienceReward: 25,
    },
    {
      title: "Organizar tu espacio",
      description: "Ordena y organiza un área de tu casa",
      category: "VARIADAS",
      type: "RECURRENT",
      difficulty: 1,
      experienceReward: 15,
      recurrency: 7,
    },
  ];

  console.log("🌱 Iniciando seeder de misiones por defecto...");

  for (const mission of defaultMissions) {
    try {
      await prisma.task.create({
        data: {
          userId,
          title: mission.title,
          description: mission.description,
          category: mission.category as any,
          type: mission.type as any,
          status: "ACTIVE",
          difficulty: mission.difficulty,
          experienceReward: mission.experienceReward,
          recurrency: mission.recurrency || null,
          isDefault: true,
        },
      });
      console.log(`✅ Misión creada: ${mission.title}`);
    } catch (error) {
      console.error(`❌ Error al crear misión: ${mission.title}`, error);
    }
  }

  console.log("✨ Seeder completado!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

