// scripts/postbuild.cjs
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const from = path.join(distDir, "index.css");
const to = path.join(distDir, "feather-theme.css");

try {
  // 1) Rename CSS if it exists (or pick any single .css file)
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log("Renamed dist/index.css -> dist/feather-theme.css");
  } else {
    const cssFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".css"));
    if (cssFiles.length === 1 && cssFiles[0] !== "feather-theme.css") {
      const altFrom = path.join(distDir, cssFiles[0]);
      fs.renameSync(altFrom, to);
      console.log(`Renamed dist/${cssFiles[0]} -> dist/feather-theme.css`);
    } else if (cssFiles.length > 1) {
      // prefer index.css if present, otherwise keep as-is and log
      console.log(
        "Multiple CSS files found in dist; leaving them as-is. Found:",
        cssFiles
      );
    } else {
      console.log("No dist/*.css to rename — skipping rename.");
    }
  }

  // 2) Patch JS bundles so they reference ./feather-theme.css (or existing css name)
  const jsFiles = ["index.esm.js", "index.cjs.js", "index.umd.js"];
  jsFiles.forEach((file) => {
    const filePath = path.join(distDir, file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");

    // Replace import "./index.css" or other index.css variants with ./feather-theme.css
    content = content.replace(
      /(import\s+['"])(\.\/)?index\.css(\?[^'"]*)?(['"]\s*;?)/g,
      `$1./feather-theme.css$4`
    );
    // Replace references like "./index.css" used in other contexts
    content = content.replace(/(\.\/)index\.css/g, `./feather-theme.css`);

    // Additionally, if vite inlines an asset URL with a hashed name, replace that too:
    // pattern matches things like "/assets/index.abc123.css" -> "/assets/feather-theme.css"
    content = content.replace(
      /\/assets\/index\.[a-z0-9]+\.css/g,
      "/assets/feather-theme.css"
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Patched CSS import/URL references in ${file}`);
  });

  console.log("postbuild: done.");
} catch (err) {
  console.error("postbuild failed:", err);
  process.exit(1);
}
