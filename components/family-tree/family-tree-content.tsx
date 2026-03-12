"use client";

import { useFamilyContext } from "@/context/FamilyContext";
import { FamilyMember } from "@/types/family";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Tree, { RawNodeDatum, CustomNodeElementProps } from "react-d3-tree";
import { Plus, Pencil, Trash2 } from "lucide-react";
import MemberFormModal from "./member-form-modal";
import { DeleteMemberDialog } from "./delete-member-modal";

/* ───────────────── TREE BUILDER ───────────────── */

function buildTree(members: FamilyMember[]): RawNodeDatum[] {
  const map = new Map<string, RawNodeDatum & { __id: string }>();

  members.forEach((m) => {
    map.set(m.id, {
      name: m.name,
      attributes: {
        id: m.id,
        image: m.image,
        gender: m.gender ?? "",
        profession: m.profession ?? "",

        birthDate: m.birthDate?.toString() ?? "",
        birthPlace: m.birthPlace ?? "",

        isAlive: m.isAlive ? "Yes" : "No",

        deathDate: m.deathDate?.toString() ?? "",
        deathPlace: m.deathPlace ?? "",
        causeOfDeath: m.causeOfDeath ?? "",

        marriageDate: m.marriageDate?.toString() ?? "",
        marriagePlace: m.marriagePlace ?? "",

        spouseMaidenName: m.spouseMaidenName ?? "",
        spouseFather: m.spouseFather ?? "",
        spouseMother: m.spouseMother ?? "",
      },
      children: [],
      __id: m.id,
    });
  });

  const roots: RawNodeDatum[] = [];

  members.forEach((m) => {
    const node = map.get(m.id)!;

    if (m.parentId && map.has(m.parentId)) {
      (map.get(m.parentId)!.children as RawNodeDatum[]).push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/* ───────────────── NODE CARD ───────────────── */

interface NodeCardProps {
  nodeDatum: RawNodeDatum;
  onAdd: (member: FamilyMember) => void;
  onEdit: (member: FamilyMember) => void;
  onDelete: (member: FamilyMember) => void;
  members: FamilyMember[];
}

const CARD_W = 130;
const CARD_H = 110;

const NodeCard: React.FC<NodeCardProps> = ({
  nodeDatum,
  onAdd,
  onEdit,
  onDelete,
  members,
}) => {
  const attrs = nodeDatum.attributes as Record<string, string> | undefined;

  const memberId = attrs?.id ?? "";
  const member = members.find((m) => m.id === memberId);
  if (!member) return null;

  const gender = attrs?.gender ?? "";
  const profession = attrs?.profession ?? "";
  const image = attrs?.image ?? "";
  const isAlive = attrs?.isAlive ?? "Yes";
  const birthPlace = attrs?.birthPlace ?? "";

  const accentBorder =
    gender === "MALE"
      ? "hsl(210 60% 70%)"
      : gender === "FEMALE"
      ? "hsl(340 60% 70%)"
      : "hsl(var(--primary))";

  return (
    <g>
      <foreignObject
        x={-CARD_W / 2}
        y={-CARD_H / 2 - 40}
        width={CARD_W}
        height={CARD_H + 100}
        style={{ overflow: "visible" }}
      >
        <div
          className="relative flex flex-col items-center group"
          style={{ width: CARD_W, pointerEvents: "all" }}
        >
          {/* Hover Buttons */}
          <div
            className="
            absolute top-0 left-1/2 -translate-x-1/2 flex gap-1 z-50
            transition-all duration-300
            opacity-0 translate-y-2 pointer-events-none
            group-hover:opacity-100
            group-hover:translate-y-0
            group-hover:pointer-events-auto
          "
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(member);
              }}
              className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
            >
              <Plus size={14} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(member);
              }}
              className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(member);
              }}
              className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Card */}
          <div
            className="
            mt-10 rounded-xl border bg-white shadow-sm p-3
            flex flex-col items-center gap-1.5
            cursor-pointer select-none
            transition-all duration-300
            group-hover:shadow-lg group-hover:scale-105
          "
            style={{
              width: CARD_W,
              borderTopColor: accentBorder,
              borderTopWidth: 3,
              pointerEvents: "none",
            }}
          >
            {image ? (
              <img
                src={image}
                alt={nodeDatum.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                👤
              </div>
            )}

            <p className="font-semibold text-xs truncate w-full text-center">
              {nodeDatum.name}
            </p>

            {profession && (
              <p className="text-[10px] text-gray-500">{profession}</p>
            )}

            {birthPlace && (
              <p className="text-[9px] text-gray-400">📍 {birthPlace}</p>
            )}

            <p
              className={`text-[10px] ${
                isAlive === "Yes" ? "text-green-600" : "text-red-500"
              }`}
            >
              {isAlive === "Yes" ? "Alive" : "Deceased"}
            </p>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

/* ───────────────── TREE LAYOUT ───────────────── */

interface TreeLayoutProps {
  members: FamilyMember[];
  onAdd: (member: FamilyMember) => void;
  onEdit: (member: FamilyMember) => void;
  onDelete: (member: FamilyMember) => void;
}

const TreeLayout: React.FC<TreeLayoutProps> = ({
  members,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const treeData = useMemo(() => buildTree(members), [members]);

  const renderNode = useCallback(
    (rd3Props: CustomNodeElementProps) => (
      <NodeCard
        nodeDatum={rd3Props.nodeDatum}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        members={members}
      />
    ),
    [onAdd, onEdit, onDelete, members]
  );

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="font-display text-lg">No members yet</p>
        <p className="text-sm mt-1">
          Add your first family member to get started
        </p>
      </div>
    );
  }

  const data: RawNodeDatum =
    treeData.length === 1
      ? treeData[0]
      : { name: "Family", attributes: { id: "__root__" }, children: treeData };

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 120 });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 rounded-lg border bg-background"
      style={{ height: "calc(100vh - 160px)", minHeight: 400 }}
    >
      <Tree
        data={data}
        orientation="vertical"
        pathFunc="step"
        translate={translate}
        nodeSize={{ x: 200, y: 180 }}
        separation={{ siblings: 1.2, nonSiblings: 1.6 }}
        renderCustomNodeElement={renderNode}
        collapsible
        zoomable
      />
    </div>
  );
};

