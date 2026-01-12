// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.split(" ").map(capitalize).join(" ");
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const truncate = (
  str: string,
  length: number,
  suffix = "..."
): string => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const maskAadhaar = (aadhaar: string): string => {
  const cleaned = aadhaar.replace(/\D/g, "");
  if (cleaned.length === 12) {
    return `XXXX XXXX ${cleaned.slice(8)}`;
  }
  return aadhaar;
};
