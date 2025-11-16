import { getDbAsync } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface UpdateProjectRequest {
  projectId: number;
  title?: string;
  description?: string;
  experienceReward?: number;
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as UpdateProjectRequest;
    const { projectId, title, description, experienceReward } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "ID del proyecto es requerido" },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Verificar que el proyecto pertenece al usuario
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar (solo campos definidos)
    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (experienceReward !== undefined)
      updateData.experienceReward = experienceReward;

    // Actualizar el proyecto
    const updatedProject = await db.project.update({
      where: {
        id: projectId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proyecto" },
      { status: 500 }
    );
  }
}
