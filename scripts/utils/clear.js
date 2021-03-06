const path = require("path");
const fs = require("fs");

const target = path.resolve(__dirname, "../../packages");

const excludeNames = ["__rollup.config.js", "__clearFile.js"];
function clearFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(function (name) {
        const p = path.resolve(dir, name);
        let stat = fs.statSync(p);

        if (stat.isDirectory()) {
            clearFiles(p);
            return;
        }

        if (stat.isFile()) {
            if (p.match(/(\.js|\.map|\.d\.ts)$/) && excludeNames.indexOf(name) === -1) {
                fs.unlinkSync(p);
            }
        }
    });
}

clearFiles(target);
