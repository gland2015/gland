const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const child_process = require("child_process");

const cwdDir = process.cwd();
// safe check
if (path.resolve(cwdDir, "../") !== path.resolve(__dirname, "../")) {
    throw new Error("Error dir");
}

const configPath = path.resolve(cwdDir, "tsconfig.json");
const configFile = require(configPath);

let outDir = configFile.compilerOptions.outDir;
if (!outDir.match(/^\.\.\/\.\.\/build\/[a-zA-Z\d-]+$/)) {
    throw new Error(outDir + " is not vaild");
}
outDir = path.resolve(cwdDir, outDir);

let tarDir = configFile.include[0];
if (!tarDir.match(/^\.\.\/\.\.\/packages\/[a-zA-Z\d-]+$/)) {
    throw new Error(tarDir + " is not vaild");
}
tarDir = path.resolve(cwdDir, tarDir);

// delete old dir
rimraf.sync(outDir, {});
fs.mkdirSync(outDir);

// copy README.md, LICENSE
const rdPath = path.resolve(tarDir, "./README.md");
const lcePath = path.resolve(tarDir, "./LICENSE");

const rdPath_to = path.resolve(outDir, "./README.md");
const lcePath_to = path.resolve(outDir, "./LICENSE");

fs.copyFileSync(rdPath, rdPath_to);
fs.copyFileSync(lcePath, lcePath_to);

// sync package.json dependencies, devDependencies
const pkgPath = path.resolve(tarDir, "./package.json");
const pkgPath_to = path.resolve(outDir, "./package.json");

const globalPkg = require(path.resolve(__dirname, "../../package.json"));
const curPkg = require(pkgPath);
for (let key in globalPkg.dependencies) {
    if (curPkg.dependencies && curPkg.dependencies[key]) {
        curPkg.dependencies[key] = globalPkg.dependencies[key];
    }
}
for (let key in globalPkg.devDependencies) {
    if (curPkg.devDependencies && curPkg.devDependencies[key]) {
        curPkg.devDependencies[key] = globalPkg.devDependencies[key];
    }
}
fs.writeFileSync(pkgPath, JSON.stringify(curPkg, null, "\t"));
fs.writeFileSync(pkgPath_to, JSON.stringify(curPkg, null, "\t"));
// complete!

// run tsc
child_process.exec("tsc");
