"use client";

import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Logo } from "@/components/ui/logo-collapse";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { IconDashboard, IconSitemap, IconUser, IconUserCircle } from "@tabler/icons-react";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const items = [
  { title: "Home", url: "/home", icon: HomeIcon },
  { title: "Known Rikhye", url: "/prominent", icon: IconDashboard },
  { title: "Find Rikhye", url: "/findmember", icon: IconUser },
  { title: "Your Details", url: "/your-details", icon: IconUserCircle },
];

const UserSideBar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="flex flex-col ">

  
      <SidebarHeader className="">
        <div className="flex items-center">
          <Logo />
        </div>
      </SidebarHeader>

      
      <div className=" pb-3 shrink-0">
        <div className="h-px w-full bg-emerald-200 rounded-full" />
      </div>

     
      <SidebarContent className="flex-1 px-2">
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`
                          cursor-pointer transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2
                          
                          ${
                            isActive
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                          }
                        `}
                      >
                        {item.icon && (
                          <item.icon className="h-5 w-5 shrink-0" />
                        )}
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

    </Sidebar>
  );
};

export default UserSideBar;