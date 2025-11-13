import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verificando datos del seeding...\n");

  // Contar todas las misiones por defecto
  const totalDefaultMissions = await prisma.task.count({
    where: {
      isDefault: true,
      userId: "monokrome",
    },
  });

  console.log(`📋 Total de misiones por defecto: ${totalDefaultMissions}\n`);

  // Contar misiones por categoría
  const categories = ["SALUD", "ENTRETENIMIENTO", "SOCIALES", "NATURALEZA", "VARIADAS"];
  
  console.log("📊 Misiones por categoría:");
  for (const category of categories) {
    const count = await prisma.task.count({
      where: {
        category: category as any,
        isDefault: true,
        userId: "monokrome",
      },
    });
    console.log(`   ${category}: ${count} misiones`);
  }

  // Contar por tipo
  const onceCount = await prisma.task.count({
    where: {
      type: "ONCE",
      isDefault: true,
      userId: "monokrome",
    },
  });

  const recurrentCount = await prisma.task.count({
    where: {
      type: "RECURRENT",
      isDefault: true,
      userId: "monokrome",
    },
  });

  console.log(`\n🎯 Misiones por tipo:`);
  console.log(`   ONCE: ${onceCount} misiones`);
  console.log(`   RECURRENT: ${recurrentCount} misiones`);

  // Mostrar algunos detalles
  console.log("\n📝 Primeras 5 misiones:");
  const firstMissions = await prisma.task.findMany({
    where: {
      isDefault: true,
      userId: "monokrome",
    },
    take: 5,
  });

  firstMissions.forEach((mission) => {
    console.log(
      `   - ${mission.title} (${mission.category}) | XP: ${mission.experienceReward} | Tipo: ${mission.type}`
    );
  });

  console.log("\n✨ Verificación completada!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

