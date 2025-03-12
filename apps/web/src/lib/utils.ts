import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T;
}

export function trimObject<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  ) as T;
}

export function filterUndefinedAndTrim<T extends object>(obj: T): T {
  return trimObject(filterUndefined(obj));
}

export const boolCompare = (val1: boolean, val2: boolean) => {
  const num1 = typeof val1 === "boolean" ? (val1 ? 1 : 0) : -1;
  const num2 = typeof val2 === "boolean" ? (val2 ? 1 : 0) : -1;
  return num1 - num2;
};

export async function copyToClipboard(text?: string): Promise<void> {
  if (!text) {
    console.error("No text provided for copying.");
    return;
  }

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempTextArea = document.createElement("textarea");
      // Styles to ensure the textarea is not visible
      tempTextArea.style.position = "fixed";
      tempTextArea.style.left = "-9999px";
      tempTextArea.style.top = "0";
      tempTextArea.value = text;
      document.body.appendChild(tempTextArea);
      tempTextArea.focus();
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);
    }
  } catch (err) {
    console.error("Failed to copy to clipboard: ", err);
  }
}

export const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};
