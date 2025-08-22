import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import path from "path";
import { defineConfig } from "vite";
import { htmlReplacer } from "./vite-plugins/html-replacer";

// Function to get the git commit hash
const getGitCommitHash = () => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch (e) {
    console.error("Failed to get git commit hash:", e);
    // Fallback value if git isn't available or it's not a git repo.
    return "N/A";
  }
};

const commitHash = getGitCommitHash();

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), htmlReplacer()];

  if (mode === "development") {
    const { default: eslint } = await import("@nabla/vite-plugin-eslint");
    plugins.push(eslint());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // We use JSON.stringify to ensure the value is a string literal in the code.
      "import.meta.env.VITE_GIT_COMMIT_HASH": JSON.stringify(commitHash),
    },
  };
});
