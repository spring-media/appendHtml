import commonjs from "rollup-plugin-commonjs";
import async from "rollup-plugin-async";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import pkg from "./package.json";

const terserOptions = {
  ecma: 5,
  mangle: { module: true },
  compress: { module: true }
};

export default [
  {
    input: "src/index.js",
    output: { file: pkg.browser, format: "umd", name: "appendHtml" },
    plugins: [filesize(), terser(terserOptions), commonjs(), async()]
  },
  {
    input: "src/index.js",
    output: { file: pkg.main, format: "cjs" },
    plugins: [filesize(), terser(terserOptions)]
  },
  {
    input: "src/index.js",
    output: { file: pkg.module, format: "es" },
    plugins: [filesize(), terser(terserOptions)]
  }
];
