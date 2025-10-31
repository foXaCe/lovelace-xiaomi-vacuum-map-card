import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const plugins = [
    nodeResolve({
        extensions: [".js", ".ts"],
        exportConditions: ["node", "import", "default"],
    }),
    commonjs(),
    typescript(),
    json(),
    babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
    }),
    terser(),
];

export default [
    {
        input: "src/xiaomi-vacuum-map-card.ts",
        output: {
            dir: "dist",
            format: "es",
        },
        plugins,
    },
];