/* ───────────────── MAIN COMPONENT ───────────────── */

export const FamilyTreeContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  const { activeFamily, addMember, editMember, deleteMember } =
    useFamilyContext();

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  const [deletingMember, setDeletingMember] =
    useState<FamilyMember | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const members = activeFamily?.members ?? [];

  const handleAdd = (parent: FamilyMember) => {
    setEditingMember(null);
    setDefaultParentId(parent.id);
    setShowMemberForm(true);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setDefaultParentId(null);
    setShowMemberForm(true);
  };

  const handleDelete = (member: FamilyMember) => {
    setDeletingMember(member);
    setShowDeleteDialog(true);
  };

  const handleMemberSubmit = (data: Omit<FamilyMember, "id">) => {
    if (!activeFamily) return;

    if (editingMember) {
      editMember(activeFamily.id, { ...data, id: editingMember.id });
    } else {
      addMember(activeFamily.id, data);
    }
  };

  const handleDeleteConfirm = (deleteChildren: boolean) => {
    if (!activeFamily || !deletingMember) return;

    deleteMember(activeFamily.id, deletingMember.id, deleteChildren);
    setShowDeleteDialog(false);
    setDeletingMember(null);
  };

  const hasChildren = deletingMember
    ? members.some((m) => m.parentId === deletingMember.id)
    : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!activeFamily) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20 text-muted-foreground">
        <p className="font-display text-lg">No family selected</p>
        <p className="text-sm mt-1">Create a new family to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto px-6">
        <TreeLayout
          members={members}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <MemberFormModal
        open={showMemberForm}
        onClose={() => setShowMemberForm(false)}
        onSubmit={handleMemberSubmit}
        existingMembers={members}
        editingMember={editingMember}
        defaultParentId={defaultParentId}
      />

      <DeleteMemberDialog
        open={showDeleteDialog}
        member={deletingMember}
        hasChildren={hasChildren}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingMember(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};