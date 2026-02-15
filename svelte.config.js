import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Static adapter for Tauri (pre-rendered)
    adapter: adapter({
      pages: 'build',     // folder for HTML pages
      assets: 'build',    // folder for JS/CSS/assets
      fallback: null
    }),
    alias: {
      "$lib": "./src/lib",
    },
    paths: {
      base: ''           // important: ensures relative paths inside .app
    }
  },
  compilerOptions: {
    customElement: true,
  }
};

export default config;
