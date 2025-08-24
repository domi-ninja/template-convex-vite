/// <reference types="vite/client" />

export interface SiteConfig {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    defaultImage: string;
    siteKeywords: string;
    siteAuthor: string;
    siteImage: string;
    siteContactEmail: string;
    githubUrl: string;
}

export const siteConfig: SiteConfig = {
    siteName: "domi.ninja-convex-vite",
    siteDescription: "Dominics' Convex Template",
    siteUrl: "https://convex.datenschrauber.ch",
    defaultImage: "/convex.svg",
    siteKeywords: "site keyword 1, site keyword 2, site keyword 3",
    siteAuthor: "Dominic",
    siteImage: "/favicon.ico",
    siteContactEmail: "convex.demo@datenschrauber.ch",
    githubUrl: "https://github.com/domi-ninja/domi.ninja-convex-vite",
};

export default siteConfig;
