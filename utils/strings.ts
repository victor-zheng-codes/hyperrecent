import { formatDate } from "date-fns";

export function estimateReadTimeMin(content: string | undefined) {
  if (!content) return 0;

  return Math.ceil(content.split(" ").length / 200);
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export function truncate(str: string, length = 40) {
  const words = str.split(" ");
  let result = "";

  for (let i = 0; i < words.length; i++) {
    if (result.length + words[i].length > length) {
      return result + "...";
    }

    result += " " + words[i];
  }

  return result;
}

export function searchString(str?: string, includes?: string[] | string) {
  if (!str || !includes) return false;

  const cleanStr = (str: string) => {
    return str.toLowerCase().replace(/\s/g, "");
  };

  const strLower = cleanStr(str);

  if (typeof includes === "string") {
    return strLower.includes(cleanStr(includes));
  } else {
    return includes.some((include) => strLower.includes(cleanStr(include)));
  }
}

export function isExternalLink(path?: string) {
  return Boolean(/^(https?:\/\/|www\.)/i.test(path || ""));
}

export const formatDateStr = (date: string) =>
  formatDate(new Date(date), "MMM d, yyyy");

export function isEmail(str: string): boolean {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(str);
}

export const capitalizeFirstLetter = (str: string) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
