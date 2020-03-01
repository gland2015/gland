import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import svgr from '@svgr/rollup';

const external = ["react", "react-dom", "immutable", "fbjs", "tslib", "@material-ui", "@gland", 'clsx'];

export default {
    input: "./index.ts",
    output: [
        {
            file: "lib/index.js",
            format: "cjs",
            sourcemap: true
        },
        {
            file: "lib/index.min.js",
            format: "cjs",
            sourcemap: true,
            plugins: [terser()]
        },
        {
            file: "lib/index.esm.js",
            format: "es",
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
            tsconfig: false,
            jsx: "react",
            noEmitOnError: false,
            allowSyntheticDefaultImports: true
        }),
        resolve(),
        commonjs(),
        svgr()
    ],
    external: id => {
        id = id.split("/")[0];
        return external.includes(id);
    }
};
