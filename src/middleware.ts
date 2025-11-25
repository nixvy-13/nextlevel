import { clerkMiddleware } from '@clerk/nextjs/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextFetchEvent } from "next/server";

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    const { env } = await getCloudflareContext();
    const cfEnv = env as unknown as Record<string, string>;
    if (cfEnv) {
      if (cfEnv.CLERK_SECRET_KEY) {
        process.env.CLERK_SECRET_KEY = cfEnv.CLERK_SECRET_KEY;
      }
      if (cfEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = cfEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      }
    }
  } catch (error) {
    // Ignorar error si no estamos en Cloudflare o falla el contexto
    console.error("Failed to load Cloudflare env:", error);
  }

  return clerkMiddleware()(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Excluye el webhook de clerk de la autenticación
    '/((?!api/webhooks/clerk|api/debug-env).*)',
  ],
};
