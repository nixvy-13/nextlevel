/**
 * Calcula los puntos XP necesarios para alcanzar un nivel específico
 * Usa una fórmula progresiva: 100 * nivel^1.5
 * Esto hace que cada nivel cuesta más que el anterior
 */
export function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.3));
}

/**
 * Calcula el XP acumulado total necesario para alcanzar un nivel
 * Por ejemplo: para alcanzar nivel 5, suma XP de todos los niveles anteriores
 */
export function calculateTotalXpForLevel(level: number): number {
  let totalXp = 0;
  for (let i = 2; i <= level; i++) {
    totalXp += calculateXpForLevel(i);
  }
  return totalXp;
}

/**
 * Calcula el nivel actual basado en la experiencia total
 * Retorna { currentLevel, currentLevelXp, nextLevelXp, progressPercentage }
 */
export function calculateLevelFromXp(totalXp: number): {
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercentage: number;
} {
  let level = 1;
  let accumulatedXp = 0;

  // Encontrar el nivel actual
  while (true) {
    const nextLevelXpRequired = calculateTotalXpForLevel(level + 1);
    if (totalXp < nextLevelXpRequired) {
      break;
    }
    level++;
  }

  // XP requerido para el nivel actual
  const currentLevelXpRequired = calculateTotalXpForLevel(level);
  const nextLevelXpRequired = calculateTotalXpForLevel(level + 1);

  // XP dentro del nivel actual
  const xpInCurrentLevel = totalXp - currentLevelXpRequired;
  const xpNeededForNextLevel = nextLevelXpRequired - currentLevelXpRequired;
  const progressPercentage = Math.round(
    (xpInCurrentLevel / xpNeededForNextLevel) * 100
  );

  return {
    currentLevel: level,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeededForNextLevel,
    progressPercentage,
  };
}

/**
 * Procesa la ganancia de XP y calcula si el usuario sube de nivel
 * Retorna { newTotalXp, leveledUp, newLevel, oldLevel }
 */
export function processXpGain(
  currentTotalXp: number,
  xpGained: number
): {
  newTotalXp: number;
  leveledUp: boolean;
  newLevel: number;
  oldLevel: number;
} {
  const oldLevelInfo = calculateLevelFromXp(currentTotalXp);
  const newTotalXp = currentTotalXp + xpGained;
  const newLevelInfo = calculateLevelFromXp(newTotalXp);

  return {
    newTotalXp,
    leveledUp: newLevelInfo.currentLevel > oldLevelInfo.currentLevel,
    newLevel: newLevelInfo.currentLevel,
    oldLevel: oldLevelInfo.currentLevel,
  };
}

