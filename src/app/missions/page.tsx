"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Mission } from "@/lib/types";

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [defaultMissions, setDefaultMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    xpReward: 10,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/missions/get").then((r) => r.json() as Promise<Mission[]>),
      fetch("/api/missions/get-default").then((r) => r.json() as Promise<Mission[]>),
    ])
      .then(([userMissionsData, defaultData]) => {
        setMissions(Array.isArray(userMissionsData) ? userMissionsData : []);
        setDefaultMissions(Array.isArray(defaultData) ? defaultData : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateMission = async () => {
    if (!formData.title.trim()) {
      alert("El título es requerido");
      return;
    }

    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      user_id: "temp",
      title: formData.title,
      description: formData.description,
      xp_reward: formData.xpReward,
      completed: false,
      difficulty: "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/missions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missions: [newMission] }),
      });

      if (response.ok) {
        setMissions([...missions, newMission]);
        setFormData({ title: "", description: "", xpReward: 10 });
        setShowForm(false);
      }
    } catch (error) {
      alert("Error al crear la misión");
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    try {
      const response = await fetch("/api/missions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId }),
      });

      if (response.ok) {
        setMissions(
          missions.map((m) =>
            m.id === missionId
              ? {
                  ...m,
                  completed: true,
                  completed_at: new Date().toISOString().split("T")[0],
                }
              : m
          )
        );
      }
    } catch (error) {
      alert("Error al completar la misión");
    }
  };

  const handleAddDefaultMission = async (defaultMission: Mission) => {
    const userMission: Mission = {
      ...defaultMission,
      id: `${defaultMission.id}-${Date.now()}`,
      completed: false,
    };

    try {
      const response = await fetch("/api/missions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missions: [userMission] }),
      });

      if (response.ok) {
        setMissions([...missions, userMission]);
      }
    } catch (error) {
      alert("Error al agregar la misión");
    }
  };

  if (loading) return <div className="text-center py-20">Cargando...</div>;

  const activeMissions = missions.filter((m) => !m.completed);
  const completedMissions = missions.filter((m) => m.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            NextLevel
          </Link>
          <div className="space-x-4">
            <Link href="/missions" className="font-semibold text-green-600">
              Misiones
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-green-600">
              Perfil
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 mb-8"
          >
            + Crear Nueva Misión
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Crear Nueva Misión
            </h3>
            <input
              type="text"
              placeholder="Título"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
              rows={2}
            ></textarea>
            <input
              type="number"
              min="1"
              value={formData.xpReward}
              onChange={(e) =>
                setFormData({ ...formData, xpReward: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateMission}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Crear
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Misiones Activas */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Misiones Activas ({activeMissions.length})
        </h2>
        {activeMissions.length === 0 ? (
          <p className="text-gray-600 mb-12">No tienes misiones activas</p>
        ) : (
          <div className="grid gap-4 mb-12">
            {activeMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {mission.title}
                  </h3>
                  <p className="text-gray-600">{mission.description}</p>
                  <span className="text-yellow-600 font-semibold mt-2 block">
                    +{mission.xp_reward} XP
                  </span>
                </div>
                <button
                  onClick={() => handleCompleteMission(mission.id)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 whitespace-nowrap ml-4"
                >
                  Completar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Misiones Completadas */}
        {completedMissions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Completadas ({completedMissions.length})
            </h2>
            <div className="grid gap-4">
              {completedMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-gray-100 rounded-lg shadow-md p-6 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-2xl">✓</span>
                    <div>
                      <h3 className="font-bold text-gray-700">
                        {mission.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Completada: {mission.completed_at}
                      </p>
                    </div>
                    <span className="ml-auto text-yellow-600 font-semibold">
                      +{mission.xp_reward} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Misiones Recomendadas */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Misiones Recomendadas
        </h2>
        <div className="grid gap-4">
          {defaultMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {mission.title}
                </h3>
                <p className="text-gray-600">{mission.description}</p>
                <span className="text-yellow-600 font-semibold mt-2 block">
                  +{mission.xp_reward} XP
                </span>
              </div>
              <button
                onClick={() => handleAddDefaultMission(mission)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap ml-4"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
