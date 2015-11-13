"use strict";
var Arrays = require("../../../lib/ts-mortar/utils/Arrays");
var StringArray = require("../../../strings/StringArray");
var EmptyLine = require("../../whitespace/EmptyLine");
var CsServiceModel = require("./CsServiceModel");
/** For generating the source code string array tree for a C# class from a class meta-data representation (e.g. {@link CsClassSource})
 * @since 2015-8-9
 */
var CsToSource = (function () {
    function CsToSource() {
    }
    CsToSource.namespaceClassToLines = function (genTools, namespaceName, csNsClasses, includeWhitespace, dst) {
        if (includeWhitespace) {
            CsToSource.namespaceClassToLinesWithWhitespace(genTools, namespaceName, csNsClasses, dst);
            return;
        }
        var classesObj = {
            classImports: csNsClasses.classImports,
            namespaceStart: csNsClasses.namespaceStart,
            classes: [],
            namespaceEnd: csNsClasses.namespaceEnd
        };
        genTools.printer.indent();
        classesObj.classes = CsToSource.classesToSrc(genTools, csNsClasses.classes, []);
        genTools.printer.deindent();
        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    };
    CsToSource.namespaceClassToLinesWithWhitespace = function (genTools, namespaceName, csNsClasses, dst) {
        var classesObj = {
            classImports: csNsClasses.classImports,
            ciToNsSWs: [""],
            namespaceStart: csNsClasses.namespaceStart,
            nsToCsWs: [""],
            classes: [],
            csToToNsEWs: [""],
            namespaceEnd: csNsClasses.namespaceEnd,
            nseToEdWs: [""]
        };
        genTools.printer.indent();
        CsToSource.classesToSrc(genTools, csNsClasses.classes, classesObj.classes);
        genTools.printer.deindent();
        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    };
    CsToSource.classToLines = function (genTools, namespaceName, csClasses, includeWhitespace, dst) {
        if (includeWhitespace) {
            CsToSource.classToLinesWithWhitespace(genTools, namespaceName, csClasses, dst);
            return;
        }
        var classesObj = {
            classImports: [],
            namespaceStart: CsServiceModel.getDefaultServiceClassNamespaceStart(genTools, namespaceName),
            classes: [],
            namespaceEnd: CsServiceModel.getDefaultServiceClassNamespaceEnd(genTools)
        };
        var methodToSourceFunc = CsToSource.createMethodToSrcMapper(genTools);
        for (var i = 0, size = csClasses.length; i < size; i++) {
            var cls = csClasses[i];
            Arrays.addAll(classesObj.classImports, cls.classImports);
            classesObj.classes.push({
                classStart: cls.classStart,
                classConstructors: cls.classConstructors,
                properties: cls.properties,
                instanceMethods: cls.instanceMethods.map(methodToSourceFunc),
                staticMethods: cls.staticMethods.map(methodToSourceFunc),
            });
        }
        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    };
    CsToSource.classToLinesWithWhitespace = function (genTools, namespaceName, csClasses, dst) {
        var classesObj = {
            classImports: [],
            ciToNsSWs: [""],
            namespaceStart: CsServiceModel.getDefaultServiceClassNamespaceStart(genTools, namespaceName),
            nsToCsWs: [""],
            classes: [],
            csToToNsEWs: [""],
            namespaceEnd: CsServiceModel.getDefaultServiceClassNamespaceEnd(genTools),
            nseToEdWs: [""]
        };
        for (var i = 0, size = csClasses.length; i < size; i++) {
            var cls = csClasses[i];
            Arrays.addAll(classesObj.classImports, cls.classImports);
        }
        genTools.printer.indent();
        CsToSource.classesToSrc(genTools, csClasses, classesObj.classes);
        genTools.printer.deindent();
        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    };
    CsToSource.classesToSrc = function (genTools, csClasses, dstClasses) {
        if (dstClasses === void 0) { dstClasses = []; }
        var methodToSourceFunc = CsToSource.createMethodToSrcMapper(genTools);
        var propToSourceFunc = CsToSource.createPropertyMethodToSrcMapper(genTools);
        for (var i = 0, size = csClasses.length; i < size; i++) {
            var cls = csClasses[i];
            var clsHeaderLines = CsToSource.classHeaderToMetaSrc(genTools, cls.classStart);
            var fieldLines = CsToSource.fieldsToSrc(genTools, cls.fields);
            var constructorLines = StringArray.joinMulti(cls.classConstructors.map(methodToSourceFunc), ["", ""]);
            var propLines = StringArray.joinMulti(cls.properties.map(propToSourceFunc), ["", ""]);
            var instanceMethodLines = StringArray.joinMulti(cls.instanceMethods.map(methodToSourceFunc), ["", ""]);
            var staticMethodLines = StringArray.joinMulti(cls.staticMethods.map(methodToSourceFunc), ["", ""]);
            var clsFooterLines = CsToSource.classFooterSrc(genTools, cls.classStart);
            dstClasses.push({
                classComments: clsHeaderLines.comments,
                annotations: clsHeaderLines.annotations,
                classStart: clsHeaderLines.classStart,
                fields: EmptyLine.preAppendIfAny(fieldLines, ["", ""], null, clsHeaderLines.classStart, ["", ""], null, constructorLines),
                classConstructors: EmptyLine.preAppendIfAny(constructorLines, ["", ""], [""], fieldLines, ["", ""], null, propLines),
                properties: EmptyLine.preAppendIfAny(propLines, null, null, constructorLines, ["", ""], ["", ""], instanceMethodLines),
                instanceMethods: EmptyLine.preAppendIfAny(instanceMethodLines, null, null, propLines, ["", ""], ["", ""], staticMethodLines),
                staticMethods: EmptyLine.preAppendIfAny(staticMethodLines, null, null, instanceMethodLines, ["", ""], ["", ""], clsFooterLines),
                classEnd: EmptyLine.preAppendIfAny(clsFooterLines, null, null, staticMethodLines, null, null, null),
            });
        }
        return dstClasses;
    };
    CsToSource.classHeaderToMetaSrc = function (genTools, classHeader) {
        return {
            comments: genTools.indentNonEmpty(classHeader.comments),
            annotations: genTools.indentNonEmpty(classHeader.annotations),
            classStart: genTools.indentNonEmpty([
                classHeader.accessModifiers.join(" ") + " " + classHeader.className + CsToSource.genericParametersToSrc(genTools, classHeader.genericParameters),
                "{"
            ]),
        };
    };
    CsToSource.classHeaderToSrc = function (genTools, classHeader, dst) {
        genTools.addIndentsToNonEmpty(dst, classHeader.comments);
        genTools.addIndentsToNonEmpty(dst, classHeader.annotations);
        genTools.addIndent(dst, classHeader.accessModifiers.join(" ") + " " + classHeader.className + CsToSource.genericParametersToSrc(genTools, classHeader.genericParameters));
        genTools.addIndent(dst, "{");
        return dst;
    };
    CsToSource.classFooterSrc = function (genTools, classHeader, dst) {
        if (dst === void 0) { dst = []; }
        genTools.addIndent(dst, "}");
        return dst;
    };
    CsToSource.createMethodToSrcMapper = function (genTools) {
        return function (method) { return CsToSource.methodToSrc(genTools, method, []); };
    };
    CsToSource.methodToSrc = function (genTools, method, dst) {
        var paramStrs = (method.parameters ? method.parameters.map(function (prop) {
            var propStr = prop.type + " " + prop.propName + (prop.required === false ? (prop.defaultValue ? " = " + prop.defaultValue : "?") : "");
            return propStr;
        }) : []);
        var signature = method.accessModifiers.join(" ") + " " + (method["returnType"] ? method["returnType"] + " " : "") + method.name + "(" + paramStrs.join(", ") + ")";
        genTools.addIndent(dst, signature);
        genTools.addIndent(dst, "{");
        genTools.printer.indent();
        genTools.addIndentsToNonEmpty(dst, method.code.slice());
        genTools.printer.deindent();
        genTools.addIndent(dst, "}");
        return dst;
    };
    CsToSource.createPropertyMethodToSrcMapper = function (genTools) {
        return function (prop) { return CsToSource.propertyMethodToSrc(genTools, prop, []); };
    };
    CsToSource.propertyMethodToSrc = function (genTools, prop, dst) {
        genTools.addIndentsToNonEmpty(dst, prop.comments);
        genTools.addIndentsToNonEmpty(dst, prop.annotations);
        genTools.addIndent(dst, prop.accessModifiers.join(" ") + " " + prop.type + (prop.required === false ? "?" : "") + " " + prop.propName);
        genTools.addIndent(dst, "{");
        genTools.printer.indent();
        genTools.addIndent(dst, "get;");
        if (prop.readOnly !== true) {
            genTools.addIndent(dst, "set;");
        }
        genTools.printer.deindent();
        genTools.addIndent(dst, "}");
        return dst;
    };
    CsToSource.fieldsToSrc = function (genTools, fields, dst) {
        if (dst === void 0) { dst = []; }
        for (var i = 0, size = fields.length; i < size; i++) {
            var field = fields[i];
            genTools.addIndent(dst, field.type + (field.required === false ? "?" : "") + " " + field.propName + (field["defaultValue"] ? " = " + field.defaultValue : "") + ";");
        }
        return dst;
    };
    // return in format '<A, B, C>'
    CsToSource.genericParametersToSrc = function (genTools, genericParameters) {
        return (genericParameters && genericParameters.length > 0 ? "<" + genericParameters.join(", ") + ">" : "");
    };
    return CsToSource;
})();
module.exports = CsToSource;