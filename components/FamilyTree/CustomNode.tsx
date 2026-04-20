"use client";

import { useState } from 'react';
import { useFamilyStore, type Spouse, type Gender } from '@/store/familyStore';

interface CustomNodeProps {
  nodeDatum: any;
  toggleNode: () => void;
  onAddChild: (id: string) => void;
  onAddSpouse: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

type ActionTarget = {
  id: string;
  x: number;
  y: number;
};

const CARD_W = 112;
const CARD_H = 106;
const GAP = 20;
const ACTIONS_WIDTH = 34;

const maleColors = {
  bg: '#EFF6FF',
  border: '#93C5FD',
  bar: '#3B82F6',
  text: '#1E40AF',
  icon: '♂',
};

const femaleColors = {
  bg: '#FDF2F8',
  border: '#F9A8D4',
  bar: '#EC4899',
  text: '#9D174D',
  icon: '♀',
};

const getColors = (gender: Gender) => gender === 'female' ? femaleColors : maleColors;
const levelLineColors = ['#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'];
const getLevelLineColor = (level: number) => levelLineColors[(Math.max(1, level) - 1) % levelLineColors.length];

const PersonCard = ({
  x,
  y,
  id,
  name,
  gender,
  isAlive,
  displayLevel,
  tracked,
  onHover,
  onSelect,
}: {
  x: number;
  y: number;
  id: string;
  name: string;
  gender: Gender;
  isAlive?: boolean;
  displayLevel: number;
  tracked?: boolean;
  onHover?: (target: ActionTarget) => void;
  onSelect: (id: string) => void;
}) => {
  const colors = getColors(gender);
  const rx = 12;
  const ry = 12;
  const badgeLabel = isAlive === false ? 'Dead' : 'Alive';
  const badgeFill = isAlive === false ? '#FEE2E2' : '#DCFCE7';
  const badgeText = isAlive === false ? '#DC2626' : '#15803D';
  const displayName = name.length > 14 ? `${name.slice(0, 13)}...` : name;
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover?.({ id, x, y })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Shadow */}
      <rect
        width={CARD_W}
        height={CARD_H}
        rx={rx}
        ry={ry}
        fill="rgba(0,0,0,0.06)"
        transform="translate(2, 3)"
      />
      {/* Card body */}
      <rect
        width={CARD_W}
        height={CARD_H}
        rx={rx}
        ry={ry}
        fill="#FFFFFF"
      />
      {/* Avatar bubble */}
      <circle
        cx={CARD_W / 2}
        cy={0}
        r={20}
        fill={colors.bar}
        stroke="#FFFFFF"
        strokeWidth={3}
      />
      <text
        x={CARD_W / 2}
        y={5}
        textAnchor="middle"
        fontSize={17}
        fontWeight={700}
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {initial}
      </text>
      {/* Name */}
      <text
        x={CARD_W / 2}
        y={48}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="#1F2937"
      >
        {displayName}
      </text>
      {/* Status badge */}
      <g transform={`translate(${CARD_W / 2}, 66)`}>
        <rect
          x={-16}
          y={-8}
          width={32}
          height={14}
          rx={7}
          fill={badgeFill}
        />
        <text
          textAnchor="middle"
          y={2}
          fontSize={7}
          fontWeight={500}
          fontFamily="system-ui, -apple-system, sans-serif"
          fill={badgeText}
        >
          {badgeLabel}
        </text>
      </g>
      <g transform={`translate(${CARD_W - 12}, 10)`}>
        <rect x={-11} y={-7} width={22} height={14} rx={7} fill="#111827" />
        <text
          x={0}
          y={3}
          textAnchor="middle"
          fontSize={7}
          fontWeight={600}
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="#FDE68A"
        >
          L{displayLevel}
        </text>
      </g>
    </g>
  );
};

const SpouseLink = ({
  x1, y1, x2, y2, dashed, tracked, level,
}: { x1: number; y1: number; x2: number; y2: number; dashed: boolean; tracked?: boolean; level: number }) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={tracked ? '#F59E0B' : getLevelLineColor(level)}
    strokeWidth={tracked ? 3 : 2}
    strokeDasharray={dashed ? '6,4' : undefined}
  />
);

