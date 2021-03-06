"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var DefaultGenTools = require("../../generators/DefaultGenTools");
var DefaultPrettyPrinter = require("../../strings/whitespace/DefaultPrettyPrinter");
var asr = chai.assert;
suite("GenToolsTest", function GenToolsTest() {
    test("DefaultGenTools", function DefaultGenToolsTest() {
        var tab = "\t";
        var nwln = "\n";
        var gen = DefaultGenTools.newInst(DefaultPrettyPrinter.newInst(tab, 0));
        var dst = [];
        gen.indent(dst, ["//start"]);
        gen.indent(dst, ["//GenToolsTest", ""]);
        gen.printer.indent();
        gen.indentNonEmpty(dst, "{");
        gen.indentNonEmpty(dst, ['"alpha": 1', '', '"omega": "NaN"']);
        gen.indent(dst, "};");
        gen.printer.dedent();
        gen.indent(dst, "//end");
        asr.equal(dst.join(nwln), "//start" + nwln +
            "//GenToolsTest" + nwln +
            "" + nwln +
            tab + "{" + nwln +
            tab + '"alpha": 1' + nwln +
            "" + nwln +
            tab + '"omega": "NaN"' + nwln +
            tab + "};" + nwln +
            "//end");
    });
});
