"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { ChevronDownIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useForm, useFieldArray } from "react-hook-form"

interface SubTask {
  title: string
  description?: string
  difficulty: number
  experienceReward: number
  type: "ONCE" | "RECURRENT"
  recurrency?: number
}

interface CreateProjectFormData {
  title: string
  description?: string
  experienceReward: number
  subTasks: SubTask[]
}

interface Project {
  id: string
  userId: string
  title: string
  description?: string
  experienceReward?: number
  status: string
  tasks: unknown[]
}

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated?: () => void
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectModalProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = React.useState(false)
  const [expandedSubTasks, setExpandedSubTasks] = React.useState<number[]>([])

  const form = useForm<CreateProjectFormData>({
    defaultValues: {
      title: "",
      description: "",
      experienceReward: 100,
      subTasks: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subTasks",
  })

  const onSubmit = async (data: CreateProjectFormData) => {
    if (!user?.id) {
      console.error("Usuario no autenticado")
      return
    }

    try {
      setIsLoading(true)

      // Crear el proyecto
      const projectResponse = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: data.title,
          description: data.description,
          experienceReward: data.experienceReward,
          status: "ACTIVE",
        }),
      })

      if (!projectResponse.ok) {
        throw new Error("Error al crear el proyecto")
      }

      const createdProject = (await projectResponse.json()) as Project

      // Crear las subtareas asociadas al proyecto
      if (data.subTasks && data.subTasks.length > 0) {
        for (const subTask of data.subTasks) {
          await fetch("/api/tasks/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              projectId: createdProject.id,
              title: subTask.title,
              description: subTask.description,
              difficulty: subTask.difficulty,
              experienceReward: subTask.experienceReward,
              type: subTask.type,
              recurrency: subTask.type === "RECURRENT" ? subTask.recurrency : undefined,
              status: "ACTIVE",
            }),
          })
        }
      }

      console.log("Proyecto creado exitosamente")
      form.reset()
      setExpandedSubTasks([])
      onOpenChange(false)
      onProjectCreated?.()
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSubTaskExpanded = (index: number) => {
    setExpandedSubTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
          <DialogDescription>
            Crea un proyecto y añade subtareas para organizarte mejor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Nombre del proyecto */}
            <Field>
              <FieldLabel htmlFor="project-title">Título del Proyecto</FieldLabel>
              <Input
                id="project-title"
                placeholder="Mi nuevo proyecto..."
                {...form.register("title", {
                  required: "El título es requerido",
                })}
              />
              {form.formState.errors.title && (
                <FieldError errors={[form.formState.errors.title]} />
              )}
            </Field>

            {/* Descripción */}
            <Field>
              <FieldLabel htmlFor="project-description">Descripción (opcional)</FieldLabel>
              <Textarea
                id="project-description"
                placeholder="Describe tu proyecto..."
                className="min-h-[100px]"
                {...form.register("description")}
              />
            </Field>

            {/* Recompensa de experiencia */}
            <Field>
              <FieldLabel htmlFor="project-xp">Experiencia (XP)</FieldLabel>
              <Input
                id="project-xp"
                type="number"
                min="0"
                defaultValue="100"
                {...form.register("experienceReward", {
                  required: "La recompensa es requerida",
                  valueAsNumber: true,
                  min: { value: 0, message: "Debe ser mayor o igual a 0" },
                })}
              />
              {form.formState.errors.experienceReward && (
                <FieldError errors={[form.formState.errors.experienceReward]} />
              )}
            </Field>
          </FieldGroup>

          {/* Subtareas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Subtareas</h3>
              <Button
                type="button"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    difficulty: 1,
                    experienceReward: 10,
                    type: "ONCE",
                    recurrency: undefined,
                  })
                }
                variant="outline"
                size="sm"
                className="bg-purple-600/20 border-purple-500 text-purple-400 hover:bg-purple-600/30"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Añadir Subtarea
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 bg-gray-900/50 rounded-md border-2 border-gray-700">
                <p className="text-gray-400">No hay subtareas aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <Collapsible
                    key={field.id}
                    open={expandedSubTasks.includes(index)}
                    onOpenChange={() => toggleSubTaskExpanded(index)}
                  >
                    <div className="bg-gray-900/50 border-2 border-gray-700 rounded-md overflow-hidden">
                      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer bg-transparent border-0">
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <ChevronDownIcon
                            className={`w-4 h-4 text-purple-400 transition-transform ${
                              expandedSubTasks.includes(index)
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                          <span className="text-gray-200 truncate">
                            {form.watch(`subTasks.${index}.title`) ||
                              `Subtarea ${index + 1}`}
                          </span>
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation()
                            remove(index)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              e.stopPropagation()
                              remove(index)
                            }
                          }}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="px-4 pb-4 pt-2 space-y-4 bg-gray-950/30 border-t border-gray-700">
                        <Field>
                          <FieldLabel htmlFor={`subtask-title-${index}`}>
                            Título
                          </FieldLabel>
                          <Input
                            id={`subtask-title-${index}`}
                            placeholder="Título de la subtarea..."
                            {...form.register(`subTasks.${index}.title`, {
                              required: "El título es requerido",
                            })}
                          />
                          {form.formState.errors.subTasks?.[index]?.title && (
                            <FieldError
                              errors={[
                                form.formState.errors.subTasks[index]?.title,
                              ]}
                            />
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor={`subtask-description-${index}`}>
                            Descripción (opcional)
                          </FieldLabel>
                          <Textarea
                            id={`subtask-description-${index}`}
                            placeholder="Descripción de la subtarea..."
                            className="min-h-[80px] resize-none"
                            {...form.register(`subTasks.${index}.description`)}
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor={`subtask-type-${index}`}>
                            Tipo de Tarea
                          </FieldLabel>
                          <select
                            id={`subtask-type-${index}`}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            {...form.register(`subTasks.${index}.type`)}
                          >
                            <option value="ONCE">Una sola vez</option>
                            <option value="RECURRENT">Recurrente</option>
                          </select>
                        </Field>

                        {form.watch(`subTasks.${index}.type`) === "RECURRENT" && (
                          <Field>
                            <FieldLabel htmlFor={`subtask-recurrency-${index}`}>
                              Recurrencia (días)
                            </FieldLabel>
                            <Input
                              id={`subtask-recurrency-${index}`}
                              type="number"
                              min="1"
                              placeholder="Cada cuántos días se repite..."
                              {...form.register(
                                `subTasks.${index}.recurrency`,
                                {
                                  valueAsNumber: true,
                                  min: { value: 1, message: "Mínimo 1 día" },
                                }
                              )}
                            />
                            {form.formState.errors.subTasks?.[index]?.recurrency && (
                              <FieldError
                                errors={[
                                  form.formState.errors.subTasks[index]?.recurrency,
                                ]}
                              />
                            )}
                          </Field>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel htmlFor={`subtask-difficulty-${index}`}>
                              Dificultad
                            </FieldLabel>
                            <Input
                              id={`subtask-difficulty-${index}`}
                              type="number"
                              min="1"
                              max="5"
                              defaultValue="1"
                              {...form.register(
                                `subTasks.${index}.difficulty`,
                                {
                                  valueAsNumber: true,
                                  min: { value: 1, message: "Mínimo 1" },
                                  max: { value: 5, message: "Máximo 5" },
                                }
                              )}
                            />
                          </Field>

                          <Field>
                            <FieldLabel htmlFor={`subtask-xp-${index}`}>
                              XP
                            </FieldLabel>
                            <Input
                              id={`subtask-xp-${index}`}
                              type="number"
                              min="0"
                              defaultValue="10"
                              {...form.register(
                                `subTasks.${index}.experienceReward`,
                                {
                                  valueAsNumber: true,
                                  min: { value: 0, message: "Mínimo 0" },
                                }
                              )}
                            />
                          </Field>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500"
            >
              {isLoading ? "Creando..." : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

