import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";

const plugins = [
    alias({
        entries: [
            { find: /^lit\/(.+)$/, replacement: 'lit/$1.js' }
        ]
    }),
    nodeResolve({
        extensions: [".js", ".ts"],
        browser: true,
        preferBuiltins: false,
        exportConditions: ["default", "module", "import", "development"],
        mainFields: ["module", "main"],
        dedupe: ["lit"],
    }),
    commonjs({
        include: /node_modules/,
    }),
    typescript(),
    json(),
    babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        extensions: [".js", ".ts"],
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
        external: [],
    },
];
