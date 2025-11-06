"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface CreateMissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMissionModal({ open, onOpenChange }: CreateMissionModalProps) {
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
        <div className="px-6 pb-6 space-y-4">
          {/* Nombre de la misión */}
          <div>
            <label className="block text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">
              Nombre de la misión
            </label>
            <Input 
              placeholder="Ingresa el nombre..."
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
              className="bg-gray-900 border-2 border-purple-500/50 text-white placeholder:text-gray-500 rounded-sm h-10 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
            />
          </div>

          {/* Botón Crear misión */}
          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm py-3 font-bold text-base shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all uppercase tracking-wide"
            >
              Crear misión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

