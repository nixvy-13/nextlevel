"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, User } from "lucide-react";

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
    <div className="min-h-screen bg-black pt-16 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Misiones disponibles</h1>
          <div className="flex items-center gap-3">
            <span className="text-purple-400 font-semibold">100 Xp</span>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-sm flex items-center justify-center border-2 border-purple-400 shadow-lg shadow-purple-500/50">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

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
          <Card className="bg-purple-600/80 border-2 border-purple-500 shadow-xl shadow-purple-500/20 rounded-sm overflow-hidden hover:border-purple-400 transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg font-bold mb-2">Tipo - Título - Xp</CardTitle>
                  <CardDescription className="text-white/80">
                    Descripción de la misión
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white border-2 border-yellow-500 hover:border-yellow-400 rounded-sm px-6 py-2 font-bold shadow-lg shadow-yellow-500/50 transition-all"
                  >
                    Añadir
                  </Button>
                  <button className="text-white hover:text-purple-200 transition-colors">
                    <ChevronDown className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

