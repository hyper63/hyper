module.exports = {
  "packages/**/*.{js,ts,jsx,tsx}": ["deno fmt", "deno lint"],
  "package.json": ["sort-package-json"],
};
