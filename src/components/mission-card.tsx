"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface MissionCardProps {
  type?: string;
  title?: string;
  xp?: number;
  description?: string;
  variant?: "default" | "store";
  completedAt?: string;
  isRecurrent?: boolean;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  onDetails?: () => void;
  onClose?: () => void;
  showActions?: boolean;
}

// Mapeo de categorías a colores
const categoryColors: Record<string, { bg: string; border: string; text: string; shadow: string }> = {
  SALUD: { bg: "bg-blue-600/80", border: "border-blue-500", text: "text-blue-400", shadow: "shadow-blue-500/20" },
  ENTRETENIMIENTO: { bg: "bg-red-600/80", border: "border-red-500", text: "text-red-400", shadow: "shadow-red-500/20" },
  SOCIALES: { bg: "bg-yellow-600/80", border: "border-yellow-500", text: "text-yellow-400", shadow: "shadow-yellow-500/20" },
  NATURALEZA: { bg: "bg-green-600/80", border: "border-green-500", text: "text-green-400", shadow: "shadow-green-500/20" },
  VARIADAS: { bg: "bg-pink-600/80", border: "border-pink-500", text: "text-pink-400", shadow: "shadow-pink-500/20" },
};

function getCategoryColor(category?: string) {
  return categoryColors[category || "VARIADAS"] || categoryColors["VARIADAS"];
}

export function MissionCard({
  type = "Tipo",
  title = "Título",
  xp = 0,
  description = "Descripción de la misión",
  variant = "default",
  completedAt,
  isRecurrent = false,
  onComplete,
  onEdit,
  onDelete,
  onAdd,
  onDetails,
  onClose,
  showActions = true,
}: MissionCardProps) {
  const isStore = variant === "store";
  const colors = getCategoryColor(type);
  
  // Formatear la fecha de completación
  const formatCompletedDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-950 border-2 ${colors.border} shadow-xl ${colors.shadow} rounded-sm overflow-hidden hover:${colors.border.replace('border-', 'border-')} transition-all`}>
      <CardHeader className={`pb-3 border-b ${colors.border.replace('border-', 'border-')}/30`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={`${colors.text} text-lg font-bold ${isStore && 'mb-2'}`}>
              {type} - {title} - {xp} Xp
            </CardTitle>
            <CardDescription className={`${isStore ? 'text-white/80' : 'text-gray-400'} mt-2`}>
              {description}
            </CardDescription>
            {completedAt && (
              <div className={`${colors.text} text-sm mt-2 font-semibold`}>
                ✓ Completado: {formatCompletedDate(completedAt)}
              </div>
            )}
          </div>
          
          {isStore && showActions && (
            <div className="flex items-center gap-3">
              <Button 
                onClick={onAdd}
                className="bg-yellow-600 hover:bg-yellow-700 text-white border-2 border-yellow-500 hover:border-yellow-400 rounded-sm px-6 py-2 font-bold shadow-lg shadow-yellow-500/50 transition-all"
              >
                Añadir
              </Button>
              <button 
                onClick={onDetails}
                className={`${colors.text} hover:text-white transition-colors`}
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>
          )}
          
          {!isStore && showActions && (
            <button 
              onClick={onDetails}
              className={`${colors.text} hover:text-white transition-colors`}
            >
              <Eye className="w-6 h-6" />
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
            {isRecurrent && (
              <Button 
                size="sm"
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-500 hover:border-orange-400 rounded-sm px-5 py-2 font-semibold transition-all shadow-md shadow-orange-500/30"
              >
                Finalizar
              </Button>
            )}
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

