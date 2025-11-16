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
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface UpdateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: number;
  initialTitle?: string;
  initialDescription?: string;
  initialXp?: number;
  onUpdate: (projectId: number, data: UpdateProjectData) => Promise<void>;
}

interface UpdateProjectData {
  title?: string;
  description?: string;
  experienceReward?: number;
}

export function UpdateProjectModal({
  open,
  onOpenChange,
  projectId,
  initialTitle = "",
  initialDescription = "",
  initialXp = 0,
  onUpdate,
}: UpdateProjectModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [xp, setXp] = useState(initialXp);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar valores cuando cambian los props iniciales
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setXp(initialXp);
    }
  }, [open, initialTitle, initialDescription, initialXp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(projectId, {
        title: title || undefined,
        description: description || undefined,
        experienceReward: xp || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-2 border-purple-500 rounded-sm max-w-md p-0 gap-0 shadow-2xl shadow-purple-500/50">
        <VisuallyHidden.Root>
          <DialogTitle>Actualizar Proyecto</DialogTitle>
        </VisuallyHidden.Root>
        {/* Header con botón cerrar */}
        <div className="relative p-6 pb-4 border-b border-purple-500/30">
          <h2 className="text-purple-300 font-bold text-lg">Actualizar Proyecto</h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Nombre del proyecto
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
              placeholder="Describe el proyecto..."
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

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

