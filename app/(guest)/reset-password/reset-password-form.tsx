"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { passwordSchema } from "@/lib/validators"
import { updatePassword } from "@/lib/actions/user-action"

import { z } from "zod"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

type FormData = z.infer<typeof passwordSchema>

export function ResetPasswordForm({
  className,
  userId,
  ...props
}: React.ComponentProps<"div"> & { userId: string }) {

  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  })

  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {

      await updatePassword(userId, data.newPassword)

      setDialogOpen(true)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full flex bg-emerald-50",
        className
      )}
      {...props}
    >

      <div className="hidden lg:flex w-[35%] flex-col justify-center bg-emerald-700 text-white p-14">

        <div className="max-w-sm space-y-6">

          <h1 className="text-4xl font-bold leading-tight">
            Family Tree Manager
          </h1>

          <p className="text-emerald-100 text-lg">
            Secure your account and continue preserving your family's history.
          </p>

          <div className="space-y-3 text-sm text-emerald-200 pt-2">

            <p>Protect your family records</p>
            <p> Secure access to your account</p>
            <p> Manage generations with confidence</p>
            <p> Safe password management</p>

          </div>

        </div>

      </div>

      <div className="w-full lg:w-[65%] flex items-center justify-center px-8 py-12">

        <div className="w-full max-w-md">

          <Card className="shadow-xl border border-emerald-200">

            <CardHeader className="space-y-2 text-center">

              <CardTitle className="text-2xl font-semibold text-gray-800">
                Reset Password
              </CardTitle>

              <CardDescription>
                Enter your new password below
              </CardDescription>

            </CardHeader>

            <CardContent>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >

                <FieldGroup>

                  <Field>

                    <FieldLabel htmlFor="newPassword">
                      New Password
                    </FieldLabel>

                    <Input
                      id="newPassword"
                      type="password"
                      {...register("newPassword")}
                      className="h-11"
                    />

                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}

                  </Field>

                  <Field>

                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>

                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      className="h-11"
                    />

                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}

                  </Field>

                  <Field className="pt-2">

                    <Button
                      type="submit"
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Update Password
                    </Button>

                  </Field>

                </FieldGroup>

              </form>

            </CardContent>

          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            © {new Date().getFullYear()} Family Tree Manager
          </p>

        </div>

      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

        <DialogContent className="max-w-sm border border-emerald-200 shadow-lg">

          <DialogHeader className="items-center text-center space-y-3">

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />

              </svg>

            </div>

            <DialogTitle className="text-xl font-semibold text-gray-800">
              Password Updated
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Your password has been successfully updated.
            </DialogDescription>

          </DialogHeader>

          <DialogFooter className="mt-4">

            <Button
              onClick={() => {
                setDialogOpen(false)
                router.push("/")
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Back to Login
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  )
}