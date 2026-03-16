"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Role } from "@/lib/generated/prisma/enums";
import { User } from "@/types";
import { updateUser } from "@/lib/actions/user-action";

interface YourDetailsFormProps {
  user: User;
}

export default function YourDetailsForm({ user: initialUser }: YourDetailsFormProps) {

  const [user, setUser] = useState<User>(initialUser);
  const [image, setImage] = useState<any>(initialUser?.avatar || "default-avatar.png");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImage = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const avatarValue: string = image ?? "default-avatar.png";

    const updatedUser: User = {
      ...user,
      username: (formData.get("username") as string) || user.username,
      firstName: (formData.get("firstName") as string) || user.firstName,
      lastName: (formData.get("lastName") as string) || user.lastName,
      email: (formData.get("email") as string) || user.email,
      avatar: avatarValue,
      password: (formData.get("password") as string) || user.password || "",
      status: user.status,
      role: user.role,
    };

    try {
      const res = await updateUser(updatedUser, user.id as string);

      if (res.success) {
        setUser(updatedUser);
        setDialogOpen(true);
        e.currentTarget.reset();
      } else {
        alert(res.message);
      }

    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Something went wrong while updating your details.");
    }
  };

  return (

    <Card className="border border-emerald-100 shadow-sm">

      <CardHeader>
        <h2 className="text-xl font-semibold text-emerald-900">
          Manage your details
        </h2>
      </CardHeader>

      <CardContent>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* Profile Image */}

          <div className="col-span-2 space-y-2">

            <label className="text-sm font-medium text-emerald-900">
              Profile Image
            </label>

            {image && (
              <img
                src={image}
                className="w-24 h-24 rounded-full object-cover border border-emerald-200 shadow-sm"
              />
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />

          </div> 
          <div className="space-y-2">

            <label className="text-sm font-medium text-emerald-900">
              Username
            </label>

            <Input
              name="username"
              placeholder="Enter your username"
              className="focus-visible:ring-emerald-500"
            />

          </div> 
          <div className="space-y-2">

            <label className="text-sm font-medium text-emerald-900">
              First Name
            </label>

            <Input
              name="firstName"
              placeholder="Enter your first name"
              className="focus-visible:ring-emerald-500"
            />

          </div> 
          <div className="space-y-2">

            <label className="text-sm font-medium text-emerald-900">
              Last Name
            </label>

            <Input
              name="lastName"
              placeholder="Enter your last name"
              className="focus-visible:ring-emerald-500"
            />

          </div> 
          <div className="space-y-2">

            <label className="text-sm font-medium text-emerald-900">
              Role
            </label>

            <Select defaultValue={user.role} disabled>

              <SelectTrigger className="w-full bg-gray-100 cursor-not-allowed">
                <SelectValue placeholder={user.role} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={Role.USER}>USER</SelectItem>
                <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
              </SelectContent>

            </Select>

          </div> 
          <div className="space-y-2">

            <label className="text-sm font-medium text-emerald-900">
              Email
            </label>

            <Input
              name="email"
              type="email"
              placeholder="Enter your email address"
              className="focus-visible:ring-emerald-500"
            />

          </div> 
          <div className="space-y-2">

            <label className="text-sm font-medium text-emerald-900">
             Password
            </label>

            <Input
              name="password"
              type="password"
              placeholder="Enter password"
              className="focus-visible:ring-emerald-500"
            />

          </div> 
          <div className="col-span-2">

            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full">
              Save Details
            </Button>

          </div>

        </form>

      </CardContent> 
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

        <DialogContent className="max-w-sm">

          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>

          <p>Details updated successfully!</p>

        </DialogContent>

      </Dialog>

    </Card>

  );
}