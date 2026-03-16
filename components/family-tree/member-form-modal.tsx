"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FamilyMember } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { createFamilyMember } from "@/lib/actions/family-member";
import { Gender } from "@/lib/generated/prisma/enums";
import { familyMemberSchema } from "@/lib/validators";
import { familyMemberDefaultValues } from "@/lib/contants";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import z from "zod";
import { useEffect } from "react";

type FormData = z.infer<typeof familyMemberSchema>;

interface MemberFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FamilyMember) => void;
  existingMembers: FamilyMember[];
  editingMember: FamilyMember | null;
  defaultParentId: string | null;
}

const MemberFormModal = ({
  open,
  onClose,
  onSubmit,
  existingMembers,
  editingMember,
  defaultParentId,
}: MemberFormModalProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(familyMemberSchema) as any,
    defaultValues: editingMember
      ? { ...familyMemberDefaultValues, ...editingMember }
      : { ...familyMemberDefaultValues, parentId: defaultParentId ?? null },
  });

  useEffect(() => {
    if (editingMember) {
      form.reset(editingMember);
    } else {
      form.reset({
        ...familyMemberDefaultValues,
        parentId: defaultParentId ?? null,
      });
    }
  }, [editingMember, defaultParentId]);

  const handleFormSubmit: SubmitHandler<FormData> = async (values) => {

    const imageUrl = typeof values.image === "string" ? values.image : "";
    if (!editingMember) {
      const newMember: any = await createFamilyMember({
        ...values,
        image: imageUrl,
        gender: values.gender ?? Gender.OTHER,
        parentId: values.parentId ?? null,
        userId: values.userId ?? null,
      });
      onSubmit(newMember);

    }
    else {
      const updatedMember: any = await updateFamilyMember({
        ...editingMember,
        ...values,
        image: imageUrl,
        gender: values.gender ?? Gender.OTHER,
        parentId: values.parentId ?? null,
        userId: values.userId ?? null,
      });
      onSubmit(updatedMember);

    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="theme-scrollbar sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-emerald-200 bg-emerald-50 p-0 shadow-lg [&>button]:hidden">
        <DialogHeader className="bg-emerald-700 text-white px-6 py-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {editingMember ? "Edit Member" : "Add Family Member"}
          </DialogTitle>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-emerald-600 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </DialogHeader>

        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleFormSubmit)}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full name"
                          className="border-emerald-200 focus-visible:ring-emerald-500 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* IMAGE */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="border-emerald-200 focus-visible:ring-emerald-500 bg-white"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };

                            reader.readAsDataURL(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* GENDER */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">Gender</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-emerald-200 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>Male</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          <SelectItem value={Gender.OTHER}>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BIRTH DATE */}
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Birth Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BIRTH PLACE */}
                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Birth Place
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Birth place"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAlive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between border border-emerald-200 rounded-lg p-3 bg-white">
                      <FormLabel className="m-0 text-emerald-800">
                        Is Alive
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Current Residence
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City / Country"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="causeOfDeath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Cause of Death
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cause of death"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marriageDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Marriage Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marriagePlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Marriage Place
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Marriage place"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spouseMaidenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Spouse Maiden Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spouse maiden name"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spouseFather"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Spouse Father
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spouse father name"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spouseMother"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Spouse Mother
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spouse mother name"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">
                        Profession
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Profession"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-800">Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone number"
                          className="border-emerald-200 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={() => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-emerald-800">Parent</FormLabel>

                      <Select
                        value={form.getValues("parentId") ?? "__none__"}
                        onValueChange={(v) =>
                          form.setValue("parentId", v === "__none__" ? null : v)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="border-emerald-200 bg-white">
                            <SelectValue placeholder="None (root)" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="__none__">None (root)</SelectItem>

                          {existingMembers
                            .filter((m) => m && m.id)
                            .map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormModal;
