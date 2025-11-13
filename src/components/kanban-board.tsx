"use client"

import { MissionCard } from "@/components/mission-card";

type TaskStatus = 'ACTIVE' | 'DONE' | 'INACTIVE';
type TaskType = 'ONCE' | 'RECURRENT';
type TaskCategory = 'SALUD' | 'ENTRETENIMIENTO' | 'SOCIALES' | 'NATURALEZA' | 'VARIADAS';

interface Project {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
}

interface Task {
  id: number;
  userId: string;
  projectId: number | null;
  category: TaskCategory | null;
  title: string;
  description: string | null;
  type: TaskType;
  status: TaskStatus;
  difficulty: number;
  experienceReward: number;
  recurrencePattern?: string | null;
  recurrenceInterval?: number | null;
  isDefault: boolean;
  createdAt: string;
  project?: Project;
}

interface KanbanBoardProps {
  tasks: Task[];
  loading: boolean;
}

export function KanbanBoard({ tasks, loading }: KanbanBoardProps) {
  // Filtrar tareas por estado
  const activeTasks = tasks.filter((task) => task.status === 'ACTIVE');
  const inProgressTasks = tasks.filter((task) => task.status === 'INACTIVE');
  const doneTasks = tasks.filter((task) => task.status === 'DONE');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Cargando misiones...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna: Por hacer */}
      <div className="flex flex-col min-h-[700px]">
        <div className="bg-red-900/30 border-2 border-red-800/50 rounded-sm p-6 flex-1">
          <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
            Por hacer
          </h3>
          <div className="space-y-4">
            {activeTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tareas por hacer</p>
            ) : (
              activeTasks.map((task) => (
                <MissionCard 
                  key={task.id}
                  type={task.category || task.type}
                  title={task.title}
                  xp={task.experienceReward}
                  description={task.description || 'Sin descripción'}
                  showActions={false}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Columna: En progreso */}
      <div className="flex flex-col min-h-[700px]">
        <div className="bg-yellow-900/30 border-2 border-yellow-700/50 rounded-sm p-6 flex-1">
          <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
            En progreso
          </h3>
          <div className="space-y-4">
            {inProgressTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tareas en progreso</p>
            ) : (
              inProgressTasks.map((task) => (
                <MissionCard 
                  key={task.id}
                  type={task.category || task.type}
                  title={task.title}
                  xp={task.experienceReward}
                  description={task.description || 'Sin descripción'}
                  showActions={false}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Columna: Hechas */}
      <div className="flex flex-col min-h-[700px]">
        <div className="bg-green-900/30 border-2 border-green-800/50 rounded-sm p-6 flex-1">
          <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
            Hechas
          </h3>
          <div className="space-y-4">
            {doneTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tareas completadas</p>
            ) : (
              doneTasks.map((task) => (
                <MissionCard 
                  key={task.id}
                  type={task.category || task.type}
                  title={task.title}
                  xp={task.experienceReward}
                  description={task.description || 'Sin descripción'}
                  showActions={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

