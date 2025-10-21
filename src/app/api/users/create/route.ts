import { NextRequest, NextResponse } from "next/server";
import { setSessionUserId } from "@/lib/session";
import { Database } from "@/lib/db";
import type { User, Env } from "@/lib/types";
import type { CreateUserRequest } from "@/lib/api-types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateUserRequest;
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);

    // Verificar si el email ya existe
    const existingUser = await db.queryOne<{ id: string }>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO users (id, name, email, level, current_xp, total_xp, xp_per_level, is_public, created_at, updated_at)
       VALUES (?, ?, ?, 1, 0, 0, 100, 1, ?, ?)`,
      [userId, name, email, now, now]
    );

    // Establecer sesión
    await setSessionUserId(userId);

    const newUser = await db.queryOne<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users/create error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
