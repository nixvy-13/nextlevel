"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function PerfilPage() {
  const { user } = useUser();
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [currentLevelXp, setCurrentLevelXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [lvResponse, xpResponse] = await Promise.all([
          fetch('/api/users/getLv'),
          fetch('/api/users/getXp')
        ]);

        if (lvResponse.ok) {
          const lvData = await lvResponse.json() as { level: number };
          setLevel(lvData.level);
        }

        if (xpResponse.ok) {
          const xpData = await xpResponse.json() as {
            experience: number;
            currentLevelXp: number;
            nextLevelXp: number;
            progressPercentage: number;
          };
          setExperience(xpData.experience);
          setCurrentLevelXp(xpData.currentLevelXp);
          setNextLevelXp(xpData.nextLevelXp);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Sección Superior - Info (1/4) y Gráfica (3/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* CUADRANTE SUPERIOR IZQUIERDO - Info Personal y Avatar (1/4) */}
          <div className="flex flex-col lg:col-span-1">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Nombre
            </h2>
            <p className="text-white text-lg font-medium mb-6">
              {user?.username}
            </p>

            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Nivel
            </h2>
            <p className="text-white text-lg font-medium mb-6">
              {loading ? 'Cargando...' : `Nivel ${level}`}
            </p>

            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Experiencia
            </h2>
            <p className="text-white text-lg font-medium mb-6">
              {loading ? 'Cargando...' : `${currentLevelXp} / ${nextLevelXp} XP`}
            </p>

            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Foto de Perfil
            </h2>
            <div className="relative w-full aspect-square bg-gray-900 border-2 border-gray-700 rounded-sm overflow-hidden group hover:border-purple-500 transition-all">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={`Foto de perfil de ${user.username || 'Usuario'}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-4xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CUADRANTE SUPERIOR DERECHO - Gráfica de Barras (3/4) */}
          <div className="flex flex-col lg:col-span-3">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Gráfica de barras
            </h2>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-700 rounded-sm overflow-hidden flex-1">
              <CardContent className="p-0 h-full">
                {/* Caja vacía sin contenido */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección Inferior - Misiones y Logros (2 columnas iguales) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CUADRANTE INFERIOR IZQUIERDO - Misiones a destacar */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Misiones a destacar
            </h2>
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((item) => (
                <Card 
                  key={item}
                  className="bg-gradient-to-r from-gray-900 to-gray-950 border-2 border-gray-700 rounded-sm hover:border-purple-500/50 transition-all shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-purple-400 font-bold mb-1">Misión Destacada {item}</h3>
                        <p className="text-gray-500 text-sm">Descripción de la misión</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-bold">50 XP</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CUADRANTE INFERIOR DERECHO - Logros destacados */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
              Logros destacados
            </h2>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-700 rounded-sm p-6 flex-1">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6 w-full">
                  {[1, 2, 3, 4, 5, 6].map((badge) => (
                    <div 
                      key={badge}
                      className="aspect-square bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center hover:border-purple-500 hover:bg-purple-900/20 transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-600 group-hover:text-purple-400 transition-colors mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

