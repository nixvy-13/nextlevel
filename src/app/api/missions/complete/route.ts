import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { Database } from "@/lib/db";
import type { Mission, User, Env } from "@/lib/types";
import type { CompleteMissionRequest } from "@/lib/api-types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CompleteMissionRequest;
    const { missionId } = body;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!missionId) {
      return NextResponse.json(
        { error: "Mission ID is required" },
        { status: 400 }
      );
    }

    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);

    // Obtener misión
    const mission = await db.queryOne<Mission>(
      "SELECT * FROM missions WHERE id = ? AND user_id = ?",
      [missionId, userId]
    );

    if (!mission) {
      return NextResponse.json(
        { error: "Mission not found" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const completedAt = now.split("T")[0];

    // Actualizar misión
    await db.execute(
      "UPDATE missions SET completed = 1, completed_at = ?, updated_at = ? WHERE id = ?",
      [completedAt, now, missionId]
    );

    // Obtener usuario y actualizar XP
    const user = await db.queryOne<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (user) {
      let newXp = user.current_xp + mission.xp_reward;
      let newLevel = user.level;

      // Verificar level up
      while (newXp >= user.xp_per_level) {
        newXp -= user.xp_per_level;
        newLevel += 1;
      }

      const newTotalXp = user.total_xp + mission.xp_reward;

      await db.execute(
        "UPDATE users SET current_xp = ?, total_xp = ?, level = ?, updated_at = ? WHERE id = ?",
        [newXp, newTotalXp, newLevel, now, userId]
      );

      return NextResponse.json({
        message: "Mission completed",
        xpGained: mission.xp_reward,
        newLevel,
        newXp,
        totalXp: newTotalXp,
      });
    }

    return NextResponse.json({ message: "Mission completed" });
  } catch (error) {
    console.error("POST /api/missions/complete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
