import dts from "rollup-plugin-dts";
import path from "path";

export default {
  input: path.resolve("dist", "index.d.ts"),
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [dts()],
};
