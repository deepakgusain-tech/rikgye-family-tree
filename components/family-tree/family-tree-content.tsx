"use client";

import { useFamilyContext } from "@/context/FamilyContext";
import { FamilyMember } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Tree, { RawNodeDatum, CustomNodeElementProps } from "react-d3-tree";
import { Plus, Pencil, Trash2 } from "lucide-react";

import MemberFormModal from "./member-form-modal";
import { DeleteMemberDialog } from "./delete-member-modal";

import { deleteFamilyMember } from "@/lib/actions/family-member";
import { getCurrentUser } from "@/lib/actions/user-action";

const CARD_W = 150;
const CARD_H = 170;

function buildTree(members: FamilyMember[]): RawNodeDatum[] {
  const map = new Map<string, RawNodeDatum>();

  members.forEach((m) => {
    map.set(m.id, {
      name: m.name,
      attributes: { id: m.id },
      children: [],
    });
  });

  const roots: RawNodeDatum[] = [];

  members.forEach((m) => {
    const node = map.get(m.id);
    if (!node) return;

    if (m.parentId && map.has(m.parentId)) {
      map.get(m.parentId)?.children?.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/* ---------------- CENTERED STEP PATH ---------------- */

const centeredStepPath = (linkDatum: any, orientation: string) => {
  const { source, target } = linkDatum;

  if (orientation === "vertical") {
    const startX = source.x;
    const startY = source.y + CARD_H / 2;

    const endX = target.x;
    const endY = target.y - CARD_H / 2;

    const midY = startY + (endY - startY) / 2;

    return `
      M ${startX},${startY}
      V ${midY}
      H ${endX}
      V ${endY}
    `;
  }

  return "";
};

/* ---------------- NODE CARD ---------------- */

const NodeCard = ({
  nodeDatum,
  members,
  currentUserId,
  currentUserRole,
  onAdd,
  onEdit,
  onDelete,
  onView,
}: any) => {
  const attrs = nodeDatum.attributes as Record<string, string>;
  const member = members.find((m: FamilyMember) => m.id === attrs?.id);
  if (!member) return null;

  const isAdmin = currentUserRole === "ADMIN";
  const isOwner = member.userId === currentUserId;

  const canEdit = isAdmin || isOwner;
  const canDelete = isAdmin || isOwner;

  const isAlive = member.isAlive;

  return (
    <g>
      <foreignObject
        x={-CARD_W / 2 - 60} 
        y={-CARD_H / 2}
        width={CARD_W + 60}
        height={CARD_H}
        style={{ overflow: "visible", pointerEvents: "all" }}
      >
        <div className="relative flex items-center group h-full">

          {/* Hover bridge */}
          <div className="absolute left-0 top-0 h-full w-16"></div>

          {/* ACTION BUTTONS */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2
            flex flex-col gap-1 bg-white shadow-lg rounded-lg p-1 border
            opacity-0 group-hover:opacity-100
            transition-all duration-200 z-10"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(member);
              }}
              className="p-2 rounded-md hover:bg-green-500 hover:text-white"
            >
              <Plus size={13} />
            </button>

            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(member);
                }}
                className="p-2 rounded-md hover:bg-blue-500 hover:text-white"
              >
                <Pencil size={13} />
              </button>
            )}

            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(member);
                }}
                className="p-2 rounded-md hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          {/* CARD */}
          <div
            onClick={() => onView(member)}
            className={`ml-16 relative bg-white rounded-xl flex flex-col items-center cursor-pointer
              transition-all duration-300
              border border-gray-300 border-t-4
              ${
                isAlive
                  ? "border-t-green-500 hover:shadow-[0_0_18px_rgba(34,197,94,0.5)]"
                  : "border-t-red-500 hover:shadow-[0_0_18px_rgba(239,68,68,0.5)]"
              }
              hover:scale-[1.03]
            `}
            style={{ width: CARD_W, height: CARD_H }}
          >
            <div className="mt-3">
              {member.image ? (
                <img
                  src={member.image}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg shadow">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            <p className="mt-2 text-sm font-semibold text-gray-800 text-center px-1 line-clamp-1">
              {member.name}
            </p>

            {member.profession && (
              <p className="text-xs text-gray-500 text-center px-1 line-clamp-1">
                {member.profession}
              </p>
            )}

            {member.birthDate && (
              <p className="text-[11px] text-gray-400 mt-1">
                {new Date(member.birthDate).getFullYear()}
              </p>
            )}

            <span
              className={`absolute top-2 right-2 text-[10px] px-2 py-[2px] rounded-full font-medium
                ${
                  isAlive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
            >
              {isAlive ? "Alive" : "Dead"}
            </span>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

/* ---------------- TREE ---------------- */

const TreeLayout = ({
  members,
  currentUserId,
  currentUserRole,
  onAdd,
  onEdit,
  onDelete,
  onView,
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const treeData = useMemo(() => buildTree(members), [members]);

  const renderNode = useCallback(
    (rd3Props: CustomNodeElementProps) => (
      <NodeCard
        {...rd3Props}
        members={members}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ),
    [members, currentUserId, currentUserRole]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2, y: 100 });
  }, [members]);

  const data: RawNodeDatum =
    treeData.length === 1
      ? treeData[0]
      : { name: "Family", attributes: { id: "__root__" }, children: treeData };

  return (
    <div ref={containerRef} className="w-full h-[85vh] bg-gray-50">
      <Tree
        data={data}
        orientation="vertical"
        translate={translate}
        pathFunc={centeredStepPath}
        nodeSize={{ x: 260, y: 220 }}
        separation={{ siblings: 1.2, nonSiblings: 1.6 }}
        depthFactor={220}
        renderCustomNodeElement={renderNode}
        collapsible={false}
        zoomable
      />
    </div>
  );
};

export const FamilyTreeContent = () => {
  const [mounted, setMounted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const { activeFamily, addMember, editMember, deleteMember } =
    useFamilyContext();

  const members = activeFamily?.members ?? [];

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  const [deletingMember, setDeletingMember] = useState<FamilyMember | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUserId(user?.data?.id ?? null);
      setCurrentUserRole(user?.data?.role ?? null);
    };

    loadUser();
    setMounted(true);
  }, []);

  const handleAdd = (parent?: FamilyMember) => {
    setEditingMember(null);
    setDefaultParentId(parent?.id ?? null);
    setShowMemberForm(true);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  const handleDelete = (member: FamilyMember) => {
    setDeletingMember(member);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (member: any) => {
    if (!activeFamily) return;

    if (editingMember) editMember(activeFamily.id, member);
    else addMember(activeFamily.id, member);
  };

  const handleDeleteConfirm = async () => {
    if (!activeFamily || !deletingMember) return;

    await deleteFamilyMember(deletingMember.id, false);
    deleteMember(activeFamily.id, deletingMember.id, false);

    setShowDeleteDialog(false);
    setDeletingMember(null);
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col">
      <TreeLayout
        members={members}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={() => {}}
      />

      <MemberFormModal
        open={showMemberForm}
        onClose={() => setShowMemberForm(false)}
        onSubmit={handleSubmit}
        existingMembers={members}
        editingMember={editingMember}
        defaultParentId={defaultParentId}
      />

      <DeleteMemberDialog
        open={showDeleteDialog}
        member={deletingMember}
        hasChildren={false}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};