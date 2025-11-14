"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionCard } from "@/components/mission-card";
import { MissionsCalendar } from "@/components/missions-calendar";
import { KanbanBoard } from "@/components/kanban-board";
import { CreateMissionModal } from "@/components/create-mission-modal";
import { UpdateMissionModal } from "@/components/update-mission-modal";
import { MissionDetailsModal } from "@/components/mission-details-modal";
import { CreateProjectModal } from "@/components/create-project-modal";

type TaskType = 'ONCE' | 'RECURRENT';
type TaskCategory = 'SALUD' | 'ENTRETENIMIENTO' | 'SOCIALES' | 'NATURALEZA' | 'VARIADAS';
type TaskStatus = 'ACTIVE' | 'DONE' | 'INACTIVE';

interface Project {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
}

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
  taskCompletions?: TaskCompletion[];
}

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar las tareas del usuario
  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks/get');
      if (!response.ok) {
        throw new Error('Error al cargar las tareas');
      }
      const data = await response.json() as Task[];
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar las tareas del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las tareas del usuario al montar el componente
  useEffect(() => {
    fetchUserTasks();
  }, []);

  // Función para eliminar una tarea
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/tasks/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }

      // Actualizar la lista de tareas removiendo la tarea eliminada
      setTasks(tasks.filter(task => task.id !== taskId));
      console.log('Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  // Función para abrir el modal de edición
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  // Función para abrir el modal de detalles
  const handleDetailsTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  // Función para actualizar una tarea
  const handleUpdateTask = async (taskId: number, data: any) => {
    try {
      const response = await fetch('/api/tasks/modify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, ...data }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la tarea');
      }

      const updatedTask = await response.json() as Task;

      // Actualizar la lista de tareas con la tarea modificada
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      console.log('Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  // Función para completar una tarea
  const handleCompleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/tasks/markAsCompleted', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Error al completar la tarea');
      }

      const result = await response.json() as {
        leveledUp: boolean;
        newLevel: number;
        xpGained: number;
        task: Task;
        completedAt: string;
      };

      // Actualizar la tarea en la lista con la información completa del endpoint
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? result.task
          : task
      ));

      console.log('Tarea completada exitosamente');
      if (result.leveledUp) {
        console.log(`¡Felicidades! Has subido al nivel ${result.newLevel}`);
      }
    } catch (error) {
      console.error('Error al completar la tarea:', error);
    }
  };

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

          <TabsContent value="lista" className="space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Cargando misiones...</p>
              </div>
            ) : (
              <>
                {/* Sección de Tareas Activas */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                    Tareas Pendientes
                  </h2>
                  {tasks.filter(task => task.status === 'ACTIVE').length === 0 ? (
                    <div className="text-center py-8 bg-gray-900/50 rounded-sm border-2 border-gray-700">
                      <p className="text-gray-400 text-lg">No hay tareas pendientes</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks
                        .filter(task => task.status === 'ACTIVE')
                        .map((task) => (
                          <MissionCard 
                            key={task.id}
                            type={task.category || task.type}
                            title={task.title}
                            xp={task.experienceReward}
                            description={task.description || 'Sin descripción'}
                            onComplete={() => handleCompleteTask(task.id)}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                            onDetails={() => handleDetailsTask(task)}
                          />
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Sección de Tareas Completadas */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                    Tareas Completadas
                  </h2>
                  {tasks.filter(task => task.status === 'DONE').length === 0 ? (
                    <div className="text-center py-8 bg-gray-900/50 rounded-sm border-2 border-gray-700">
                      <p className="text-gray-400 text-lg">No hay tareas completadas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks
                        .filter(task => task.status === 'DONE')
                        .map((task) => (
                          <MissionCard 
                            key={task.id}
                            type={task.category || task.type}
                            title={task.title}
                            xp={task.experienceReward}
                            description={task.description || 'Sin descripción'}
                            completedAt={task.taskCompletions?.[0]?.completedAt}
                            showActions={false}
                          />
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Botones para crear misión y proyecto */}
                <div className="flex justify-center gap-4 pt-6">
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 hover:border-purple-400 rounded-sm px-12 py-6 text-lg font-bold shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/60 transition-all"
                  >
                    Crear Misión
                  </Button>
                  <Button 
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 hover:border-blue-400 rounded-sm px-12 py-6 text-lg font-bold shadow-2xl shadow-blue-500/50 hover:shadow-blue-400/60 transition-all"
                  >
                    Crear Proyecto
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="calendario" className="mt-8">
            <MissionsCalendar />
          </TabsContent>

          <TabsContent value="kanban" className="mt-8">
            <KanbanBoard tasks={tasks} loading={loading} />
          </TabsContent>
        </Tabs>
        {/* Modal de creación de misión */}
        <CreateMissionModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onMissionCreated={fetchUserTasks}
        />

        {/* Modal de creación de proyecto */}
        <CreateProjectModal
          open={isCreateProjectModalOpen}
          onOpenChange={setIsCreateProjectModalOpen}
          onProjectCreated={fetchUserTasks}
        />
        
        {/* Modal de edición de misión */}
        <UpdateMissionModal
          open={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          taskId={selectedTask?.id}
          initialTitle={selectedTask?.title}
          initialDescription={selectedTask?.description || ""}
          initialXp={selectedTask?.experienceReward}
          initialType={selectedTask?.type as any}
          initialRecurrency={selectedTask?.recurrencePattern ? parseInt(selectedTask.recurrencePattern) : 0}
          onUpdate={handleUpdateTask}
        />

        {/* Modal de detalles de misión */}
        <MissionDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          missionName={selectedTask?.title}
          missionType={selectedTask?.category ?? undefined}
          description={selectedTask?.description ?? undefined}
          xp={selectedTask?.experienceReward}
          difficulty={selectedTask?.difficulty}
          missionType2={selectedTask?.type}
          recurrence={selectedTask?.recurrencePattern ? parseInt(selectedTask.recurrencePattern) : 0}
        />
      </div>
    </div>
  );
}
