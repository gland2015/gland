const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const child_process = require("child_process");
const copydir = require("copy-dir");

let basePath = path.resolve(__dirname, "../../");

module.exports = function build(target) {
    if (!target) throw new Error("null target");
    const tarDir = path.resolve(basePath, "packages", target);
    const outDir = path.resolve(basePath, "build", target);

    rimraf.sync(outDir, {});

    // sync package.json dependencies, devDependencies
    const pkgPath = path.resolve(tarDir, "./package.json");
    const globalPkg = require(path.resolve(basePath, "package.json"));
    const curPkg = require(pkgPath);
    for (let key in globalPkg.dependencies || {}) {
        if (curPkg.dependencies && curPkg.dependencies[key]) {
            curPkg.dependencies[key] = globalPkg.dependencies[key];
        }
    }
    for (let key in globalPkg.devDependencies || {}) {
        if (curPkg.devDependencies && curPkg.devDependencies[key]) {
            curPkg.devDependencies[key] = globalPkg.devDependencies[key];
        }
    }
    fs.writeFileSync(pkgPath, JSON.stringify(curPkg, null, "\t"));

    copydir.sync(tarDir, outDir, {
        utimes: true,
        mode: true,
        cover: true,
        filter: function (stat, filepath, filename) {
            if (path.dirname(filepath).match(/\./)) {
                return false;
            }
            if (filepath.match(/(\.js|\.map|\.d\.ts)$/)) {
                return false;
            }
            if (stat === "symbolicLink") {
                return false;
            }
            return true;
        },
    });

    child_process.exec("babel ./ --out-dir ./ --config-file ../../babel.config.js  --extensions .ts,.tsx --source-maps", {
        cwd: outDir,
    });
};
