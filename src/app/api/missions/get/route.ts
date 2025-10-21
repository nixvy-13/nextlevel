import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { Database } from "@/lib/db";
import type { Mission, Env } from "@/lib/types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);

    if (taskId) {
      const mission = await db.queryOne<Mission>(
        "SELECT * FROM missions WHERE id = ? AND user_id = ?",
        [taskId, userId]
      );

      if (!mission) {
        return NextResponse.json(
          { error: "Mission not found" },
          { status: 404 }
        );
      }

      return NextResponse.json([mission]);
    }

    const missions = await db.query<Mission>(
      "SELECT * FROM missions WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return NextResponse.json(missions);
  } catch (error) {
    console.error("GET /api/missions/get error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
