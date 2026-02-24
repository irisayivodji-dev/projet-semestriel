import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        article: "article.html",
        category: "category.html",
        tag: "tag.html",
        search: "search.html",
      },
      output: {
        entryFileNames: "assets/js/[name].js",
        assetFileNames: "assets/css/framework.css",
      },
    },
  },
});