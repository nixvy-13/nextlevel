"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CreateMissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMissionCreated?: () => void;
}

interface MissionData {
  nombre: string;
  tipo: string;
  objetivo: string;
  recurrencia: string;
  xp: number;
}

export function CreateMissionModal({ open, onOpenChange, onMissionCreated }: CreateMissionModalProps) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [recurrencia, setRecurrencia] = useState("");
  const [xp, setXp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const missionData: MissionData = {
        nombre,
        tipo,
        objetivo,
        recurrencia,
        xp: parseInt(xp) || 0,
      };

      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(missionData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la misión");
      }

      // Limpiar el formulario
      setNombre("");
      setTipo("");
      setObjetivo("");
      setRecurrencia("");
      setXp("");

      // Cerrar el modal y notificar al componente padre
      onOpenChange(false);
      if (onMissionCreated) {
        onMissionCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-2 border-purple-500 rounded-sm max-w-md p-0 gap-0 shadow-2xl shadow-purple-500/50">
        {/* Header con botón cerrar */}
        <DialogHeader className="relative p-6 pb-4 border-b border-purple-500/30">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-all hover:opacity-100 hover:bg-purple-500/20 focus:outline-none disabled:pointer-events-none p-1"
          >
          </button>
        </DialogHeader>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-sm text-sm">
              {error}
            </div>
          )}

          {/* Nombre de la misión */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Nombre de la misión
            </label>
            <Input 
              placeholder="Ingresa el nombre..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Tipo de misión */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Tipo de misión
            </label>
            <Input 
              placeholder="Ej: Estudio, Ejercicio..."
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Objetivo de la misión */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Objetivo de la misión
            </label>
            <Input 
              placeholder="Describe el objetivo..."
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Recurrencia */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Recurrencia
            </label>
            <Input 
              placeholder="Ej: Diaria, Semanal..."
              value={recurrencia}
              onChange={(e) => setRecurrencia(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Xp */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Puntos XP
            </label>
            <Input 
              placeholder="100"
              type="number"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Botón Crear misión */}
          <div className="pt-4">
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm py-3 font-bold text-base shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando..." : "Crear misión"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

