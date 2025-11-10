"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionCard } from "@/components/mission-card";
import { MissionsCalendar } from "@/components/missions-calendar";
import { CreateMissionModal } from "@/components/create-mission-modal";

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
  difficulty: number;
  experienceReward: number;
  recurrencePattern: string | null;
  recurrenceInterval: number | null;
  isDefault: boolean;
  createdAt: string;
  project?: Project;
}

interface MockDataResponse {
  success: boolean;
  data: {
    tasks: Task[];
    projects: Project[];
    user: {
      clerkId: string;
      experience: number;
      level: number;
      createdAt: string;
    };
  };
}

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMockData() {
      try {
        const response = await fetch('/api/tasks/mock');
        const result = await response.json() as MockDataResponse;
        if (result.success) {
          setTasks(result.data.tasks);
        }
      } catch (error) {
        console.error('Error cargando datos mock:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMockData();
  }, []);

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 h-12 bg-transparent gap-3 p-0">
            <TabsTrigger 
              value="lista" 
              className="bg-gray-900 border-2 border-purple-500 text-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:border-purple-400 data-[state=active]:text-white rounded-sm hover:bg-purple-900 hover:border-purple-400 transition-all font-semibold shadow-lg shadow-purple-500/20"
            >
              Lista
            </TabsTrigger>
            <TabsTrigger 
              value="calendario" 
              className="bg-gray-900 border-2 border-gray-700 text-gray-400 data-[state=active]:bg-gray-800 data-[state=active]:border-gray-600 data-[state=active]:text-white rounded-sm hover:bg-gray-800 hover:border-gray-600 transition-all font-semibold"
            >
              Calendario
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              className="bg-gray-900 border-2 border-gray-700 text-gray-400 data-[state=active]:bg-purple-600 data-[state=active]:border-purple-400 data-[state=active]:text-white rounded-sm hover:bg-gray-800 hover:border-gray-600 transition-all font-semibold"
        >
              Kanban board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Cargando misiones...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No hay misiones disponibles</p>
              </div>
            ) : (
              tasks.map((task) => (
                <MissionCard 
                  key={task.id}
                  type={task.category || task.type}
                  title={task.title}
                  xp={task.experienceReward}
                  description={task.description || 'Sin descripción'}
                  onComplete={() => console.log('Completar tarea:', task.id)}
                  onEdit={() => console.log('Editar tarea:', task.id)}
                  onDelete={() => console.log('Borrar tarea:', task.id)}
                />
              ))
            )}

            {/* Botón para crear misión */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-12 py-6 text-lg font-bold shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all"
              >
                Crear Misión
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendario" className="mt-8">
            <MissionsCalendar />
          </TabsContent>

          <TabsContent value="kanban" className="mt-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Cargando misiones...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna: Por hacer */}
                <div className="flex flex-col min-h-[700px]">
                  <div className="bg-red-900/30 border-2 border-red-800/50 rounded-sm p-6 flex-1">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-wide">
                      Por hacer
                    </h3>
                    <div className="space-y-4">
                      {tasks.slice(0, Math.ceil(tasks.length / 3)).map((task) => (
                        <MissionCard 
                          key={task.id}
                          type={task.category || task.type}
                          title={task.title}
                          xp={task.experienceReward}
                          description={task.description || 'Sin descripción'}
                          showActions={false}
                        />
                      ))}
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
                      {tasks.slice(Math.ceil(tasks.length / 3), Math.ceil(tasks.length * 2 / 3)).map((task) => (
                        <MissionCard 
                          key={task.id}
                          type={task.category || task.type}
                          title={task.title}
                          xp={task.experienceReward}
                          description={task.description || 'Sin descripción'}
                          showActions={false}
                        />
                      ))}
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
                      {tasks.slice(Math.ceil(tasks.length * 2 / 3)).map((task) => (
                        <MissionCard 
                          key={task.id}
                          type={task.category || task.type}
                          title={task.title}
                          xp={task.experienceReward}
                          description={task.description || 'Sin descripción'}
                          showActions={false}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        {/* Modal de creación de misión */}
        <CreateMissionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        />
      </div>
    </div>
  );
}
