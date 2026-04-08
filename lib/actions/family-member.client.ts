export async function getTreeData() {
  const res = await fetch("/api/family-tree", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load family tree data");
  return res.json();
}

export async function getFamilyMembers() {
  const res = await fetch("/api/family-members", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load family members");
  return res.json();
}

export async function getFamilyMemberByID(id: string) {
  const res = await fetch(`/api/family-member/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch family member");
  return res.json();
}

export async function createFamilyMember(data: any) {
  const res = await fetch("/api/family-member", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to create family member");
  return res.json();
}

export async function updateFamilyMember(data: any) {
  if (!data?.id) throw new Error("Missing member id for update");
  const res = await fetch(`/api/family-member/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to update family member");
  return res.json();
}

export async function deleteFamilyMember(id: string, deleteChildren: boolean) {
  const res = await fetch(`/api/family-member/${id}?deleteChildren=${deleteChildren}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to delete family member");
  return res.json();
}

export async function getSpouses(id: string) {
  const res = await fetch(`/api/family-member/${id}/spouses`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch spouses");
  return res.json();
}
