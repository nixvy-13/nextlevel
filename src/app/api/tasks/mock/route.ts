import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker/locale/es';

// Tipos basados en el schema de Prisma
type TaskType = 'ONCE' | 'RECURRENT';

interface Category {
  id: number;
  name: string;
  description: string | null;
}

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
  categoryId: number | null;
  title: string;
  description: string | null;
  type: TaskType;
  difficulty: number;
  experienceReward: number;
  recurrencePattern: string | null;
  recurrenceInterval: number | null;
  isDefault: boolean;
  createdAt: string;
  category?: Category;
  project?: Project;
}

// Generar categorías mock
const generateCategories = (): Category[] => {
  const categoryNames = [
    'Desarrollo Personal',
    'Fitness y Salud',
    'Aprendizaje',
    'Trabajo',
    'Hogar',
    'Social',
    'Creatividad',
    'Finanzas'
  ];

  return categoryNames.map((name, index) => ({
    id: index + 1,
    name,
    description: faker.lorem.sentence()
  }));
};

// Generar proyectos mock
const generateProjects = (userId: string): Project[] => {
  return Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    userId,
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraph(),
    isPublic: faker.datatype.boolean(),
    createdAt: faker.date.past({ years: 1 }).toISOString()
  }));
};

// Generar tareas mock
const generateTasks = (
  count: number,
  userId: string,
  categories: Category[],
  projects: Project[]
): Task[] => {
  return Array.from({ length: count }, (_, index) => {
    const taskType: TaskType = faker.helpers.arrayElement(['ONCE', 'RECURRENT']);
    const category = faker.helpers.arrayElement([...categories, null]);
    const project = faker.helpers.arrayElement([...projects, null, null]); // Más probabilidad de null
    const difficulty = faker.number.int({ min: 1, max: 5 });
    
    return {
      id: index + 1,
      userId,
      projectId: project?.id ?? null,
      categoryId: category?.id ?? null,
      title: faker.hacker.phrase(),
      description: faker.lorem.sentences(2),
      type: taskType,
      difficulty,
      experienceReward: difficulty * 10,
      recurrencePattern: taskType === 'RECURRENT' ? faker.helpers.arrayElement(['daily', 'weekly', 'monthly']) : null,
      recurrenceInterval: taskType === 'RECURRENT' ? faker.number.int({ min: 1, max: 7 }) : null,
      isDefault: faker.datatype.boolean({ probability: 0.1 }),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      category: category ?? undefined,
      project: project ?? undefined
    };
  });
};

export async function GET() {
  try {
    // Simular un userId para las demos
    const mockUserId = 'user_demo_123';
    
    // Generar datos mock
    const categories = generateCategories();
    const projects = generateProjects(mockUserId);
    const tasks = generateTasks(15, mockUserId, categories, projects);

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        categories,
        projects,
        user: {
          clerkId: mockUserId,
          experience: faker.number.int({ min: 0, max: 10000 }),
          level: faker.number.int({ min: 1, max: 50 }),
          createdAt: faker.date.past({ years: 2 }).toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error generando datos mock:', error);
    return NextResponse.json(
      { success: false, error: 'Error generando datos mock' },
      { status: 500 }
    );
  }
}

