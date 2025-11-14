-- Limpiar datos existentes (opcional, comentar si no quieres borrar todo)
-- DELETE FROM Task WHERE userId = 'monokrome' AND isDefault = 1;
-- DELETE FROM User WHERE clerkId = 'monokrome';

-- INSERTAR USUARIO
INSERT OR IGNORE INTO User (clerkId, experience, level, createdAt)
VALUES ('monokrome', 0, 1, datetime('now'));

-- INSERTAR MISIONES (SALUD)
INSERT INTO Task (userId, category, title, description, type, status, difficulty, experienceReward, recurrency, isDefault, createdAt)
VALUES 
  ('monokrome', 'SALUD', 'Caminar 30 minutos', 'Haz una caminata de 30 minutos para mejorar tu salud cardiovascular', 'RECURRENT', 'ACTIVE', 2, 25, 7, 1, datetime('now')),
  ('monokrome', 'SALUD', 'Beber 8 vasos de agua', 'Mantente hidratado consumiendo 8 vasos de agua durante el día', 'RECURRENT', 'ACTIVE', 1, 15, 1, 1, datetime('now')),
  ('monokrome', 'SALUD', 'Meditar 10 minutos', 'Dedica 10 minutos a meditar para reducir estrés y mejorar tu bienestar mental', 'RECURRENT', 'ACTIVE', 2, 20, 1, 1, datetime('now')),
  ('monokrome', 'SALUD', 'Hacer 50 flexiones', 'Realiza 50 flexiones para fortalecer tu cuerpo', 'ONCE', 'ACTIVE', 3, 40, NULL, 1, datetime('now')),

-- INSERTAR MISIONES (ENTRETENIMIENTO)
  ('monokrome', 'ENTRETENIMIENTO', 'Ver una película completa', 'Disfruta viendo una película de inicio a fin', 'ONCE', 'ACTIVE', 1, 20, NULL, 1, datetime('now')),
  ('monokrome', 'ENTRETENIMIENTO', 'Jugar videojuegos 1 hora', 'Tómate una hora para disfrutar de tus videojuegos favoritos', 'RECURRENT', 'ACTIVE', 1, 15, 3, 1, datetime('now')),
  ('monokrome', 'ENTRETENIMIENTO', 'Leer un capítulo de un libro', 'Lee al menos un capítulo de cualquier libro que te interese', 'RECURRENT', 'ACTIVE', 2, 25, 2, 1, datetime('now')),
  ('monokrome', 'ENTRETENIMIENTO', 'Dibujar o pintar', 'Crea una obra de arte, ya sea dibujo o pintura', 'ONCE', 'ACTIVE', 2, 30, NULL, 1, datetime('now')),

-- INSERTAR MISIONES (SOCIALES)
  ('monokrome', 'SOCIALES', 'Llamar a un amigo', 'Contacta a un amigo y pasen tiempo juntos hablando', 'RECURRENT', 'ACTIVE', 1, 20, 7, 1, datetime('now')),
  ('monokrome', 'SOCIALES', 'Salir con amigos', 'Pasa tiempo de calidad con tus amigos', 'RECURRENT', 'ACTIVE', 2, 35, 14, 1, datetime('now')),
  ('monokrome', 'SOCIALES', 'Ayudar a un vecino', 'Brinda ayuda a alguien de tu comunidad', 'ONCE', 'ACTIVE', 2, 30, NULL, 1, datetime('now')),
  ('monokrome', 'SOCIALES', 'Hacer una llamada familiar', 'Contacta a tu familia y crea momentos significativos', 'RECURRENT', 'ACTIVE', 1, 25, 7, 1, datetime('now')),

-- INSERTAR MISIONES (NATURALEZA)
  ('monokrome', 'NATURALEZA', 'Plantar una semilla', 'Planta una semilla en una maceta o en el jardín', 'ONCE', 'ACTIVE', 1, 25, NULL, 1, datetime('now')),
  ('monokrome', 'NATURALEZA', 'Salida al parque', 'Visita un parque y disfruta del aire libre', 'RECURRENT', 'ACTIVE', 1, 20, 7, 1, datetime('now')),
  ('monokrome', 'NATURALEZA', 'Limpiar un área verde', 'Recolecta basura en un parque o área natural cercana', 'ONCE', 'ACTIVE', 2, 35, NULL, 1, datetime('now')),
  ('monokrome', 'NATURALEZA', 'Observar aves', 'Dedica tiempo a observar y contar las aves que ves en la naturaleza', 'RECURRENT', 'ACTIVE', 2, 20, 7, 1, datetime('now')),

-- INSERTAR MISIONES (VARIADAS)
  ('monokrome', 'VARIADAS', 'Aprender algo nuevo', 'Dedica tiempo a aprender un nuevo skill o habilidad', 'ONCE', 'ACTIVE', 3, 50, NULL, 1, datetime('now')),
  ('monokrome', 'VARIADAS', 'Cocinar una nueva receta', 'Prepara una receta que nunca hayas hecho antes', 'ONCE', 'ACTIVE', 2, 30, NULL, 1, datetime('now')),
  ('monokrome', 'VARIADAS', 'Resolver un puzzle o acertijo', 'Completa un puzzle o resuelve un acertijo desafiante', 'ONCE', 'ACTIVE', 2, 25, NULL, 1, datetime('now')),
  ('monokrome', 'VARIADAS', 'Organizar tu espacio', 'Ordena y organiza un área de tu casa', 'RECURRENT', 'ACTIVE', 1, 15, 7, 1, datetime('now'));


