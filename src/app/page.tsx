"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black pt-16 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Mis misiones</h1>
          <div className="flex items-center gap-3">
            <Button 
              className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 rounded-sm px-6 py-2 font-semibold transition-all"
            >
              Iniciar Sesión
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-6 py-2 font-semibold transition-all shadow-lg shadow-purple-500/50"
            >
              Registrarse
            </Button>
          </div>
        </div>

        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 h-12 bg-transparent gap-3 p-0">
            <TabsTrigger 
              value="lista" 
              className="bg-gray-900 border-2 border-purple-500 text-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:border-purple-400 data-[state=active]:text-white rounded-sm hover:bg-purple-900 hover:border-purple-400 transition-all font-semibold shadow-lg shadow-purple-500/20"
            >
              Lista
            </TabsTrigger>
            <TabsTrigger 
              value="calendario" 
              className="bg-gray-900 border-2 border-gray-700 text-gray-400 data-[state=active]:bg-gray-800 data-[state=active]:border-gray-600 data-[state=active]:text-white rounded-sm hover:bg-gray-800 hover:border-gray-600 transition-all font-semibold"
            >
              Calendario
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              className="bg-gray-900 border-2 border-gray-700 text-gray-400 data-[state=active]:bg-purple-600 data-[state=active]:border-purple-400 data-[state=active]:text-white rounded-sm hover:bg-gray-800 hover:border-gray-600 transition-all font-semibold"
            >
              Kanban board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4">
            {/* Tarjeta de misión ejemplo */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 shadow-xl shadow-purple-500/20 rounded-sm overflow-hidden hover:border-purple-400 transition-all">
              <CardHeader className="pb-3 border-b border-purple-500/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-purple-400 text-lg font-bold">Tipo - Título - Xp</CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      Descripción de la misión
                    </CardDescription>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <ChevronDown className="w-6 h-6" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 hover:border-green-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-green-500/30"
                  >
                    Completar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 hover:border-blue-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-blue-500/30"
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 hover:border-red-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-red-500/30"
                  >
                    Borrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Botón para crear misión */}
            <div className="flex justify-center pt-6">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-12 py-6 text-lg font-bold shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all"
              >
                Crear Misión
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendario" className="mt-8">
            <div className="text-center py-16 bg-gray-900 border-2 border-gray-700 rounded-sm">
              <p className="text-lg text-gray-400 font-semibold">Vista de Calendario - Próximamente</p>
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Columna: Por hacer */}
              <div className="flex flex-col min-h-[700px]">
                <div className="bg-red-900/30 border-2 border-red-800/50 rounded-sm p-6 flex-1">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
                    Por hacer
                  </h3>
                  {/* Espacio para tarjetas de misión */}
                </div>
              </div>

              {/* Columna: En progreso */}
              <div className="flex flex-col min-h-[700px]">
                <div className="bg-yellow-900/30 border-2 border-yellow-700/50 rounded-sm p-6 flex-1">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
                    En progreso
                  </h3>
                  {/* Espacio para tarjetas de misión */}
                </div>
              </div>

              {/* Columna: Hechas */}
              <div className="flex flex-col min-h-[700px]">
                <div className="bg-green-900/30 border-2 border-green-800/50 rounded-sm p-6 flex-1">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
                    Hechas
                  </h3>
                  {/* Espacio para tarjetas de misión */}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
