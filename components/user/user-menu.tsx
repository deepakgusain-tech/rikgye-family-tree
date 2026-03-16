"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logoutUser } from "@/lib/actions/user-action";
import Image from "next/image";
import defaultImage from "@/assets/images/no_profile_pic.jpg";
import Link from "next/link";

import { CircleUser, SlidersHorizontal, LogOut } from "lucide-react";

const UserMenu = ({ user }: { user: any }) => {
  let image = defaultImage;

  if (user.image) {
    image = user.image;
  }

  return (
    <DropdownMenu modal={false}>
       
      <DropdownMenuTrigger asChild>
        <Image
          src={image}
          height={36}
          width={36}
          alt={user.name}
          className="rounded-full border-2 border-emerald-500 object-cover cursor-pointer hover:scale-105 transition"
        />
      </DropdownMenuTrigger>
 
      <DropdownMenuContent
        align="end"
        className="w-48 border border-emerald-100 shadow-md"
      >

        {user.role === "ADMIN" && (
          <>
            {/* Profile */}

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/admin/profile"
                className="flex items-center gap-2"
              >
                <CircleUser size={16} />
                Profile
              </Link>
            </DropdownMenuItem>
 
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/admin/settings"
                className="flex items-center gap-2"
              >
                <SlidersHorizontal size={16} />
                Settings
              </Link>
            </DropdownMenuItem>
          </>
        )}
 
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-600 flex items-center gap-2"
          onClick={() => logoutUser()}
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;