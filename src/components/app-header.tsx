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
    <div className="h-full w-full flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 pr-4 md:pr-8">
      {/* Botones de sesión - Móvil: arriba, Desktop: derecha */}
      <div className="flex items-center gap-2 order-1 md:order-2 flex-shrink-0">
        <SignedOut>
          <SignInButton mode="modal">
            <Button 
              className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 rounded-sm px-2.5 md:px-6 py-1 md:py-2 text-xs md:text-base font-semibold transition-all whitespace-nowrap"
            >
              Iniciar Sesión
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-2.5 md:px-6 py-1 md:py-2 text-xs md:text-base font-semibold transition-all shadow-lg shadow-purple-500/50 whitespace-nowrap"
            >
              Registrarse
            </Button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <span className="text-purple-400 font-semibold hidden md:inline text-sm md:text-base">
            {user?.username || "Usuario"}
          </span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 md:w-10 md:h-10 border-2 border-purple-400 shadow-lg shadow-purple-500/50 rounded-sm",
              }
            }}
          />
        </SignedIn>
      </div>

      {/* Título centrado - Solo visible cuando hay sesión iniciada */}
      <SignedIn>
        <div className="flex-1 text-center order-2 md:order-1">
          <h1 className="text-lg md:text-4xl font-bold text-white">{pageTitle}</h1>
        </div>
      </SignedIn>

      {/* Espaciador invisible para desktop para equilibrar el layout */}
      <SignedIn>
        <div className="hidden md:block w-32"></div>
      </SignedIn>
    </div>
  );
}

