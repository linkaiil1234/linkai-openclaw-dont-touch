export const buildQueryString = (obj: Record<string, string | undefined>) => {
  const qs = Object.keys(obj)
    .filter(
      (key) => obj[key] !== "" && obj[key] !== undefined && obj[key] !== null,
    )
    .map((key: string) => {
      const value = obj[key];
      // Ensure we're encoding a string, not an object
      const stringValue = typeof value === "string" ? value : String(value);
      return `${encodeURIComponent(key)}=${encodeURIComponent(stringValue)}`;
    })
    .join("&");

  return qs;
};
