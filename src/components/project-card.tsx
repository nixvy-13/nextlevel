"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Eye, ChevronDown, Trash2, Edit } from "lucide-react";

interface TaskCompletion {
  id: number;
  taskId: number;
  userId: string;
  completedAt: string;
}

interface Task {
  id: number;
  userId: string;
  projectId: number | null;
  category: string | null;
  title: string;
  description: string | null;
  type: string;
  status: string;
  difficulty: number;
  experienceReward: number;
  recurrency?: number | null;
  isDefault: boolean;
  createdAt: string;
  taskCompletions?: TaskCompletion[];
}

interface ProjectCardProps {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  experienceReward: number;
  tasks: Task[];
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDetails?: () => void;
  onCompleteTask?: (taskId: number) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onDetailsTask?: (task: Task) => void;
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

function getCategoryColor(category?: string | null) {
  return categoryColors[category || "VARIADAS"] || categoryColors["VARIADAS"];
}

export function ProjectCard({
  id,
  title,
  description,
  status,
  experienceReward,
  tasks,
  createdAt,
  onEdit,
  onDelete,
  onDetails,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onDetailsTask,
  showActions = true,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const completedTasks = tasks.filter(task => task.status === 'DONE').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: 'bg-orange-600/80', border: 'border-orange-500', text: 'text-orange-400' };
      case 'DONE':
        return { bg: 'bg-green-600/80', border: 'border-green-500', text: 'text-green-400' };
      case 'INACTIVE':
        return { bg: 'bg-gray-600/80', border: 'border-gray-500', text: 'text-gray-400' };
      default:
        return { bg: 'bg-orange-600/80', border: 'border-orange-500', text: 'text-orange-400' };
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-950 border-2 ${statusColor.border} shadow-xl ${statusColor.text.replace('text-', 'shadow-')}/20 rounded-sm overflow-hidden hover:${statusColor.border} transition-all`}>
      <CardHeader className={`pb-3 border-b ${statusColor.border.replace('border-', 'border-')}/30`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className={`${statusColor.text} text-lg font-bold`}>
                {title} - {experienceReward} Xp
              </CardTitle>
              <span className={`${statusColor.text} text-xs font-bold uppercase px-2 py-1 rounded`}>
                {status === 'DONE' ? '✓ Completado' : status === 'ACTIVE' ? '● Activo' : '○ Inactivo'}
              </span>
            </div>
            <CardDescription className="text-gray-400 mt-2">
              {description || 'Sin descripción'}
            </CardDescription>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-xs">
                <div
                  className={`h-full rounded-full transition-all ${
                    completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-gray-400 text-sm font-semibold">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>

          {showActions && (
            <button
              onClick={onDetails}
              className={`${statusColor.text} hover:text-white transition-colors ml-4`}
            >
              <Eye className="w-6 h-6" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Sección de tareas colapsables */}
        {totalTasks > 0 && (
          <Collapsible defaultOpen={false} onOpenChange={setIsOpen} className="mb-4">
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left pb-2 hover:text-white transition-colors">
              <ChevronDown
                className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
              <span className="font-semibold text-gray-300">
                Misiones del Proyecto ({totalTasks})
              </span>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 mt-3 pt-3 border-t border-gray-700">
              {tasks.map((task) => {
                const taskColors = getCategoryColor(task.category);
                const isCompleted = task.status === 'DONE';
                
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-sm bg-gray-800/50 border-l-4 ${taskColors.border} hover:bg-gray-800 transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {task.title}
                          </p>
                          {isCompleted && <span className="text-green-400 text-xs font-bold">✓ Completada</span>}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {task.category} • {task.experienceReward} XP
                        </p>
                      </div>
                      {!isCompleted && showActions && (
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => onCompleteTask?.(task.id)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Completar"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Acciones del proyecto */}
        {showActions && status === 'ACTIVE' && (
          <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-700">
            <Button
              size="sm"
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 hover:border-blue-400 rounded-sm px-4 py-2 font-semibold transition-all shadow-md shadow-blue-500/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              size="sm"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 hover:border-red-400 rounded-sm px-4 py-2 font-semibold transition-all shadow-md shadow-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Borrar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

