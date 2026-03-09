"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Family, FamilyMember } from "@/types/family";
import { defaultFamily } from "@/data/mockFamily";

interface FamilyContextType {
    families: Family[];
    activeFamily: Family | null;
    setActiveFamilyId: (id: string) => void;
    addFamily: (name: string) => void;
    editFamilyName: (id: string, name: string) => void;
    deleteFamily: (id: string) => void;
    addMember: (familyId: string, member: Omit<FamilyMember, "id">) => void;
    editMember: (familyId: string, member: FamilyMember) => void;
    deleteMember: (familyId: string, memberId: string, deleteChildren: boolean) => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export const useFamilyContext = () => {
    const ctx = useContext(FamilyContext);
    if (!ctx) throw new Error("useFamilyContext must be used within FamilyProvider");
    return ctx;
};

let nextId = 100;
const genId = () => `m${nextId++}`;
let nextFamilyId = 10;
const genFamilyId = () => `family-${nextFamilyId++}`;

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [families, setFamilies] = useState<Family[]>([defaultFamily]);
    const [activeFamilyId, setActiveFamilyId] = useState(defaultFamily.id);

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
                if (activeFamilyId === id && next.length > 0) {
                    setActiveFamilyId(next[0].id);
                }
                return next;
            });
        },
        [activeFamilyId]
    );

    const updateMembers = useCallback(
        (familyId: string, updater: (members: FamilyMember[]) => FamilyMember[]) => {
            setFamilies((prev) =>
                prev.map((f) => (f.id === familyId ? { ...f, members: updater(f.members) } : f))
            );
        },
        []
    );

    const addMember = useCallback(
        (familyId: string, member: Omit<FamilyMember, "id">) => {
            updateMembers(familyId, (members) => [...members, { ...member, id: genId() }]);
        },
        [updateMembers]
    );

    const editMember = useCallback(
        (familyId: string, member: FamilyMember) => {
            updateMembers(familyId, (members) =>
                members.map((m) => (m.id === member.id ? member : m))
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
