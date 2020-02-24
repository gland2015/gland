const fs = require("fs");
const path = require("path");

const exclude = ["__babel.config.js", "__clearFile.js"];

fs.readdir(__dirname, function(err, files) {
    files.forEach(function(filename) {
        const extname = path.extname(filename);
        if ((extname === ".js" && !exclude.includes(filename)) || extname === ".map") {
            let pathname = path.join(__dirname, filename);
            fs.unlink(pathname, function() {});
        }
    });
});
