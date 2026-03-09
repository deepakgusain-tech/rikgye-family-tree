import { Family } from "@/types/family";

export const defaultFamily: Family = {
  id: "family-1",
  name: "The Johnson Family",
  members: [
    {
      id: "m1",
      name: "Robert Johnson",
      gender: "male",
      dateOfBirth: "1950-03-15",
      relationship: "Grandfather",
      parentId: null,
    },
    {
      id: "m2",
      name: "Mary Johnson",
      gender: "female",
      dateOfBirth: "1952-07-22",
      relationship: "Grandmother",
      parentId: null,
    },
    {
      id: "m3",
      name: "James Johnson",
      gender: "male",
      dateOfBirth: "1975-11-08",
      relationship: "Father",
      parentId: "m1",
    },
    {
      id: "m4",
      name: "Sarah Johnson",
      gender: "female",
      dateOfBirth: "1978-01-30",
      relationship: "Mother",
      parentId: "m1",
    },
    {
      id: "m5",
      name: "Emily Johnson",
      gender: "female",
      dateOfBirth: "2000-05-12",
      relationship: "Daughter",
      parentId: "m3",
    },
    {
      id: "m6",
      name: "Michael Johnson",
      gender: "male",
      dateOfBirth: "2003-09-25",
      relationship: "Son",
      parentId: "m3",
    },
  ],
};
