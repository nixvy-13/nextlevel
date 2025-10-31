"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface MissionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionName?: string;
  missionType?: string;
  description?: string;
  xp?: number;
  showConfirmation?: boolean;
  confirmationText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function MissionDetailsModal({ 
  open, 
  onOpenChange,
  missionName = "Nombre de la mision",
  missionType = "Tipo de mision",
  description = "Descripcion: cepillate los dientes",
  xp = 50,
  showConfirmation = false,
  confirmationText = "¿Quieres actualizar la mision?",
  onConfirm,
  onCancel,
}: MissionDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-200 border-2 border-gray-400 rounded-sm max-w-md p-0 gap-0">
        {/* Header con botón cerrar */}
        <DialogHeader className="relative p-6 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <X className="h-6 w-6 text-black" />
            <span className="sr-only">Cerrar</span>
          </button>
        </DialogHeader>

        {/* Contenido */}
        <div className="px-6 pb-6 space-y-4">
          {/* Nombre de la misión */}
          <div>
            <h2 className="text-black font-bold text-xl text-center">
              {missionName}
            </h2>
          </div>

          {/* Tipo de misión */}
          <div>
            <p className="text-black font-semibold text-center">
              {missionType}
            </p>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-black font-semibold text-center">
              {description}
            </p>
          </div>

          {/* XP */}
          <div>
            <p className="text-black font-bold text-lg text-center">
              {xp} Xp
            </p>
          </div>

          {/* Sección de confirmación (opcional) */}
          {showConfirmation && (
            <>
              <div className="pt-4">
                <p className="text-black font-semibold text-center">
                  {confirmationText}
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={onConfirm}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-sm px-6 py-2 font-semibold text-base shadow-lg transition-all"
                >
                  Publicar mision
                </Button>
                <Button
                  onClick={onCancel}
                  className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm px-6 py-2 font-semibold text-base shadow-lg transition-all"
                >
                  Mejor no
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

