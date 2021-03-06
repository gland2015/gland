import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import fs from "fs";
import path from "path";

const files = fs.readdirSync(__dirname).filter(function(filename) {
    const extname = path.extname(filename);
    if (extname === ".ts") return true;
    return false;
});

const tasks = files.map(function(filename) {
    const name = filename.replace(/\.ts$/, '')
    return {
        input: `./${filename}`,
        output: {
            file: `${name}.js`,
            format: "es",
            sourcemap: true
        },
        plugins: [
            typescript({
                tsconfig: false,
                jsx: "react",
                noEmitOnError: false,
                allowSyntheticDefaultImports: true
            }),
            resolve(),
            commonjs()
        ],
        external: id => true
    };
});

export default tasks
