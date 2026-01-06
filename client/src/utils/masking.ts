export const maskName = (name: string): string => {
  const trimmedName = name.trim();

  return trimmedName
    .split("")
    .map((char, index) => (index % 2 === 0 ? char : "*"))
    .join("");
};
