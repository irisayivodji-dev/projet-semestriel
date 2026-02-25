import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        article: "pages/article.html",
        category: "pages/category.html",
        tag: "pages/tag.html",
        search: "pages/search.html",
        legal: "pages/legal.html"
      },
      output: {
        entryFileNames: "assets/js/[name].js",
        assetFileNames: "assets/css/framework.css",
      },
    },
  },
});