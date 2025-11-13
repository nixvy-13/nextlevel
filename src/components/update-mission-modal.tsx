"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type TaskType = 'ONCE' | 'RECURRENT';

interface UpdateMissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: number;
  initialTitle?: string;
  initialDescription?: string;
  initialXp?: number;
  initialRecurrency?: number;
  initialType?: TaskType;
  onUpdate: (taskId: number, data: UpdateTaskData) => Promise<void>;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  type?: TaskType;
  experienceReward?: number;
  recurrency?: number;
}

export function UpdateMissionModal({ 
  open, 
  onOpenChange, 
  taskId,
  initialTitle = "",
  initialDescription = "",
  initialXp = 0,
  initialRecurrency = 0,
  initialType = "ONCE",
  onUpdate 
}: UpdateMissionModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [type, setType] = useState<TaskType>(initialType);
  const [xp, setXp] = useState(initialXp);
  const [recurrency, setRecurrency] = useState(initialRecurrency);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar valores cuando cambian los props iniciales
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setType(initialType);
      setXp(initialXp);
      setRecurrency(initialRecurrency);
    }
  }, [open, initialTitle, initialDescription, initialType, initialXp, initialRecurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskId) {
      console.error("Task ID is missing");
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(taskId, {
        title: title || undefined,
        description: description || undefined,
        experienceReward: xp || undefined,
        recurrency: type === 'RECURRENT' ? (recurrency || undefined) : undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-2 border-purple-500 rounded-sm max-w-md p-0 gap-0 shadow-2xl shadow-purple-500/50">
        {/* Header con botón cerrar */}
        <DialogHeader className="relative p-6 pb-4 border-b border-purple-500/30">
          <DialogTitle className="text-purple-300 font-bold text-lg">Actualizar Misión</DialogTitle>
        </DialogHeader>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Nombre de la misión
            </label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el nombre..."
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Descripción
            </label>
            <Input 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe la misión..."
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Recurrencia (solo aparece si es recurrente) */}
          {type === 'RECURRENT' && (
            <div>
              <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                Recurrencia (días)
              </label>
              <Input 
                placeholder="Ej: 1 (cada día), 7 (cada semana), 30 (cada mes)"
                type="number"
                min="1"
                value={recurrency}
                onChange={(e) => setRecurrency(Number(e.target.value))}
                disabled={isLoading}
                className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
              />
            </div>
          )}

          {/* Puntos XP */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Puntos XP
            </label>
            <Input 
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              placeholder="100"
              type="number"
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Botón Actualizar */}
          <div className="pt-4">
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm py-3 font-bold text-base shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

