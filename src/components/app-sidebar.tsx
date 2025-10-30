"use client"

import { Home, BookOpen, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Mis misiones",
    url: "/misiones",
    icon: BookOpen,
  },
  {
    title: "Mis misiones",
    url: "/misiones",
    icon: BookOpen,
  },
  {
    title: "Mi perfil",
    url: "/perfil",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gray-950 border-r-2 border-purple-500/30">
      <SidebarHeader className="bg-gray-950 p-6 border-b-2 border-purple-500/30">
        <h2 className="text-purple-400 text-xl font-bold px-2 tracking-wide">BARRA LATERAL</h2>
      </SidebarHeader>
      <SidebarContent className="bg-gray-950">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 px-4 pt-6">
              {items.map((item, index) => (
                <SidebarMenuItem key={`${item.title}-${index}`}>
                  <SidebarMenuButton 
                    asChild
                    className="bg-gray-900 border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-purple-500 hover:text-purple-400 py-6 text-base font-semibold justify-start rounded-sm transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

