"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface UpdateMissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateMissionModal({ open, onOpenChange }: UpdateMissionModalProps) {
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
        <div className="px-6 pb-6 space-y-6">
          {/* Nueva Xp */}
          <div>
            <label className="block text-black font-bold mb-3 text-lg">
              Nueva Xp
            </label>
            <Input 
              placeholder="Input para modificar"
              type="number"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-12 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Nueva recurrencia */}
          <div>
            <label className="block text-black font-bold mb-3 text-lg">
              Nueva recurrencia
            </label>
            <Input 
              placeholder="Input para modificar"
              className="bg-white border-2 border-gray-300 text-black rounded-sm h-12 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Botón Actualizar */}
          <div className="pt-6">
            <Button 
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-sm py-3 font-semibold text-base shadow-lg transition-all"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

