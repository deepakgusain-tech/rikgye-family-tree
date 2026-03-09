"use client";

import { useState } from "react";
import { useFamilyContext } from "@/context/FamilyContext";
import { Relationship, Gender } from "@/types/family";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Role } from "@/lib/generated/prisma/enums";

export default function YourDetails() {
  const { activeFamily, editMember } = useFamilyContext();
  const member = activeFamily?.members[0];

  const [image, setImage] = useState<string | undefined>(member?.imageUrl);
  const [dialogOpen, setDialogOpen] = useState(false); // dialog state

  if (!activeFamily || !member) {
    return <p className="text-center">No active family</p>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const updatedMember = {
      ...member,
      name: formData.get("name") as string,
      gender: formData.get("gender") as Gender,
      relationship: formData.get("role") as Relationship,
      imageUrl: image,
    };

    editMember(activeFamily.id, updatedMember);

    // Open dialog instead of alert
    setDialogOpen(true);

    e.currentTarget.reset(); 
  setImage(undefined);
  };

  const handleImage = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-6">Manage your details</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

        {/* Image */}
        <div className="col-span-2">
          <label className="block mb-2 font-medium">Profile Image</label>

          {image && (
            <img
              src={image}
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block mb-2 font-medium">Username</label>
          <input
            name="username"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2 font-medium">Name</label>
          <input
            name="name"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 font-medium">Role</label>
          <Select name="role" defaultValue={Role.USER} disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={Role.USER}>USER</SelectItem>
              <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 font-medium">Gender</label>
          <select
            name="gender"
            className="w-full border p-2 rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-medium">New Password</label>
          <input
            name="password"
            type="password"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Button */}
        <div className="col-span-2">
          <button className="bg-black text-white px-4 py-2 rounded">
            Save Details
          </button>
        </div>
      </form>

      {/* Dialog for success message */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Details updated successfully!</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}