import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import packageJson from "../../package.json";
import siteConfig from "../../site-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GetUserAgent(honest: boolean) {
  if (honest) {
    return `${packageJson.name}/${packageJson.version} (${siteConfig.siteUrl})`;
  } else {
    return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  }
}



export function logDebug(...args: any[]) {
  if (process.env.LOG_LEVEL === "debug") {
    console.log(...args);
  }
}
