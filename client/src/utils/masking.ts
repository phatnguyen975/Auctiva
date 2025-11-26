export const maskName = (name: string): string => {
  const trimmedName = name.trim();

  if (trimmedName.length <= 2) {
    return "*" + trimmedName[1];
  }

  const length = trimmedName.length;
  const maskLength = Math.floor(length / 2);

  const maskedPart = "*".repeat(maskLength);
  const visiblePart = trimmedName.slice(maskLength);

  return maskedPart + visiblePart;
};
