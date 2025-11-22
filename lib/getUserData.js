export async function getUserData(userId) {
  const res = await fetch(`/api/users/${userId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user data, lib/getUserData");
  return await res.json();
}
