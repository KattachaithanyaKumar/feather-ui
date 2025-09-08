// scripts/postbuild.cjs
const fs = require("fs");
const path = require("path");

const from = path.resolve(__dirname, "../dist/index.css");
const to = path.resolve(__dirname, "../dist/feather-theme.css");

try {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log("Renamed dist/index.css -> dist/feather-theme.css");
  } else {
    console.log("No dist/index.css found — skipping rename.");
  }
} catch (err) {
  console.error("postbuild rename failed:", err);
  process.exit(1);
}
