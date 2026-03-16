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

interface DeleteMemberDialogProps {
  open: boolean;
  member: FamilyMember | null;
  hasChildren: boolean;
  onClose: () => void;
  onConfirm: (deleteChildren: boolean) => void;
}

export const DeleteMemberDialog: React.FC<DeleteMemberDialogProps> = ({
  open,
  member,
  hasChildren,
  onClose,
  onConfirm,
}) => {
  const [deleteChildren, setDeleteChildren] = useState(true);

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
            This action cannot be undone. This will permanently remove{" "}
            <span className="font-medium">{member.name}</span> from the family
            tree.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasChildren && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3 mt-2">
            <Checkbox
              id="delete-children"
              checked={deleteChildren}
              onCheckedChange={(v) => setDeleteChildren(!!v)}
              className="border-emerald-300 data-[state=checked]:bg-emerald-600"
            />

            <Label
              htmlFor="delete-children"
              className="text-sm text-emerald-800 leading-snug cursor-pointer"
            >
              Also delete all descendants
              <span className="block text-xs text-emerald-600">
                Uncheck to reassign children to the parent member.
              </span>
            </Label>
          </div>
        )}

        <AlertDialogFooter className="mt-4 gap-2">

          <AlertDialogCancel
            onClick={onClose}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => onConfirm(deleteChildren)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};