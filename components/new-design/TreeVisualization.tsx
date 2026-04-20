"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { createRoot } from "react-dom/client";
import { Gender, Spouse as OriginalSpouse } from "@/types";
import { canManageLevel } from "@/lib/actions/level-permission";

// ------------------- Types ------------------- //

export interface FamilyNode {
  id: string;
  name: string;
  gender: Gender;
  birthYear?: number;
  isAlive?: boolean;
  image?: string;
  spouses: FamilyNodeSpouse[];
  children: FamilyNode[];
}

export interface FamilyNodeSpouse {
  id: string;
  name: string;
  gender: Gender;
  birthYear?: number;
  type: "current" | "ex";
}

export interface LayoutNode {
  id: string;
  name: string;
  gender: Gender;
  image?: string;
  birthYear?: number;
  x: number;
  y: number;
  type: "person" | "spouse";
  spouseType?: "current" | "ex";
  parentId?: string;
  level: number;
  isAlive?: boolean;
}

export interface LayoutLink {
  source: { x: number; y: number };
  target: { x: number; y: number };
  sourceId: string;
  targetId: string;
  type: "current" | "ex" | "child";
}

interface TreeVisualizationProps {
  data: FamilyNode;
  onNodeClick: (id: string, type: "person" | "spouse") => void;
  onEdit?: (id: string, type: "person" | "spouse") => void;
  onDelete?: (id: string) => void;
  onAdd?: (id: string) => void;
  onAddParent?: (id: string) => void;
  onAddSpouse?: (id: string) => void;
  onView?: (id: string, type: "person" | "spouse") => void;
  selectedId?: string | null;
  currentUser?: any;
}

// ------------------- Constants ------------------- //

export const CARD_W = 150;
export const CARD_H = 180;
export const SPOUSE_GAP = 25;
const H_GAP = 250;
const V_GAP = 100;
const SIBLING_GAP = 400;

const OVERFLOW_TOP = 20;
const OVERFLOW_SIDES = 20;
const FO_WIDTH = CARD_W + OVERFLOW_SIDES * 2;
const FO_HEIGHT = CARD_H + OVERFLOW_TOP + 20;

// ------------------- Node Card ------------------- //

interface TreeNodeCardProps {
  node: LayoutNode;
  onClick: (id: string, type: "person" | "spouse") => void;
  onEdit?: (id: string, type: "person" | "spouse") => void;
  onDelete?: (id: string) => void;
  onAdd?: (id: string) => void;
  onAddParent?: (id: string) => void;
  onAddSpouse?: (id: string) => void;
  onView?: (id: string, type: "person" | "spouse") => void;
  isSelected?: boolean;
  isOnPath?: boolean;
  currentUser?: any;
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({
  node,
  onClick,
  onEdit,
  onDelete,
  onAdd,
  onAddParent,
  onAddSpouse,
  onView,
  isSelected = false,
  isOnPath = false,
  currentUser,
}) => {
  const [hovered, setHovered] = useState(false);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const isMale = node.gender === "MALE";
  const birthYear = node.birthYear || "";
  const aliveStatus = node.isAlive === false ? "Dead" : "Alive";

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!isTouchDevice) return;

