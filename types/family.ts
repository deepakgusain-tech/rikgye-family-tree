export type Gender = "male" | "female" | "other";

export type Relationship =
  | "Father"
  | "Mother"
  | "Son"
  | "Daughter"
  | "Grandfather"
  | "Grandmother"
  | "Grandson"
  | "Granddaughter"
  | "Spouse"
  | "Sibling"
  | "Uncle"
  | "Aunt"
  | "Cousin"
  | "Other";

export interface FamilyMember {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  relationship: Relationship;
  parentId: string | null;
  imageUrl?: string;
}

export interface Family {
  id: string;
  name: string;
  members: FamilyMember[];
}