export default function CustomNode({ nodeDatum, onAddChild, onAddSpouse, onEdit, onDelete }: CustomNodeProps) {
  const [hovered, setHovered] = useState(false);
  const [actionTarget, setActionTarget] = useState<ActionTarget | null>(null);
  const setSelected = useFamilyStore((s: any) => s.setSelected);
  let spouses: Spouse[] = [];
  try {
    spouses = nodeDatum.attributes?.spouses ? JSON.parse(nodeDatum.attributes.spouses) : [];
  } catch {
    spouses = [];
  }
  const nodeGender: Gender = nodeDatum.attributes?.gender || 'male';
  const nodeTracked = Boolean(nodeDatum.attributes?.isTracked);

  const currentWife = spouses.find((s) => s.type === 'current');
  const exWives = spouses.filter((s) => s.type === 'ex');
  const nodeId = nodeDatum.attributes?.nodeId ?? nodeDatum.id;
  const displayLevel = Number(nodeDatum.attributes?.levelBottom ?? (nodeDatum.depth ?? 0) + 1);

  const fatherX = -CARD_W / 2;
  const fatherY = -CARD_H / 2;

  const cards: any = [];
  const links: any = [];

  // Current wife/spouse on the left
  if (currentWife) {
    const wifeX = fatherX - CARD_W - GAP;
    const wifeY = fatherY;
    cards.push(
      <PersonCard
        key={currentWife.id}
        x={wifeX}
        y={wifeY}
        id={currentWife.id}
        name={currentWife.name}
        gender={currentWife.gender || 'female'}
        isAlive={currentWife.isAlive}
        displayLevel={displayLevel}
        tracked={Boolean((currentWife as any).isTracked)}
        onHover={setActionTarget}
        onSelect={setSelected}
      />
    );
    links.push(
      <SpouseLink
        key={`link-wife-${currentWife.id}`}
        x1={wifeX + CARD_W}
        y1={fatherY + CARD_H / 2}
        x2={fatherX}
        y2={fatherY + CARD_H / 2}
        dashed={false}
        level={displayLevel}
        tracked={nodeTracked && Boolean((currentWife as any).isTracked)}
      />
    );
  }

  // Ex-wives on the right
  exWives.forEach((ex, i) => {
    const exX = fatherX + CARD_W + GAP + i * (CARD_W + GAP);
    const exY = fatherY;
    cards.push(
      <PersonCard
        key={ex.id}
        x={exX}
        y={exY}
        id={ex.id}
        name={ex.name}
        gender={ex.gender || 'female'}
        isAlive={ex.isAlive}
        displayLevel={displayLevel}
        tracked={Boolean((ex as any).isTracked)}
        onHover={setActionTarget}
        onSelect={setSelected}
      />
    );
    links.push(
      <SpouseLink
        key={`link-ex-${ex.id}`}
        x1={fatherX + CARD_W}
        y1={fatherY + CARD_H / 2}
        x2={exX}
        y2={fatherY + CARD_H / 2}
        dashed={true}
        level={displayLevel}
        tracked={nodeTracked && Boolean((ex as any).isTracked)}
      />
    );
  });

  // Main node card
  cards.push(
    <PersonCard
      key={nodeDatum.attributes?.nodeId || nodeDatum.name}
      x={fatherX}
      y={fatherY}
      id={nodeDatum.attributes?.nodeId}
      name={nodeDatum.name}
      gender={nodeGender}
      isAlive={nodeDatum.attributes?.isAlive}
      displayLevel={displayLevel}
      tracked={nodeTracked}
      onHover={setActionTarget}
      onSelect={setSelected}
    />
  );

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActionTarget(null);
      }}
    >
      {/* Keep hover active while moving from hovered card to right-side action icons */}
      {actionTarget && (
        <rect
          x={actionTarget.x - 6}
          y={actionTarget.y - 10}
          width={CARD_W + ACTIONS_WIDTH}
          height={CARD_H + 20}
          fill="none"
          stroke="none"
          pointerEvents="all"
        />
      )}
      {links}
      {cards}
      {hovered && actionTarget && (
        <g>
          <g
            transform={`translate(${actionTarget.x + CARD_W + 14}, ${actionTarget.y + 2})`}
            pointerEvents="all"
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={0}
              cy={0}
              r={11}
              fill="#2563EB"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(actionTarget.id);
              }}
            />
            <text x={0} y={3.5} textAnchor="middle" fontSize={8} fill="#fff" fontWeight={700} pointerEvents="none">V</text>
          </g>
          <g
            transform={`translate(${actionTarget.x + CARD_W + 14}, ${actionTarget.y + 26})`}
            pointerEvents="all"
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={0}
              cy={0}
              r={11}
              fill="#7C3AED"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(actionTarget.id);
              }}
            />
            <text x={0} y={3.5} textAnchor="middle" fontSize={8} fill="#fff" fontWeight={700} pointerEvents="none">E</text>
          </g>
          <g
            transform={`translate(${actionTarget.x + CARD_W + 14}, ${actionTarget.y + 50})`}
            pointerEvents="all"
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={0}
              cy={0}
              r={11}
              fill="#DC2626"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(actionTarget.id);
              }}
            />
            <text x={0} y={3.5} textAnchor="middle" fontSize={8} fill="#fff" fontWeight={700} pointerEvents="none">D</text>
          </g>
          <g
            transform={`translate(${actionTarget.x + CARD_W + 14}, ${actionTarget.y + 74})`}
            pointerEvents="all"
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={0}
              cy={0}
              r={11}
              fill="#059669"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(actionTarget.id);
              }}
            />
            <text x={0} y={4} textAnchor="middle" fontSize={14} fill="#fff" fontWeight={700} pointerEvents="none">+</text>
          </g>
          <g
            transform={`translate(${actionTarget.x + CARD_W + 14}, ${actionTarget.y + 98})`}
            pointerEvents="all"
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={0}
              cy={0}
              r={11}
              fill="#EC4899"
              onClick={(e) => {
                e.stopPropagation();
                onAddSpouse(actionTarget.id);
              }}
            />
            <text x={0} y={4} textAnchor="middle" fontSize={12} fill="#fff" fontWeight={700} pointerEvents="none">S</text>
          </g>
        </g>
      )}
    </g>
  );
}
