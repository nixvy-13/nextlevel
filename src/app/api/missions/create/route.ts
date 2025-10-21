import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { Database } from "@/lib/db";
import type { Env } from "@/lib/types";
import type { CreateMissionsRequest } from "@/lib/api-types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateMissionsRequest;
    const { missions } = body;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!Array.isArray(missions) || missions.length === 0) {
      return NextResponse.json(
        { error: "Invalid missions array" },
        { status: 400 }
      );
    }

    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);
    const now = new Date().toISOString();

    const statements = missions.map((mission) => {
      const missionId = `mission_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        sql: `INSERT INTO missions (id, user_id, title, description, xp_reward, completed, difficulty, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`,
        bindings: [
          missionId,
          userId,
          mission.title,
          mission.description || "",
          mission.xpReward || 10,
          mission.difficulty || "medium",
          now,
          now,
        ],
      };
    });

    await db.batch(statements);

    return NextResponse.json(
      { message: "Missions created", count: missions.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/missions/create error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
