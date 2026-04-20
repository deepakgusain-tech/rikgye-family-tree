export function canManageLevel(
  currentUserLevel: number | string | null | undefined,
  targetLevel: number | string | null | undefined,
) {

  if (currentUserLevel == null || targetLevel == null) {
    return false;
  }

  const current =
    typeof currentUserLevel === "string"
      ? Number(currentUserLevel.replace("L", "").trim())
      : currentUserLevel;
      
  const target =
    typeof targetLevel === "string"
      ? Number(targetLevel.replace("Level ", "").trim())
      : targetLevel;

  if (isNaN(current) || isNaN(target)) {
    return false;
  }

  console.log("canManageLevel =>", {
    currentUserLevel,
    targetLevel,
    current,
    target,
    allowed: target >= current,
  });

  return target >= current;
}
