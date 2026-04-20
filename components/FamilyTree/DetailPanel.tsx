"use client";

import { useFamilyStore, type FamilyUnit, type MemberRole, type Gender } from '@/store/familyStore';
import { Button } from '@/components/ui/button';
import { X, Pencil, Trash2, Heart, Users } from 'lucide-react';
import { useState } from 'react';
import MemberModal from './MemberModal';

type MemberSummary = { id: string; name: string; role: MemberRole; gender: Gender };

function findMember(tree: FamilyUnit, id: string): { member: MemberSummary; parentId?: string } | null {
  for (const s of tree.spouses) {
    if (s.id === id) return { member: s, parentId: tree.id };
  }
  if (tree.id === id) return { member: tree };
  for (const child of tree.children) {
    const result = findMember(child, id);
    if (result) return result.parentId ? result : { ...result, parentId: tree.id };
  }
  return null;
}

function findLineage(tree: FamilyUnit, id: string, path: MemberSummary[] = []): MemberSummary[] | null {
  const nodeSummary: MemberSummary = {
    id: tree.id,
    name: tree.name,
    role: tree.role,
    gender: tree.gender,
  };
  const nextPath = [...path, nodeSummary];

  if (tree.id === id) {
    return nextPath;
  }

  const spouse = tree.spouses.find((s) => s.id === id);
  if (spouse) {
    return [
      ...nextPath,
      {
        id: spouse.id,
        name: spouse.name,
        role: spouse.role,
        gender: spouse.gender,
      },
    ];
  }

  for (const child of tree.children) {
    const result = findLineage(child, id, nextPath);
    if (result) return result;
  }

  return null;
}

function isFatherNode(tree: FamilyUnit, id: string): boolean {
  if (tree.id === id) return true;
  return tree.children.some(c => isFatherNode(c, id));
}

const roleBadgeColors: Record<string, string> = {
  father: 'bg-blue-100 text-blue-700',
  wife: 'bg-pink-100 text-pink-700',
  'ex-wife': 'bg-orange-100 text-orange-700',
  child: 'bg-green-100 text-green-700',
};

export default function DetailPanel() {
  const { selectedId, setSelected, tree, updateMember, deleteMember, addSpouse, addChild } = useFamilyStore();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState<'spouse' | 'child' | null>(null);

  if (!selectedId) return null;
  const found = findMember(tree, selectedId);
  if (!found) return null;

  const { member } = found;
  const lineage = findLineage(tree, selectedId) ?? [];
  const lineageBottomToTop = [...lineage].reverse();
  const isRoot = tree.id === selectedId;
  const isFather = isFatherNode(tree, selectedId);

  const roleLabel: Record<string, string> = {
    father: 'Father',
    wife: 'Current Wife',
    'ex-wife': 'Ex-Wife',
    child: 'Child',
  };

  return (
    <>
      <div className="absolute top-20 right-4 z-20 w-80 rounded-xl border bg-card shadow-xl animate-in slide-in-from-right-4 duration-200">
        <div className="flex items-start justify-between p-4 pb-3 border-b">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground">{member.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeColors[member.role] || 'bg-muted text-muted-foreground'}`}>
                {roleLabel[member.role] || member.role}
              </span>
              <span className="text-xs text-muted-foreground">
                {member.gender === 'female' ? '♀ Female' : '♂ Male'}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1" onClick={() => setSelected(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <div className="rounded-lg border bg-muted/40 p-3 mb-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Lineage (Bottom to Top)</p>
            <div className="space-y-1.5">
              {lineageBottomToTop.map((item, index) => (
                <div key={item.id}>
                  <div className="text-xs font-medium text-foreground">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.role === 'father' ? 'Member' : item.role === 'wife' ? 'Current Spouse' : item.role === 'ex-wife' ? 'Ex Spouse' : 'Child'}
                  </div>
                  {index < lineageBottomToTop.length - 1 && (
                    <div className="text-[10px] text-muted-foreground">↑</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit Member
          </Button>
          {isFather && (
            <>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setAddOpen('spouse')}>
                <Heart className="h-4 w-4 mr-2" /> Add Spouse
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setAddOpen('child')}>
                <Users className="h-4 w-4 mr-2" /> Add Child
              </Button>
            </>
          )}
          {!isRoot && (
            <Button variant="destructive" size="sm" className="w-full justify-start mt-2" onClick={() => { deleteMember(selectedId); setSelected(null); }}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Member
            </Button>
          )}
        </div>
      </div>

      <MemberModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Member"
        initialName={member.name}
        initialRole={member.role}
        initialGender={member.gender}
        allowedRoles={isFather ? ['father'] : ['wife', 'ex-wife']}
        onSubmit={(name, role, gender) => updateMember(selectedId, { name, role, gender })}
      />

      <MemberModal
        open={addOpen === 'spouse'}
        onClose={() => setAddOpen(null)}
        title="Add Spouse"
        allowedRoles={['wife', 'ex-wife']}
        initialRole="wife"
        initialGender="female"
        onSubmit={(name, role, gender) => {
          addSpouse(selectedId, {
            name,
            gender,
            role: role as 'wife' | 'ex-wife',
            type: role === 'wife' ? 'current' : 'ex',
          });
        }}
      />

      <MemberModal
        open={addOpen === 'child'}
        onClose={() => setAddOpen(null)}
        title="Add Child"
        allowedRoles={['child']}
        initialRole="child"
        onSubmit={(name, _role, gender) => addChild(selectedId, { name, role: 'father', gender })}
      />
    </>
  );
}
