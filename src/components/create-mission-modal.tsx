"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

        {/* Formulario */}
        <div className="px-6 pb-6 space-y-4">
          {/* Nombre de la misión */}
          <div>
            <label className="block text-black font-semibold mb-2 text-sm">
              Nombre de la mision
            </label>
            <Input 
              placeholder="Input"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-10 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Tipo de misión */}
          <div>
            <label className="block text-black font-semibold mb-2 text-sm">
              Tipo de mision
            </label>
            <Input 
              placeholder="Input"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-10 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Objetivo de la misión */}
          <div>
            <label className="block text-black font-semibold mb-2 text-sm">
              Objetivo de la misión
            </label>
            <Input 
              placeholder="Input"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-10 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Recurrencia */}
          <div>
            <label className="block text-black font-semibold mb-2 text-sm">
              Recurrencia
            </label>
            <Input 
              placeholder="Input"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-10 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Xp */}
          <div>
            <label className="block text-black font-semibold mb-2 text-sm">
              Xp
            </label>
            <Input 
              placeholder="Input"
              type="number"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-10 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Botón Crear misión */}
          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-sm py-3 font-semibold text-base shadow-lg transition-all"
            >
              Crear misión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

