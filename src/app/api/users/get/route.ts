import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { Database } from "@/lib/db";
import type { User, Env } from "@/lib/types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedUserId = searchParams.get("userId");
    const currentUserId = await getSessionUserId();

    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);

    let userId: string | null;

    if (requestedUserId) {
      userId = requestedUserId;
    } else {
      userId = currentUserId;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.queryOne<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Si es información pública, filtrar datos sensibles
    if (requestedUserId && requestedUserId !== currentUserId) {
      const { email, ...publicData } = user;
      return NextResponse.json(publicData);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/get error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
