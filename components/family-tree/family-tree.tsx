"use client";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CustomNode = ({ data }: any) => {
  return (
    <Card className="w-44 shadow-lg border rounded-xl">
      <CardContent className="p-3 flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>
            {data.label.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <p className="font-semibold text-sm">{data.label}</p>
          <p className="text-xs text-muted-foreground">
            {data.role}
          </p>
        </div>
      </CardContent>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

const nodeTypes = {
  custom: CustomNode,
};


const initialNodes: Node[] = [

  {
    id: "grandfather",
    position: { x: 300, y: 0 },
    data: { label: "Rajesh Sharma", role: "Grandfather" },
    type: "custom",
  },
  {
    id: "grandmother",
    position: { x: 500, y: 0 },
    data: { label: "Sushma Sharma", role: "Grandmother" },
    type: "custom",
  },

  {
    id: "father",
    position: { x: 200, y: 200 },
    data: { label: "Amit Sharma", role: "Father" },
    type: "custom",
  },
  {
    id: "mother",
    position: { x: 400, y: 200 },
    data: { label: "Neha Sharma", role: "Mother" },
    type: "custom",
  },
  {
    id: "uncle",
    position: { x: 600, y: 200 },
    data: { label: "Sanjay Sharma", role: "Uncle" },
    type: "custom",
  },
  {
    id: "aunt",
    position: { x: 800, y: 200 },
    data: { label: "Pooja Sharma", role: "Aunt" },
    type: "custom",
  },


  {
    id: "me",
    position: { x: 150, y: 400 },
    data: { label: "Nikhil Sharma", role: "You" },
    type: "custom",
  },
  {
    id: "brother",
    position: { x: 300, y: 400 },
    data: { label: "Rohan Sharma", role: "Brother" },
    type: "custom",
  },
  {
    id: "sister",
    position: { x: 450, y: 400 },
    data: { label: "Ananya Sharma", role: "Sister" },
    type: "custom",
  },
  {
    id: "cousin1",
    position: { x: 650, y: 400 },
    data: { label: "Arjun Sharma", role: "Cousin" },
    type: "custom",
  },
  {
    id: "cousin2",
    position: { x: 800, y: 400 },
    data: { label: "Priya Sharma", role: "Cousin" },
    type: "custom",
  },

  {
    id: "wife",
    position: { x: 150, y: 600 },
    data: { label: "Sneha Sharma", role: "Wife" },
    type: "custom",
  },
  {
    id: "child",
    position: { x: 150, y: 800 },
    data: { label: "Aarav Sharma", role: "Son" },
    type: "custom",
  },
];

const initialEdges: Edge[] = [

  { id: "e1", source: "grandfather", target: "father", animated: false },
  { id: "e2", source: "grandmother", target: "father", animated: false },
  { id: "e3", source: "grandfather", target: "uncle", animated: false },
  { id: "e4", source: "grandmother", target: "uncle", animated: false },


  { id: "e5", source: "father", target: "me", animated: false },
  { id: "e6", source: "mother", target: "me", animated: false},
  { id: "e7", source: "father", target: "brother", animated: false },
  { id: "e8", source: "father", target: "sister", animated: false },


  { id: "e9", source: "uncle", target: "cousin1", animated: false },
  { id: "e10", source: "uncle", target: "cousin2", animated: false },
  { id: "e12", source: "aunt", target: "cousin1", animated: false },
  { id: "e13", source: "aunt", target: "cousin2", animated: false },


  { id: "e11", source: "me", target: "child", animated: false },
];

export default function FamilyTree() {
  return (
    <div className="w-full h-[700px] bg-muted/40 rounded-xl border">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}