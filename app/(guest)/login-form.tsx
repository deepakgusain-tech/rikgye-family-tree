"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useActionState, useEffect, useState } from "react"
import { loginFormUser } from "@/lib/actions/user-action"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [data, action] = useActionState(loginFormUser, {
    success: false,
    message: "",
  })

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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
            Build and explore your family's history.  
            Organize generations, preserve memories, and visualize your family connections.
          </p>

          <div className="space-y-3 text-sm text-emerald-200 pt-2">

            <p> Visualize your family hierarchy</p>
            <p> Add generations and relationships</p>
            <p> Preserve your family history</p>
            <p> Secure and private family records</p>

          </div>

        </div>

      </div>
      <div className="w-full lg:w-[65%] flex items-center justify-center px-8 py-12">

        <div className="w-full max-w-md">

          <Card className="shadow-xl border border-emerald-200">

            <CardHeader className="space-y-2 text-center">

              <CardTitle className="text-2xl font-semibold text-gray-800">
                Sign in to your account
              </CardTitle>

              <CardDescription>
                Access and manage your family tree
              </CardDescription>

              {data && !data.success && (
                <p className="text-sm text-destructive mt-2">
                  {data.message}
                </p>
              )}

            </CardHeader>

            <CardContent>

              <form action={action} className="space-y-5">

                <FieldGroup>
                  <Field>

                    <FieldLabel htmlFor="username">
                      Username
                    </FieldLabel>

                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      placeholder="Enter your username"
                      className="h-11"
                    />
                  </Field>

                  <Field>

                    <div className="flex items-center justify-between">

                      <FieldLabel htmlFor="password">
                        Password
                      </FieldLabel>

                      <a
                        href="/forgot-password"
                        className="text-sm text-emerald-600 hover:text-emerald-800"
                      >
                        Forgot password?
                      </a>

                    </div>

                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter your password"
                      className="h-11"
                    />
                  </Field>
                  <Field className="pt-2">

                    <Button
                      type="submit"
                      className="w-full h-11 font-medium bg-emerald-600 hover:bg-emerald-700"
                    >
                      Sign In
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

    </div>
  )
}