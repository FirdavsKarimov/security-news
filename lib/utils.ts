import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getReadingTime = (content: string, textRead: string) => {
  const WPS = 275 / 60; // Words per second

  let images = 0;
  const regex = /\w/;

  const words = content.split(" ").filter((word) => {
    if (word.includes("<img")) {
      images += 1;
    }
    return regex.test(word);
  }).length;

  const readingTimeSeconds = words / WPS;
  const imageSeconds = images * 10;
  const totalTimeSeconds = Math.ceil(readingTimeSeconds + imageSeconds);
  const minutes = Math.ceil(totalTimeSeconds / 60);

  return {
    minutes,
    text: `${minutes} ${textRead}`,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedValue<T extends Record<string, any>>(
  obj: T | null | undefined,
  baseKey: string,
  locale: string,
) {
  if (!obj) return "";
  const key = baseKey + locale.charAt(0).toUpperCase() + locale.slice(1);
  return obj[key] ?? obj[baseKey + "Uz"];
}
