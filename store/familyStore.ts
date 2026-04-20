import { create } from 'zustand';

export type MemberRole = 'father' | 'wife' | 'ex-wife' | 'child';
export type SpouseType = 'current' | 'ex';
export type Gender = 'male' | 'female';

export interface FamilyMember {
  id: string;
  name: string;
  role: MemberRole;
  gender: Gender;
  image?: string[];
  birthDate?: string;
  birthPlace?: string;
  relation?: string;
  isAlive?: boolean;
  currentResidence?: string;
  deathDate?: string;
  deathPlace?: string;
  causeOfDeath?: string;
  marriageDate?: string;
  marriagePlace?: string;
  spouseMaidenName?: string;
  spouseFather?: string;
  spouseMother?: string;
  profession?: string;
  email?: string;
  phone?: string;
  userId?: string;
  parentId?: string;
  spouseId?: string;
  type?: string;
}

export interface Spouse extends FamilyMember {
  type: SpouseType;
  role: 'wife' | 'ex-wife';
}

export interface FamilyUnit extends FamilyMember {
  role: 'father';
  spouses: Spouse[];
  children: FamilyUnit[];
}

interface FamilyState {
  tree: FamilyUnit;
  selectedId: string | null;
  setSelected: (id: string | null) => void;
  addSpouse: (fatherId: string, spouse: Omit<Spouse, 'id'>) => void;
  addChild: (parentId: string, child: Omit<FamilyUnit, 'id' | 'spouses' | 'children'>) => void;
  updateMember: (id: string, updates: { name?: string; role?: MemberRole; gender?: Gender }) => void;
  deleteMember: (id: string) => void;
}

let nextId = 10;
const genId = () => String(nextId++);

const initialTree: FamilyUnit = {
  id: '1',
  name: 'John',
  role: 'father',
  gender: 'male',
  birthDate: '1978-04-14',
  birthPlace: 'London',
  relation: 'Head of family',
  currentResidence: 'New York',
  profession: 'Engineer',
  email: 'john@example.com',
  phone: '+1 555-0100',
  spouses: [
    {
      id: '2',
      name: 'Anna',
      role: 'wife',
      type: 'current',
      gender: 'female',
      birthDate: '1980-09-12',
      relation: 'Current spouse',
    },
    {
      id: '3',
      name: 'Lisa',
      role: 'ex-wife',
      type: 'ex',
      gender: 'female',
      birthDate: '1979-02-28',
      relation: 'Ex spouse',
    },
  ],
  children: [
    {
      id: '4',
      name: 'Chris',
      role: 'father',
      gender: 'male',
      birthDate: '2003-03-21',
      relation: 'Son',
      profession: 'Student',
      spouses: [],
      children: [],
    },
    {
      id: '5',
      name: 'Emma',
      role: 'father',
      gender: 'female',
      birthDate: '2005-06-08',
      relation: 'Daughter',
      profession: 'Student',
      spouses: [{
        id: '6',
        name: 'Mark',
        role: 'wife',
        type: 'current',
        gender: 'male',
        birthDate: '2004-01-10',
        relation: 'Current spouse',
      }],
      children: [
        {
          id: '7',
          name: 'Sophie',
          role: 'father',
          gender: 'female',
          birthDate: '2026-01-01',
          relation: 'Granddaughter',
          spouses: [],
          children: [],
        },
      ],
    },
  ],
};

function findAndUpdate(node: FamilyUnit, id: string, updates: { name?: string; role?: MemberRole; gender?: Gender }): FamilyUnit {
  const updatedSpouses = node.spouses.map(s => {
    if (s.id === id) {
      const newRole = updates.role as 'wife' | 'ex-wife' | undefined;
      return {
        ...s,
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.gender !== undefined ? { gender: updates.gender } : {}),
        ...(newRole ? { role: newRole, type: (newRole === 'wife' ? 'current' : 'ex') as SpouseType } : {}),
      };
    }
    return s;
  });

  const updatedChildren = node.children.map(c => findAndUpdate(c, id, updates));

  if (node.id === id) {
    return {
      ...node,
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.gender !== undefined ? { gender: updates.gender } : {}),
      spouses: updatedSpouses,
      children: updatedChildren,
    };
  }

  return { ...node, spouses: updatedSpouses, children: updatedChildren };
}

export const validateMember = (name: string, role: MemberRole): string | null => {
  if (!name.trim()) return 'Name cannot be empty';
  if (!['father', 'wife', 'ex-wife', 'child'].includes(role)) return 'Invalid role';
  return null;
};

export const useFamilyStore = create<FamilyState>((set) => ({
  tree: initialTree,
  selectedId: null,
  setSelected: (id) => set({ selectedId: id }),

  addSpouse: (fatherId, spouse) => set((state) => {
    const id = genId();
    const addToNode = (node: FamilyUnit): FamilyUnit => {
      if (node.id === fatherId) {
        if (spouse.type === 'current' && node.spouses.some(s => s.type === 'current')) {
          return node;
        }
        return { ...node, spouses: [...node.spouses, { ...spouse, id }] };
      }
      return { ...node, children: node.children.map(addToNode) };
    };
    return { tree: addToNode(state.tree) };
  }),

  addChild: (parentId, child) => set((state) => {
    const id = genId();
    const addToNode = (node: FamilyUnit): FamilyUnit => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, { ...child, id, role: 'father', spouses: [], children: [] }],
        };
      }
      return { ...node, children: node.children.map(addToNode) };
    };
    return { tree: addToNode(state.tree) };
  }),

  updateMember: (id, updates) => set((state) => ({
    tree: findAndUpdate(state.tree, id, updates),
  })),

  deleteMember: (id) => set((state) => {
    if (state.tree.id === id) return state;
    const deleteFromNode = (node: FamilyUnit): FamilyUnit => ({
      ...node,
      spouses: node.spouses.filter(s => s.id !== id),
      children: node.children
        .filter(c => c.id !== id)
        .map(deleteFromNode),
    });
    return { tree: deleteFromNode(state.tree), selectedId: state.selectedId === id ? null : state.selectedId };
  }),
}));
