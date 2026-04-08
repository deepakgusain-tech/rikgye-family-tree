export async function getCurrentUser() {
  const res = await fetch("/api/current-user", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch current user");
  return res.json();
}
