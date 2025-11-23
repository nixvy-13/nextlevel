"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface MissionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionName?: string;
  missionType?: string;
  description?: string;
  xp?: number;
  difficulty?: number;
  category?: string;
  missionType2?: string; // type (ONCE/RECURRENT)
  recurrence?: number;
  showConfirmation?: boolean;
  confirmationText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function MissionDetailsModal({ 
  open, 
  onOpenChange,
  missionName = "Nombre de la misión",
  missionType = "Categoría",
  description = "Descripción de la misión",
  xp = 50,
  difficulty = 1,
  category = "Sin categoría",
  missionType2 = "ONCE",
  recurrence = 0,
  showConfirmation = false,
  confirmationText = "¿Quieres actualizar la misión?",
  onConfirm,
  onCancel,
}: MissionDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-2 border-purple-500 rounded-sm max-w-lg w-[calc(100%-2rem)] sm:w-auto p-0 gap-0 shadow-2xl shadow-purple-500/50" onInteractOutside={(e) => e.preventDefault()}>
        <VisuallyHidden.Root>
          <DialogTitle>Detalles de la Misión</DialogTitle>
        </VisuallyHidden.Root>
        {/* Header con botón cerrar */}
        <div className="relative p-6 pb-4 border-b border-purple-500/30">
          <h2 className="text-purple-300 font-bold text-lg">Detalles de la Misión</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none p-1 hover:bg-purple-500/20"
          >
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6 space-y-4">
          {/* Nombre de la misión */}
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
              Nombre
            </h2>
            <p className="text-white text-lg font-medium">
              {missionName}
            </p>
          </div>

          {/* Categoría */}
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
              Categoría
            </h2>
            <p className="text-white text-lg font-medium">
              {missionType}
            </p>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
              Descripción
            </h2>
            <p className="text-white text-lg font-medium">
              {description}
            </p>
          </div>

          {/* Experiencia */}
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
              Experiencia
            </h2>
            <p className="text-white text-lg font-medium">
              {xp} XP
            </p>
          </div>

          {/* Dificultad */}
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
              Dificultad
            </h2>
            <p className="text-white text-lg font-medium">
              {difficulty}/5
            </p>
          </div>

          {/* Tipo de tarea */}
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
              Tipo
            </h2>
            <p className="text-white text-lg font-medium">
              {missionType2 === 'ONCE' ? 'Una vez' : 'Recurrente'}
            </p>
          </div>

          {/* Recurrencia (si aplica) */}
          {missionType2 === 'RECURRENT' && recurrence > 0 && (
            <div>
              <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2">
                Recurrencia
              </h2>
              <p className="text-white text-lg font-medium">
                {recurrence} día{recurrence !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Sección de confirmación (opcional) */}
          {showConfirmation && (
            <>
              <div className="pt-4">
                <p className="text-white font-semibold text-center">
                  {confirmationText}
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={onConfirm}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-6 py-2 font-semibold text-base shadow-lg shadow-purple-500/50 transition-all"
                >
                  Añadir misión
                </Button>
                <Button
                  onClick={onCancel}
                  className="bg-gray-800 hover:bg-gray-900 text-white border-2 border-gray-700 rounded-sm px-6 py-2 font-semibold text-base shadow-lg transition-all"
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

