"use client";

import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { useFamilyStore, type FamilyUnit, type MemberRole, type Gender } from '@/store/familyStore';
import CustomNode from './CustomNode';
import MemberModal from './MemberModal';
import { ZoomIn, ZoomOut, Maximize2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NODE_HALF_HEIGHT = 53;

type MemberSummary = { id: string; name: string; role: MemberRole; gender: Gender };

const getLinkLevelClass = (level: number) => `tree-link-level-${((Math.max(1, level) - 1) % 6) + 1}`;

function findMember(tree: FamilyUnit, id: string): { member: MemberSummary } | null {
  for (const spouse of tree.spouses) {
    if (spouse.id === id) return { member: spouse };
  }
  if (tree.id === id) return { member: tree };
  for (const child of tree.children) {
    const result = findMember(child, id);
    if (result) return result;
  }
  return null;
}

function getMaxDepth(node: FamilyUnit, depth = 1): number {
  if (node.children.length === 0) return depth;
  return Math.max(...node.children.map((child) => getMaxDepth(child, depth + 1)));
}

function getLineageIds(tree: FamilyUnit, targetId: string, path: string[] = []): string[] | null {
  const nextPath = [...path, tree.id];

  if (tree.id === targetId) {
    return nextPath;
  }

  if (tree.spouses.some((s) => s.id === targetId)) {
    return [...nextPath, targetId];
  }

  for (const child of tree.children) {
    const result = getLineageIds(child, targetId, nextPath);
    if (result) return result;
  }

  return null;
}

function toTreeData(node: FamilyUnit, maxDepth: number, trackedIds: Set<string>, depth = 1): any {
  return {
    name: node.name,
    attributes: {
      nodeId: node.id,
      gender: node.gender,
      isTracked: trackedIds.has(node.id),
      levelTop: depth,
      levelBottom: maxDepth - depth + 1,
      birthDate: node.birthDate,
      birthPlace: node.birthPlace,
      relation: node.relation,
      isAlive: node.isAlive,
      currentResidence: node.currentResidence,
      profession: node.profession,
      email: node.email,
      phone: node.phone,
      type: node.type,
      parentId: node.parentId,
      spouseId: node.spouseId,
      spouses: JSON.stringify(
        node.spouses.map((spouse) => ({
          ...spouse,
          isTracked: trackedIds.has(spouse.id),
        }))
      ),
    },
    children: node.children.map((child) => toTreeData(child, maxDepth, trackedIds, depth + 1)),
  };
}

const stepPathFunc = (linkDatum: any) => {
  const { source, target } = linkDatum;
  const midY = (source.y + target.y) / 2;
  return `M${source.x},${source.y + NODE_HALF_HEIGHT} L${source.x},${midY} L${target.x},${midY} L${target.x},${target.y - NODE_HALF_HEIGHT}`;
};

export default function FamilyTreeView() {
  const tree = useFamilyStore((s: any) => s.tree);
  const selectedId = useFamilyStore((s: any) => s.selectedId);
  const addChild = useFamilyStore((s: any) => s.addChild);
  const addSpouse = useFamilyStore((s: any) => s.addSpouse);
  const updateMember = useFamilyStore((s: any) => s.updateMember);
  const deleteMember = useFamilyStore((s: any) => s.deleteMember);
  const setSelected = useFamilyStore((s: any) => s.setSelected);
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 500, y: 100 });
  const [zoom, setZoom] = useState(0.85);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [modalType, setModalType] = useState<'child' | 'spouse' | null>(null);
  const [modalParentId, setModalParentId] = useState<string | null>(null);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  const maxDepth = useMemo(() => getMaxDepth(tree), [tree]);
  const trackedIds = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const lineage = getLineageIds(tree, selectedId) ?? [selectedId];
    return new Set(lineage);
  }, [tree, selectedId]);

  const treeData = useMemo(() => toTreeData(tree, maxDepth, trackedIds), [tree, maxDepth, trackedIds]);
  const modalParent = useMemo(() => {
    if (!modalParentId) return null;
    return findMember(tree, modalParentId)?.member ?? null;
  }, [tree, modalParentId]);
  const spouseForFemale = modalType === 'spouse' && modalParent?.gender === 'female';
  const editTarget = useMemo(() => {
    if (!editTargetId) return null;
    return findMember(tree, editTargetId)?.member ?? null;
  }, [tree, editTargetId]);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: 100 });
    }
  }, []);

  const handleOpenAddChild = useCallback((id: string) => {
    setModalParentId(id);
    setModalType('child');
    setSelected(id);
  }, [setSelected]);

  const handleOpenAddSpouse = useCallback((id: string) => {
    setModalParentId(id);
    setModalType('spouse');
    setSelected(id);
  }, [setSelected]);

  const closeModal = useCallback(() => {
    setModalType(null);
    setModalParentId(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditTargetId(null);
  }, []);

  const handleBackToNormal = useCallback(() => {
    setSelected(null);
    setModalType(null);
    setModalParentId(null);
    setEditTargetId(null);
  }, [setSelected]);

  const handleOpenEdit = useCallback((id: string) => {
    setSelected(id);
    setEditTargetId(id);
  }, [setSelected]);

  const handleDelete = useCallback((id: string) => {
    if (id === tree.id) return;
    const confirmed = window.confirm('Delete this member?');
    if (!confirmed) return;
    deleteMember(id);
    setSelected(null);
  }, [deleteMember, setSelected, tree.id]);

  const renderNode = useCallback(
    (rd3tProps: any) => (
      <CustomNode
        {...rd3tProps}
        onAddChild={handleOpenAddChild}
        onAddSpouse={handleOpenAddSpouse}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    ),
    [handleDelete, handleOpenAddChild, handleOpenAddSpouse, handleOpenEdit]
  );

  const nodeSize = { x: 400, y: 160 };

  return (
    <div ref={containerRef} className="relative w-full h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-gradient-to-b from-background via-background/90 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              🌳 Family Tree
            </h1>
          </div>
          {(selectedId || modalType || editTargetId) && (
            <Button
              variant="outline"
              size="sm"
              className="bg-card shadow-sm"
              onClick={handleBackToNormal}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Normal
            </Button>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-card shadow-md"
          onClick={() => setZoom(z => Math.min(z + 0.15, 2))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-card shadow-md"
          onClick={() => setZoom(z => Math.max(z - 0.15, 0.3))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-card shadow-md"
          onClick={() => {
            setZoom(0.85);
            if (containerRef.current) {
              const { width } = containerRef.current.getBoundingClientRect();
              setTranslate({ x: width / 2, y: 100 });
            }
          }}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtle grid pattern */}
      <svg className="absolute inset-0 w-full h-screen pointer-events-none opacity-[0.03]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <Tree
        key={zoom}
        data={treeData}
        orientation="vertical"
        pathFunc={stepPathFunc}
        renderCustomNodeElement={renderNode}
        nodeSize={nodeSize}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        translate={translate}
        zoom={zoom}
        dimensions={dimensions}
        scaleExtent={{ min: 0.3, max: 2.0 }}
        zoomable
        draggable
        pathClassFunc={(linkDatum: any) => {
          const sourceTracked = Boolean(linkDatum?.source?.data?.attributes?.isTracked);
          const targetTracked = Boolean(linkDatum?.target?.data?.attributes?.isTracked);
          if (sourceTracked && targetTracked) {
            return 'tree-link tree-link-tracked';
          }
          const targetLevelBottom = Number(linkDatum?.target?.data?.attributes?.levelBottom ?? 1);
          return `tree-link ${getLinkLevelClass(targetLevelBottom)}`;
        }}
        onUpdate={({ zoom: z, translate: t }) => {
          setZoom(z);
          setTranslate(t);
        }}
      />

      <MemberModal
        open={modalType !== null}
        onClose={closeModal}
        title={
          modalType === 'spouse'
            ? spouseForFemale
              ? 'Add Husband'
              : 'Add Wife'
            : 'Add Child'
        }
        initialRole={modalType === 'spouse' ? 'wife' : 'child'}
        initialGender={modalType === 'spouse' ? (spouseForFemale ? 'male' : 'female') : 'male'}
        allowedRoles={modalType === 'spouse' ? ['wife', 'ex-wife'] : ['child']}
        roleLabelMap={
          spouseForFemale
            ? {
              wife: 'Husband',
              'ex-wife': 'Ex-Husband',
            }
            : {
              wife: 'Wife',
              'ex-wife': 'Ex-Wife',
            }
        }
        onSubmit={(name, role, gender) => {
          if (!modalParentId) return;
          if (modalType === 'spouse') {
            addSpouse(modalParentId, {
              name,
              gender,
              role: role as 'wife' | 'ex-wife',
              type: role === 'wife' ? 'current' : 'ex',
            });
          } else {
            addChild(modalParentId, { name, role: 'father', gender });
          }
          closeModal();
        }}
      />

      <MemberModal
        open={editTarget !== null}
        onClose={closeEditModal}
        title="Edit Member"
        initialName={editTarget?.name}
        initialRole={editTarget?.role}
        initialGender={editTarget?.gender}
        allowedRoles={editTarget?.role === 'father' ? ['father'] : ['wife', 'ex-wife']}
        onSubmit={(name, role, gender) => {
          if (!editTargetId) return;
          updateMember(editTargetId, { name, role, gender });
          closeEditModal();
        }}
      />

    </div>
  );
}
