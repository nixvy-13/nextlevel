import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">NextLevel</h1>
          <div className="space-x-4">
            <Link href="/missions" className="text-gray-700 hover:text-green-600">
              Misiones
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-green-600">
              Perfil
            </Link>
          </div>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Gamifica tu vida
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Convierte tus tareas cotidianas en una aventura. Crea misiones, complétales, sube de nivel y domina tu vida.
            </p>
            <Link
              href="/missions"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Comenzar Ahora
            </Link>
          </div>
          <div className="relative aspect-square">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop"
              alt="Árbol simbolizando crecimiento"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📋
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Crea Misiones
              </h4>
              <p className="text-gray-700">
                Define tus propias tareas y recibe experiencia por completarlas.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚔️
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Completa Misiones
              </h4>
              <p className="text-gray-700">
                Marca tareas como completadas y recibe puntos de experiencia.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⭐
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Sube de Nivel
              </h4>
              <p className="text-gray-700">
                Gana experiencia y mejora tu nivel mientras avanzas en tu vida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">
            ¿Listo para comenzar tu aventura?
          </h3>
          <Link
            href="/missions"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Ir a Misiones
          </Link>
        </div>
      </section>
    </div>
  );
}
