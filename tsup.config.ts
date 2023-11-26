import { defineConfig } from "tsup";

export default defineConfig({
  sourcemap: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
});
