"use client"

import { Button } from "@/components/ui/button";
import { MissionCard } from "@/components/mission-card";

export default function StorePage() {
  // Categorías de misiones
  const categories = [
    { name: "Salud", color: "bg-blue-600 hover:bg-blue-700 border-blue-500" },
    { name: "Entretenimiento", color: "bg-red-600 hover:bg-red-700 border-red-500" },
    { name: "Sociales", color: "bg-yellow-600 hover:bg-yellow-700 border-yellow-500" },
    { name: "Naturaleza", color: "bg-green-600 hover:bg-green-700 border-green-500" },
    { name: "Variadas", color: "bg-purple-600 hover:bg-purple-700 border-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Filtros de Categorías */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
          {categories.map((category) => (
            <Button
              key={category.name}
              className={`${category.color} text-white border-2 rounded-sm px-8 py-3 font-bold text-base shadow-lg hover:shadow-xl transition-all`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Tarjeta de Misión Disponible */}
        <div className="space-y-4 mb-8">
          <MissionCard 
            type="Tipo"
            title="Título"
            xp={0}
            description="Descripción de la misión"
            variant="store"
          />
        </div>
      </div>
    </div>
  );
}

