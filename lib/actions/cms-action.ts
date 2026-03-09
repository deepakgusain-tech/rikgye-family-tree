"use server";

import { z } from "zod";
import { prisma } from "../db/prisma-helper";
import { cmsSchema, loginFormSchema, userSchema } from "../validators";
import { formatError } from "../utils";


// get users
export async function getPages() {
   return await prisma.page.findMany({
      orderBy: {
         createdAt: "desc",
      },
   })
}

// create user
export async function createPage(data: z.infer<typeof cmsSchema>) {

   try {
      const page = cmsSchema.parse(data)

      const imageValue = page.pageIcon instanceof File ? page.pageIcon.name : page.pageIcon ?? null

      await prisma.page.create({
         data: {
            pageTitle: page.pageTitle,
            pageIcon: imageValue,
            pageContent: page.pageContent,
            status: page.status,
         }
      })

      return {
         success: true,
         message: "Page created successfully"
      }

   } catch (error) {
      return {
         success: false,
         message: formatError(error)
      }
   }
}

// get page by id
export async function getPageById(id: string) {
   try {

      let page = await prisma.page.findFirst({
         where: { id }
      })

      if (page) {
         return {
            success: true,
            data: page,
            message: "Page get successfully"
         }
      }

      return {
         success: false,
         message: "Page not found"
      }

   } catch (error) {
      return {
         success: false,
         message: formatError(error)
      }
   }
}

// update page
export async function updatePage(data: z.infer<typeof cmsSchema>, id: string) {
   try {

      const page = cmsSchema.parse(data)

      const imageValue = page.pageIcon instanceof File ? page.pageIcon.name : page.pageIcon ?? null

      let pageData = await prisma.page.findFirst({
         where: { id }
      })

      if (!pageData) {
         return {
            success: false,
            message: "Page not found"
         }
      }

      await prisma.page.update({
         where: { id },
         data: {
            pageTitle: page.pageTitle,
            pageIcon: imageValue,
            pageContent: page.pageContent,
            status: page.status,
         }
      })

      return {
         success: true,
         message: "Page updated successfully"
      }

   } catch (error) {
      return {
         success: false,
         message: formatError(error)
      }
   }
}

// delete page
export async function deletePage(id: any) {
   try {
      await prisma.page.delete({
         where: { id }
      })

      return {
         success: true,
         message: "Page deleted successfully"
      }

   } catch (error) {
      return {
         success: false,
         message: formatError(error)
      }
   }
}
