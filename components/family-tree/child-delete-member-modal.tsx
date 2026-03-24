import { FamilyMember } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";

interface ChildDeleteMemberDialogProps {
  open: boolean;
  member: FamilyMember | null;
  hasChildren: boolean;
  onClose: () => void;
  onConfirm: (deleteChildren: boolean) => void;
}

export const ChildDeleteMemberModal: React.FC<ChildDeleteMemberDialogProps> = ({
  open,
  member,
  onClose,
}) => {

  console.log(member);

  if (!member) return null;

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        className="
        rounded-xl 
        border border-emerald-200
        bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),transparent_60%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.15),transparent_60%)]
        bg-white
        shadow-xl
        backdrop-blur
      "
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-emerald-700">
            Delete {member.name}?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-gray-600">
            This action cannot be undone. Because it has descendents
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};