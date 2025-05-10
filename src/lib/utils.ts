import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isValidUrl = (url: string) => {
  return url.includes("http") || url.includes("https");
};

/**
 * 將本地日期（不含時間）轉為 UTC 00:00:00
 * @param {Date} date - 使用者選擇的日期
 * @returns {Date} UTC 00:00:00 的日期物件
 */
export function toUTCDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}
