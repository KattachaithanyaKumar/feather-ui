// scripts/strip-css-from-dts.cjs
const fs = require("fs");
const path = require("path");

const dtsPath = path.resolve(__dirname, "..", "dist", "index.d.ts");

if (!fs.existsSync(dtsPath)) {
  console.error("No dist/index.d.ts found — run `npm run build:types` first.");
  process.exit(1);
}

let content = fs.readFileSync(dtsPath, "utf8");

// Remove any import statement that ends with .css (handles single/double quotes and optional semicolon)
const cleaned = content.replace(/import\s+['"][^'"]+\.css['"];?\r?\n?/g, "");

if (cleaned === content) {
  console.log("No .css imports found in dist/index.d.ts — nothing to strip.");
} else {
  fs.writeFileSync(dtsPath, cleaned, "utf8");
  console.log("Stripped .css imports from dist/index.d.ts");
}
