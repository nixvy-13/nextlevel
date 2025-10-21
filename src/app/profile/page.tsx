"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@/lib/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/get")
      .then((res) => res.json() as Promise<User>)
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (!user) return <div className="text-center py-20">Usuario no encontrado</div>;

  const xpToNextLevel = user.xp_per_level - user.current_xp;
  const xpProgress = (user.current_xp / user.xp_per_level) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            NextLevel
          </Link>
          <div className="space-x-4">
            <Link href="/missions" className="text-gray-700 hover:text-green-600">
              Misiones
            </Link>
            <Link href="/profile" className="font-semibold text-green-600">
              Perfil
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
              {user.level}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 mt-2">Nivel {user.level}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Experiencia
              </span>
              <span className="text-sm text-gray-600">
                {user.current_xp} / {user.xp_per_level} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {xpToNextLevel} XP para el siguiente nivel
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {user.created_at ? 0 : 0}
              </p>
              <p className="text-gray-600 text-sm">Misiones Activas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {user.total_xp}
              </p>
              <p className="text-gray-600 text-sm">Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {user.total_xp}
              </p>
              <p className="text-gray-600 text-sm">Total XP</p>
            </div>
          </div>
        </div>

        <Link
          href="/missions"
          className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
        >
          Ir a Misiones
        </Link>
      </main>
    </div>
  );
}
