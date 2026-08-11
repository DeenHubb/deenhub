import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages: base must be "/YOUR-REPO-NAME/"
// e.g. if your repo is github.com/you/deenhub, use base: "/deenhub/"
export default defineConfig({
  plugins: [react()],
  base: "/deenhub/",
});
