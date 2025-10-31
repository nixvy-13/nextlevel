"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface MissionCardProps {
  type?: string;
  title?: string;
  xp?: number;
  description?: string;
  variant?: "default" | "store";
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  showActions?: boolean;
}

export function MissionCard({
  type = "Tipo",
  title = "Título",
  xp = 0,
  description = "Descripción de la misión",
  variant = "default",
  onComplete,
  onEdit,
  onDelete,
  onAdd,
  showActions = true,
}: MissionCardProps) {
  const isStore = variant === "store";
  
  return (
    <Card className={`${isStore ? 'bg-purple-600/80' : 'bg-gradient-to-br from-gray-900 to-gray-950'} border-2 border-purple-500${isStore ? '' : '/50'} shadow-xl shadow-purple-500/20 rounded-sm overflow-hidden hover:border-purple-400 transition-all`}>
      <CardHeader className={`pb-3 ${!isStore && 'border-b border-purple-500/30'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={`${isStore ? 'text-white' : 'text-purple-400'} text-lg font-bold ${isStore && 'mb-2'}`}>
              {type} - {title} - {xp} Xp
            </CardTitle>
            <CardDescription className={`${isStore ? 'text-white/80' : 'text-gray-400'} mt-2`}>
              {description}
            </CardDescription>
          </div>
          
          {isStore && showActions && (
            <div className="flex items-center gap-3">
              <Button 
                onClick={onAdd}
                className="bg-yellow-600 hover:bg-yellow-700 text-white border-2 border-yellow-500 hover:border-yellow-400 rounded-sm px-6 py-2 font-bold shadow-lg shadow-yellow-500/50 transition-all"
              >
                Añadir
              </Button>
              <button className="text-white hover:text-purple-200 transition-colors">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          )}
          
          {!isStore && (
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              <ChevronDown className="w-6 h-6" />
            </button>
          )}
        </div>
      </CardHeader>
      
      {!isStore && showActions && (
        <CardContent className="pt-4">
          <div className="flex gap-3 flex-wrap">
            <Button 
              size="sm" 
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 hover:border-green-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-green-500/30"
            >
              Completar
            </Button>
            <Button 
              size="sm"
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 hover:border-blue-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-blue-500/30"
            >
              Editar
            </Button>
            <Button 
              size="sm"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 hover:border-red-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-red-500/30"
            >
              Borrar
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

