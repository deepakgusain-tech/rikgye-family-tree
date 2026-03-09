"use client";

import { FamilyProvider } from "@/context/FamilyContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FamilyProvider>
      {children}
    </FamilyProvider>
  );
}