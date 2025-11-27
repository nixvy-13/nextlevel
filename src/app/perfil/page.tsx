"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { MissionsChart } from "@/components/missions-chart";

export default function PerfilPage() {
  const { user } = useUser();
  const [level, setLevel] = useState(1);
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
                <Image 
                  src={user.imageUrl} 
                  alt={`Foto de perfil de ${user.username || 'Usuario'}`}
                  fill
                  className="object-cover"
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

          {/* CUADRANTE SUPERIOR DERECHO - Gráfica de Misiones Completadas (3/4) */}
          <div className="flex flex-col lg:col-span-3">
            <MissionsChart />
          </div>
        </div>
      </div>
    </div>
  );
}