    const handleOutside = () => setHovered(false);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isTouchDevice]);

  const pathBorderColor = isOnPath
    ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
    : isMale
      ? "border-blue-400"
      : "border-pink-400";

  const pathAvatarColor = isOnPath
    ? "bg-amber-500"
    : isMale
      ? "bg-blue-400"
      : "bg-pink-400";

  const aliveColor = node.isAlive
    ? "bg-green-200 text-green-800"
    : "bg-red-200 text-red-800";

  const handleHover = (value: boolean) => {
    if (!currentUser) return;

    const role = currentUser.role?.toLowerCase();

    if (role === "admin") {
      setHovered(value);
    } else {
      const canManage =
        role === "admin" ||
        (role === "user" && canManageLevel(currentUser.level, node.level));

      if (canManage) {
        setHovered(value);
      }
    }
  };

  return (
    <div
      className="relative transition-all duration-300"
      style={{
        paddingTop: OVERFLOW_TOP,
        paddingLeft: OVERFLOW_SIDES,
        paddingRight: OVERFLOW_SIDES,
        transform: hovered ? "scale(1.03)" : "scale(1)",
      }}
      onMouseEnter={() => {
        if (!isTouchDevice) handleHover(true);
      }}
      onMouseLeave={() => {
        if (!isTouchDevice) handleHover(false);
      }}
      onClick={(e) => {
        if (isTouchDevice) {
          e.stopPropagation();
          setHovered((prev) => !prev);
        } else {
          onClick(node.id, node.type);
        }
      }}
    >
      {/* Hover / Tap Actions */}
      {hovered && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => !isTouchDevice && setHovered(true)}
          onMouseLeave={() => !isTouchDevice && setHovered(false)}
          className="absolute top-[100px] -translate-y-1/2 flex flex-col gap-2 p-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-300"
          style={{ left: OVERFLOW_SIDES + CARD_W + 8 }}
        >
          {/* ADD CHILD */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const targetId =
                node.type === "spouse" ? (node.parentId ?? node.id) : node.id;
              onAdd?.(targetId);
            }}
            className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center text-xs"
          >
            ＋
          </button>

          {/* ADD SPOUSE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const targetId =
                node.type === "spouse" ? (node.parentId ?? node.id) : node.id;
              onAddSpouse?.(targetId);
            }}
            className="w-7 h-7 bg-pink-500 hover:bg-pink-600 text-white rounded-lg flex items-center justify-center text-xs"
          >
            ♥
          </button>

          {/* VIEW */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(node.id, node.type);
            }}
            className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs"
          >
            👁
          </button>

          {/* EDIT */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(node.id, node.type);
            }}
            className="w-7 h-7 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center justify-center text-xs"
          >
            ✏
          </button>

          {/* DELETE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(node.id);
            }}
            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center text-xs"
          >
            🗑
          </button>
        </div>
      )}

      {/* CARD */}
      <div
        className={`relative flex flex-col items-center pt-14 bg-white shadow-lg rounded-2xl border-[3px] transition-all duration-500
        ${pathBorderColor}
        ${isSelected ? "ring-4 ring-yellow-400 ring-offset-2" : ""}`}
        style={{ width: CARD_W, height: CARD_H }}
      >
        {/* Avatar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
            {node.image ? (
              <img
                src={node.image}
                alt={node.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${pathAvatarColor}`}
              >
                {node.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <p className="mt-2 text-sm font-semibold text-center truncate px-2 w-full">
          {node.name}
        </p>
        <p className="text-[12px] text-gray-500">{birthYear}</p>

        <span
          className={`mt-2 text-[10px] px-2 py-[2px] rounded-full font-medium ${aliveColor}`}
        >
          {aliveStatus}
        </span>

        <div className="absolute top-2 right-2">
          <div className="w-8 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-gray-800 text-yellow-400">
            L{node.level}
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------- Layout Functions ------------------- //

function getSubtreeWidth(node: FamilyNode): number {
  const currentCount = node.spouses.filter((s) => s.type === "current").length;
  const exCount = node.spouses.filter((s) => s.type === "ex").length;

  const selfWidth =
    CARD_W +
    currentCount * (CARD_W + SPOUSE_GAP) +
    exCount * (CARD_W + SPOUSE_GAP);

  if (!node.children.length) return selfWidth;

  const childrenWidth =
    node.children.map(getSubtreeWidth).reduce((a, b) => a + b, 0) +
    (node.children.length - 1) * SIBLING_GAP;

  return Math.max(selfWidth, childrenWidth);
}

function placeNodes(
  node: FamilyNode,
  x: number,
  y: number,
  nodes: LayoutNode[],
  level: number = 0,
) {
  const subtreeWidth = getSubtreeWidth(node);

  const currentSpouses = node.spouses.filter((s) => s.type === "current");
  const exSpouses = node.spouses.filter((s) => s.type === "ex");

  const selfWidth =
    CARD_W +
    currentSpouses.length * (CARD_W + SPOUSE_GAP) +
    exSpouses.length * (CARD_W + SPOUSE_GAP);

  // Center the whole unit (current + person + ex) inside subtree
  const startX = x + (subtreeWidth - selfWidth) / 2;

  // 👉 MAIN PERSON (shifted right by current spouses)
  const personX = startX + currentSpouses.length * (CARD_W + SPOUSE_GAP);

  nodes.push({
    id: node.id,
    name: node.name,
    gender: node.gender,
    x: personX,
    y,
    type: "person",
    level,
  });

  // 👉 CURRENT spouses (LEFT)
  currentSpouses.forEach((spouse, i) => {
    nodes.push({
      id: spouse.id,
      name: spouse.name,
      gender: spouse.gender,
      x: personX - (i + 1) * (CARD_W + SPOUSE_GAP),
      y,
      type: "spouse",
      spouseType: "current",
      parentId: node.id,
      level,
    });
  });

  // 👉 EX spouses (RIGHT)
  exSpouses.forEach((spouse, i) => {
    nodes.push({
      id: spouse.id,
      name: spouse.name,
      gender: spouse.gender,
      x: personX + CARD_W + SPOUSE_GAP + i * (CARD_W + SPOUSE_GAP),
      y,
      type: "spouse",
      spouseType: "ex",
      parentId: node.id,
      level,
    });
  });

  // 👉 CHILDREN
  let childX = x;

  node.children.forEach((child) => {
    const childWidth = getSubtreeWidth(child);

    placeNodes(child, childX, y + CARD_H + V_GAP, nodes, level + 1);

    childX += childWidth + SIBLING_GAP;
  });
}

function computeLinks(
  node: FamilyNode,
  nodes: LayoutNode[],
  links: LayoutLink[],
) {
  const personNode = nodes.find((n) => n.id === node.id)!;
  node.spouses.forEach((spouse) => {
    const spouseNode = nodes.find((n) => n.id === spouse.id)!;
    const left = spouseNode.x < personNode.x ? spouseNode : personNode;
    const right = spouseNode.x < personNode.x ? personNode : spouseNode;
    links.push({
      source: { x: left.x + CARD_W, y: left.y + CARD_H / 2 },
      target: { x: right.x, y: right.y + CARD_H / 2 },
      sourceId: node.id,
      targetId: spouse.id,
      type: spouse.type,
    });
  });
  node.children.forEach((child) => {
    const childNode = nodes.find((n) => n.id === child.id)!;
    links.push({
      source: { x: personNode.x + CARD_W / 2, y: personNode.y + CARD_H },
      target: { x: childNode.x + CARD_W / 2, y: childNode.y },
      sourceId: node.id,
      targetId: child.id,
      type: "child",
    });
    computeLinks(child, nodes, links);
  });
}

function findAncestorPath(node: FamilyNode, targetId: string): string[] | null {
  if (node.id === targetId) return [node.id];
  for (const spouse of node.spouses)
    if (spouse.id === targetId) return [node.id, spouse.id];
  for (const child of node.children) {
    const path = findAncestorPath(child, targetId);
    if (path) return [node.id, ...path];
  }
  return null;
}

// ------------------- Main Component ------------------- //

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  data,
  onNodeClick,
  onEdit,
  onDelete,
  onAdd,
  onAddParent,
  onAddSpouse,
  onView,
  selectedId,
  currentUser,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nodes: LayoutNode[] = [];
  const links: LayoutLink[] = [];
  placeNodes(data, 0, 0, nodes);
  computeLinks(data, nodes, links);

  const ancestorPath = useMemo(() => {
    const pathSet = new Set<string>();
    if (selectedId) {
      const path = findAncestorPath(data, selectedId);
      if (path) path.forEach((id) => pathSet.add(id));
    }
    return pathSet;
  }, [data, selectedId]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("class", "zoom-group");

    links.forEach((link) => {
      const isOnPath =
        ancestorPath.has(link.sourceId) && ancestorPath.has(link.targetId);
      if (link.type === "child") {
        const midY = (link.source.y + link.target.y) / 2;
        g.append("path")
          .attr(
            "d",
            `M${link.source.x},${link.source.y} L${link.source.x},${midY} L${link.target.x},${midY} L${link.target.x},${link.target.y}`,
          )
          .attr("fill", "none")
          .attr("stroke", isOnPath ? "#f59e0b" : "#cbd5e1")
          .attr("stroke-width", isOnPath ? 4 : 2);
      } else {
        g.append("line")
          .attr("x1", link.source.x)
          .attr("y1", link.source.y)
          .attr("x2", link.target.x)
          .attr("y2", link.target.y)
          .attr("stroke", link.type === "current" ? "#ef4444" : "#94a3b8")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", link.type === "ex" ? "8,4" : "none");
      }
    });

    nodes.forEach((node) => {
      const isNodeOnPath = ancestorPath.has(node.id);
      const foreignObject = g
        .append("foreignObject")
        .attr("x", node.x - OVERFLOW_SIDES)
        .attr("y", node.y - OVERFLOW_TOP)
        .attr("width", FO_WIDTH)
        .attr("height", FO_HEIGHT)
        .style("overflow", "visible");

      const div = document.createElement("div");
      const root = createRoot(div);
      root.render(
        <TreeNodeCard
          node={node}
          currentUser={currentUser}
          onClick={onNodeClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          onAddParent={onAddParent}
          onAddSpouse={onAddSpouse}
          onView={onView}
          isSelected={node.id === selectedId}
          isOnPath={isNodeOnPath}
        />,
      );

      foreignObject.node()?.appendChild(div);
      foreignObject.on("mouseenter", function () {
        d3.select(this).raise();
      });
    });

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => g.attr("transform", event.transform.toString()));

    svg.call(zoom);

    const svgWidth = containerRef.current.clientWidth;
    const treeWidth = Math.max(...nodes.map((n) => n.x)) + CARD_W;

    const initialScale = 0.5;
    const initialX = (svgWidth - treeWidth * initialScale) / 2;

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform as any,
        d3.zoomIdentity.translate(initialX, 50).scale(initialScale),
      );
  }, [
    nodes,
    links,
    onNodeClick,
    onEdit,
    onDelete,
    onAdd,
    ancestorPath,
    selectedId,
  ]);

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full relative bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden"
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden"
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default TreeVisualization;
