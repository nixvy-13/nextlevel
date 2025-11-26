"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MissionCard } from "@/components/mission-card";
import { MissionDetailsModal } from "@/components/mission-details-modal";

interface Task {
  id: number;
  title: string;
  description: string;
  experienceReward: number;
  category: string;
  isDefault: boolean;
}

export default function StorePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Categorías de misiones con colores
  const categories = [
    { name: "SALUD", color: "bg-blue-600 hover:bg-blue-700 border-blue-500" },
    { name: "ENTRETENIMIENTO", color: "bg-red-600 hover:bg-red-700 border-red-500" },
    { name: "SOCIALES", color: "bg-yellow-600 hover:bg-yellow-700 border-yellow-500" },
    { name: "NATURALEZA", color: "bg-green-600 hover:bg-green-700 border-green-500" },
    { name: "VARIADAS", color: "bg-pink-600 hover:bg-pink-700 border-pink-500" },
  ];

  // Cargar tareas por defecto al montar el componente
  useEffect(() => {
    const fetchDefaultTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks/getDefault');
        if (!response.ok) {
          throw new Error('Error al cargar las tareas');
        }
        const data = await response.json() as Task[];
        setTasks(data);
      } catch (error) {
        console.error('Error al cargar las tareas por defecto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultTasks();
  }, []);

  // Filtrar tareas según la categoría seleccionada
  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;

  // Manejar apertura del modal de detalles
  const handleShowDetails = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Manejar cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Manejar añadir tarea
  const handleAddTask = async () => {
    if (!selectedTask) return;
    try {
      const response = await fetch(`/api/tasks/addMision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: selectedTask.id,
        }),
      });
      if (response.ok) {
        handleCloseModal();
        // Aquí puedes mostrar un mensaje de éxito o actualizar el estado
      }
    } catch (error) {
      console.error('Error al añadir tarea:', error);
    }
  };

  // Manejar confirmación del modal
  const handleConfirmAdd = () => {
    handleAddTask();
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Filtros de Categorías */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
          <Button
            onClick={() => setSelectedCategory(null)}
            className={`${
              selectedCategory === null
                ? "bg-gray-800 hover:bg-gray-900 border-gray-600"
                : "bg-gray-700 hover:bg-gray-800 border-gray-600"
            } text-white border-2 rounded-sm px-8 py-3 font-bold text-base shadow-lg hover:shadow-xl transition-all`}
          >
            Todas
          </Button>
          {categories.map((category) => (
            <Button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`${
                selectedCategory === category.name
                  ? category.color
                  : category.color.replace("bg-", "bg-opacity-70 bg-")
              } text-white border-2 rounded-sm px-8 py-3 font-bold text-base shadow-lg hover:shadow-xl transition-all`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Lista de Misiones */}
        <div className="space-y-4 mb-8">
          {loading ? (
            <div className="text-white text-center py-8">Cargando misiones...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-white text-center py-8">
              No hay misiones disponibles en esta categoría
            </div>
          ) : (
            filteredTasks.map((task) => (
              <MissionCard
                key={task.id}
                type={task.category}
                title={task.title}
                xp={task.experienceReward}
                description={task.description}
                variant="store"
                onDetails={() => handleShowDetails(task)}
                onAdd={() => handleAddTask()}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de detalles de tarea */}
      <MissionDetailsModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        missionName={selectedTask?.title}
        missionType={selectedTask?.category}
        description={selectedTask?.description}
        xp={selectedTask?.experienceReward}
        showConfirmation={true}
        confirmationText="¿Añadir esta tarea a tu lista?"
        onConfirm={handleConfirmAdd}
        onCancel={handleCloseModal}
      />
    </div>
  );
}

