import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Esquema de validación para una subtarea sugerida
const SubTaskSchema = z.object({
  title: z.string().describe('Título de la subtarea'),
  description: z.string().describe('Descripción detallada de la subtarea'),
  type: z.enum(['ONCE', 'RECURRENT']).describe('Tipo de tarea: ONCE (una sola vez) o RECURRENT (recurrente)'),
  recurrency: z.number().optional().describe('Si es recurrente, cada cuántos días se repite'),
  difficulty: z.number().int().min(1).max(5).describe('Nivel de dificultad de 1 a 5'),
  experienceReward: z.number().int().min(1).max(100).describe('Recompensa de experiencia de 1 a 100'),
});

// Esquema para la respuesta completa
const SuggestedSubTasksSchema = z.object({
  subtasks: z.array(SubTaskSchema).describe('Array de subtareas sugeridas'),
});

export const maxDuration = 30;

interface SuggestSubTasksRequest {
  projectDescription: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Autenticación requerida' },
        { status: 401 }
      );
    }

    const { projectDescription } = (await req.json()) as SuggestSubTasksRequest;

    console.log('projectDescription', projectDescription);
    
    if (!projectDescription) {
      return NextResponse.json(
        { error: 'La descripción del proyecto es requerida' },
        { status: 400 }
      );
    }

    // Generar sugerencias usando Vercel AI SDK con OpenRouter
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = await generateObject({
      model: openrouter.chat('openai/gpt-4o-mini'),
      schema: SuggestedSubTasksSchema,
      prompt: `
Tu tarea es analizar la siguiente descripción de proyecto y sugerir subtareas concretas y realistas para completarlo.

Descripción del Proyecto:
${projectDescription}

Genera entre 3 y 5 subtareas que sean realistas y prácticas para completar este proyecto. 

Para cada subtarea, considera:
- Debe ser una tarea concreta, medible y accionable
- Si es recurrente (como hacer ejercicio diariamente), usa tipo RECURRENT con el número de días
- Si es una tarea única, usa tipo ONCE
- La dificultad debe reflejar el esfuerzo requerido (1 = muy fácil, 5 = muy difícil)
- La recompensa XP debe ser proporcional a la dificultad (1-100)
- El título debe ser claro y conciso
- La descripción debe explicar específicamente qué hay que hacer

Asegúrate de que las subtareas sean coherentes con la descripción del proyecto proporcionada.

Genera las subtareas en español.
      `,
    });

    return NextResponse.json(result.object, { status: 200 });
  } catch (error) {
    console.error('Error al generar sugerencias de subtareas:', error);
    
    // Error específico si no hay API key configurada
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Configuración de API no disponible' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al generar sugerencias' },
      { status: 500 }
    );
  }
}

