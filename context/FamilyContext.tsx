"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { FamilyMember } from "@/types";
import { getFamilyMembers } from "@/lib/actions/family-member.client";

export interface Family {
  id: string;
  name: string;
  members: FamilyMember[];
}

interface FamilyContextType {
  families: Family[];
  activeFamily: Family | null;
  setActiveFamilyId: (id: string) => void;
  addFamily: (name: string) => void;
  editFamilyName: (id: string, name: string) => void;
  deleteFamily: (id: string) => void;

  addMember: (familyId: string, member: FamilyMember) => void;

  editMember: (familyId: string, member: FamilyMember) => void;
  deleteMember: (
    familyId: string,
    memberId: string,
    deleteChildren: boolean
  ) => void;
}


const FamilyContext = createContext<FamilyContextType | null>(null);

export const useFamilyContext = () => {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamilyContext must be used within FamilyProvider");
  return ctx;
};

let nextFamilyId = 1;
let nextMemberId = 1;
const genFamilyId = () => `family-${nextFamilyId++}`;
const genMemberId = () => `m${nextMemberId++}`;

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [activeFamilyId, setActiveFamilyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const tree = await getFamilyMembers();

      const flatten = (nodes: any[]): any[] =>
        nodes.flatMap((node) => [
          { ...node, children: undefined },
          ...(node.children ? flatten(node.children) : []),
        ]);

      const members = tree?.length ? flatten(tree) : [];

      const familyId = genFamilyId();

      setFamilies([
        {
          id: familyId,
          name: "My Family",
          members,
        },
      ]);

      setActiveFamilyId(familyId);
    };

    fetchMembers();
  }, []);

  const activeFamily = families.find((f) => f.id === activeFamilyId) ?? null;

  const addFamily = useCallback((name: string) => {
    const id = genFamilyId();
    setFamilies((prev) => [...prev, { id, name, members: [] }]);
    setActiveFamilyId(id);
  }, []);

  const editFamilyName = useCallback((id: string, name: string) => {
    setFamilies((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }, []);

  const deleteFamily = useCallback(
    (id: string) => {
      setFamilies((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (activeFamilyId === id && next.length > 0) setActiveFamilyId(next[0].id);
        return next;
      });
    },
    [activeFamilyId]
  );

  const updateMembers = useCallback(
    (familyId: string, updater: (members: FamilyMember[]) => FamilyMember[]) => {
      setFamilies((prev) =>
        prev.map((family) => {
          if (family.id !== familyId) return family;

          const safeMembers = (family.members ?? []).filter(Boolean);

          return {
            ...family,
            members: updater(safeMembers),
          };
        })
      );
    },
    []
  );

  const addMember = (familyId: string, member: FamilyMember) => {
    setFamilies((prev) =>
      prev.map((family) =>
        family.id === familyId
          ? {
            ...family,
            members: [...family.members, member],
          }
          : family
      )
    );
  };

  const editMember = useCallback(
    (familyId: string, member: FamilyMember | undefined) => {
      if (!member || !member.id) return;

      updateMembers(familyId, (members) =>
        members
          .filter((m) => m && m.id)
          .map((m) => (m!.id === member.id ? member : m))
      );
    },
    [updateMembers]
  );

  const deleteMember = useCallback(
    (familyId: string, memberId: string, deleteChildren: boolean) => {
      updateMembers(familyId, (members) => {
        if (deleteChildren) {
          const toRemove = new Set<string>();
          const collect = (id: string) => {
            toRemove.add(id);
            members.filter((m) => m.parentId === id).forEach((m) => collect(m.id));
          };
          collect(memberId);
          return members.filter((m) => !toRemove.has(m.id));
        } else {
          const member = members.find((m) => m.id === memberId);
          return members
            .filter((m) => m.id !== memberId)
            .map((m) => (m.parentId === memberId ? { ...m, parentId: member?.parentId ?? null } : m));
        }
      });
    },
    [updateMembers]
  );

  return (
    <FamilyContext.Provider
      value={{
        families,
        activeFamily,
        setActiveFamilyId,
        addFamily,
        editFamilyName,
        deleteFamily,
        addMember,
        editMember,
        deleteMember,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};