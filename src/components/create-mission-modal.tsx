"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";

type TaskType = 'ONCE' | 'RECURRENT';
type TaskCategory = 'SALUD' | 'ENTRETENIMIENTO' | 'SOCIALES' | 'NATURALEZA' | 'VARIADAS';

interface CreateMissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMissionCreated?: () => void;
}

interface MissionData {
  userId: string;
  title: string;
  description: string;
  type: TaskType;
  category: TaskCategory;
  difficulty: number;
  experienceReward: number;
  recurrency?: number;
  isDefault: boolean;
}

export function CreateMissionModal({ open, onOpenChange, onMissionCreated }: CreateMissionModalProps) {
  const userId = useUser().user?.id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("VARIADAS");
  const [type, setType] = useState<TaskType>("ONCE");
  const [difficulty, setDifficulty] = useState("1");
  const [experienceReward, setExperienceReward] = useState("");
  const [recurrency, setRecurrency] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const missionData: MissionData = {
        userId: userId || "",
        title,
        description,
        type,
        category,
        difficulty: parseInt(difficulty) || 1,
        experienceReward: parseInt(experienceReward) || 10,
        ...(type === 'RECURRENT' && recurrency ? { recurrency: parseInt(recurrency) } : {}),
        isDefault: false,
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
      setTitle("");
      setDescription("");
      setCategory("VARIADAS");
      setType("ONCE");
      setDifficulty("1");
      setExperienceReward("");
      setRecurrency("");

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Categoría
            </label>
            <Select value={category} onValueChange={(value: string) => setCategory(value as TaskCategory)} disabled={isLoading}>
              <SelectTrigger className="bg-gray-900 border-2 border-purple-500/50 text-white rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-2 border-purple-500/50 text-white">
                <SelectItem value="SALUD" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Salud</SelectItem>
                <SelectItem value="ENTRETENIMIENTO" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Entretenimiento</SelectItem>
                <SelectItem value="SOCIALES" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Sociales</SelectItem>
                <SelectItem value="NATURALEZA" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Naturaleza</SelectItem>
                <SelectItem value="VARIADAS" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Variadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Descripción
            </label>
            <Input 
              placeholder="Describe la misión..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Tipo de tarea */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Tipo de tarea
            </label>
            <Select value={type} onValueChange={(value: string) => setType(value as TaskType)} disabled={isLoading}>
              <SelectTrigger className="bg-gray-900 border-2 border-purple-500/50 text-white rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-2 border-purple-500/50 text-white">
                <SelectItem value="ONCE" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Una vez</SelectItem>
                <SelectItem value="RECURRENT" className="focus:bg-purple-600/20 focus:text-white cursor-pointer">Recurrente</SelectItem>
              </SelectContent>
            </Select>
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
                onChange={(e) => setRecurrency(e.target.value)}
                disabled={isLoading}
                className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
              />
            </div>
          )}

          {/* Dificultad */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Dificultad (1-5)
            </label>
            <Input 
              placeholder="1"
              type="number"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
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
              placeholder="100"
              type="number"
              value={experienceReward}
              onChange={(e) => setExperienceReward(e.target.value)}
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

