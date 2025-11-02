"use client"

import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, string> = {
  "/": "Mis misiones",
  "/perfil": "Mi perfil",
  "/store": "Misiones disponibles",
};

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const pageTitle = PAGE_TITLES[pathname] || "NextLevel";

  return (
    <div className="px-4 md:px-8 h-full flex items-center">
      <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-white absolute left-1/2 -translate-x-1/2">{pageTitle}</h1>
        
        <div className="flex items-center gap-3 ml-auto">
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 rounded-sm px-6 py-2 font-semibold transition-all"
              >
                Iniciar Sesión
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-6 py-2 font-semibold transition-all shadow-lg shadow-purple-500/50"
              >
                Registrarse
              </Button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <span className="text-purple-400 font-semibold hidden md:inline">
              {user?.username || "Usuario"}
            </span>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-purple-400 shadow-lg shadow-purple-500/50 rounded-sm",
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

