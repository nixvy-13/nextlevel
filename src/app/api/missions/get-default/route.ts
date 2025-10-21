import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import type { DefaultMission, Env } from "@/lib/types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);

    const missions = await db.query<DefaultMission>(
      "SELECT * FROM default_missions ORDER BY difficulty"
    );

    return NextResponse.json(missions);
  } catch (error) {
    console.error("GET /api/missions/get-default error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
