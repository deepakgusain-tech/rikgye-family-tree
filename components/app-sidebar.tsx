"use client"

import * as React from "react"
import {
  HomeIcon,
  Settings2Icon,
} from "lucide-react"

import {
  IconAddressBook,
  IconDashboard,
  IconPageBreak,
  IconSitemap,
  IconUser,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { Logo } from "./ui/logo-collapse"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

 
const data = {
  navMain: [
    {
      title: "Home",
      url: "/admin/home",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "Users",
      url: "/admin/user",
      icon: IconUser,
      isActive: true,
    },
    {
      title: "Families",
      url: "/admin/familes",
      icon: IconSitemap,
      isActive: true,
    },
    {
      title: "Find Rikhye",
      url: "/admin/findmember",
      icon: IconAddressBook,
      isActive: true,
    },
    {
      title: "Pages",
      url: "/admin/cms",
      icon: IconPageBreak,
      isActive: true,
    },
    {
      title: "General Settings",
      url: "/admin/settings",
      icon: Settings2Icon,
      isActive: true,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-green-200 bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50
      dark:from-green-950 dark:via-emerald-950 dark:to-green-900
      backdrop-blur-xl"
      {...props}
    >
       
      <SidebarHeader className="border-b border-green-200 px-4">
        <Logo />
      </SidebarHeader>
 
      <SidebarContent
        className="
        px-2 py-4
        [&_[data-sidebar=menu-button]]:rounded-xl
        [&_[data-sidebar=menu-button]]:transition-all
        [&_[data-sidebar=menu-button]]:duration-200
        [&_[data-sidebar=menu-button]]:text-green-800
        [&_[data-sidebar=menu-button]]:hover:bg-green-100
        [&_[data-sidebar=menu-button]]:hover:text-green-900
        dark:[&_[data-sidebar=menu-button]]:text-green-200
        dark:[&_[data-sidebar=menu-button]]:hover:bg-green-900
      "
      >
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}