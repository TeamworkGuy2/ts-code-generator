"use strict";
var fs = require("fs");
/**
 * @since 2015-8-10
 */
var WriteFile;
(function (WriteFile) {
    function writeFile(filePath, lines) {
        fs.writeFileSync(filePath, lines.join('\n'));
    }
    WriteFile.writeFile = writeFile;
    function writeFileSections(filePath, linesSections) {
        var allLines = [];
        var props = Object.keys(linesSections);
        for (var i = 0, size = props.length; i < size; i++) {
            Array.prototype.push.apply(allLines, linesSections[props[i]]);
        }
        writeFile(filePath, allLines);
    }
    WriteFile.writeFileSections = writeFileSections;
})(WriteFile || (WriteFile = {}));
module.exports = WriteFile;
