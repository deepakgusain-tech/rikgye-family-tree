"use client";

import React, { useState } from "react";
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

import { Role, Status } from "@/lib/generated/prisma/enums";
import { User } from "@/types";
import { updateProfile, updateUser } from "@/lib/actions/user-action";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { updateUserSchema, userSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ArrowRight, Loader } from "lucide-react";
import { prisma } from "@/lib/db/prisma-helper";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface YourDetailsFormProps {
  user: User;
}

export default function YourDetailsForm({ user }: YourDetailsFormProps) {

  const router = useRouter()
  const { update } = useSession();

  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (
    values: any,
  ) => {

    startTransition(async () => {
      let res;

      if (values.avatar instanceof File) {
        const formData = new FormData();
        formData.append("avatar", values.avatar);
        formData.append("key", "avatar");

        const fileUploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await fileUploadRes.json();

        values.avatar = data.url;
      }

      res = await updateProfile(values, user.id as string)


      if (res.success) {

        await update({
          name: values.firstName,
          image: values.avatar,
        });

        setDialogOpen(true);
        router.refresh()
      } else {
        alert(res.message);
      }
    });
  };

  return (

    <Card className="border border-emerald-100 shadow-sm">

      <CardHeader>
        <h2 className="text-xl font-semibold text-emerald-900">
          Manage your details
        </h2>
      </CardHeader>

      <CardContent>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors),
            )}
          >
            <div className="grid grid-cols-2 gap-4">

              <div className="flex flex-col gap-5 col-span-2">
                
                {user?.avatar && (
                  <div className="mt-4">
                    <img
                      src={"/api/" + user.avatar}
                      alt=""
                      height={100}
                      width={100}
                      className="w-24 h-24 rounded-full object-cover border border-emerald-200 shadow-sm"
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="firstName">First name</FormLabel>
                      <FormControl>
                        <Input
                          id="firstName"
                          placeholder="Enter First name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lastName">Last name</FormLabel>
                      <FormControl>
                        <Input
                          id="lastName"
                          placeholder="Enter Last Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input id="email" disabled placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          disabled
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={(v) => field.onChange(v as Role)}
                          disabled
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Role.USER}>USER</SelectItem>
                            <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white  cursor-pointerflex items-center ">
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>

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