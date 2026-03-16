import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FamilyMember, Gender, Relationship } from "@/types/family";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const relationships: Relationship[] = [
  "Father", "Mother", "Son", "Daughter",
  "Grandfather", "Grandmother", "Grandson", "Granddaughter",
  "Spouse", "Sibling", "Uncle", "Aunt", "Cousin", "Other",
];

const genders: Gender[] = ["male", "female", "other"];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  relationship: z.string().min(1, "Relationship is required"),
  parentId: z.string().nullable(),
});

type FormData = z.infer<typeof schema>;

interface MemberFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FamilyMember, "id">) => void;
  existingMembers: FamilyMember[];
  editingMember?: FamilyMember | null;
  defaultParentId?: string | null;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  existingMembers,
  editingMember,
  defaultParentId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      gender: "male",
      dateOfBirth: "",
      relationship: "Son",
      parentId: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (editingMember) {
        reset({
          name: editingMember.name,
          gender: editingMember.gender,
          dateOfBirth: editingMember.dateOfBirth,
          relationship: editingMember.relationship,
          parentId: editingMember.parentId,
        });
      } else {
        reset({
          name: "",
          gender: "male",
          dateOfBirth: "",
          relationship: "Son",
          parentId: defaultParentId ?? null,
        });
      }
    }
  }, [open, editingMember, defaultParentId, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      name: data.name,
      gender: data.gender as Gender,
      dateOfBirth: data.dateOfBirth,
      relationship: data.relationship as Relationship,
      parentId: data.parentId || null,
    });
    onClose();
  };

  const watchGender = watch("gender");
  const watchRelationship = watch("relationship");
  const watchParentId = watch("parentId");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editingMember ? "Edit Member" : "Add Family Member"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="Full name" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Gender</Label>
              <Select value={watchGender} onValueChange={(v) => setValue("gender", v as Gender)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          <div>
            <Label>Relationship</Label>
            <Select value={watchRelationship} onValueChange={(v) => setValue("relationship", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {relationships.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Parent</Label>
            <Select value={watchParentId ?? "__none__"} onValueChange={(v) => setValue("parentId", v === "__none__" ? null : v)}>
              <SelectTrigger><SelectValue placeholder="None (root)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None (root member)</SelectItem>
                {existingMembers
                  .filter((m) => !editingMember || m.id !== editingMember.id)
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingMember ? "Save Changes" : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormModal;
