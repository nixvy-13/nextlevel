import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { Database } from "@/lib/db";
import type { User, Env } from "@/lib/types";
import type { ModifyUserRequest } from "@/lib/api-types";

export const runtime = "edge";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as ModifyUserRequest;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const env = request as unknown as { env: Env };
    const db = new Database(env.env.DB);

    const user = await db.queryOne<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Campos permitidos para actualizar
    const allowedFields = ["name", "profile_image", "is_public"] as const;
    const updates: Record<string, string> = {};
    const values: any[] = [];

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = "?";
        values.push(body[field]);
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(user);
    }

    const now = new Date().toISOString();
    updates["updated_at"] = "?";
    values.push(now);
    values.push(userId);

    const setClause = Object.entries(updates)
      .map(([key, placeholder]) => `${key} = ${placeholder}`)
      .join(", ");

    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;

    await db.execute(sql, values);

    const updatedUser = await db.queryOne<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/users/modify error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
