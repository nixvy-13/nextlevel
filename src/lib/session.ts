import { cookies } from "next/headers";

export async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("userId")?.value;
    return sessionId || null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function setSessionUserId(userId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });
  } catch (error) {
    console.error("Error setting session:", error);
    throw error;
  }
}

export async function clearSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("userId");
  } catch (error) {
    console.error("Error clearing session:", error);
    throw error;
  }
}
