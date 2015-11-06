"use strict";
var StringArray = require("../../../strings/StringArray");
var Modifier = require("../../../modifiers/Modifier");
var CsClass = require("./CsClass");
/**
 * @since 2015-8-8
 */
var CsServiceModel;
(function (CsServiceModel) {
    function getDefaultServiceClassImports(genTools) {
        return StringArray.addCommonPreSuffix(genTools.getIndent(), null, [
            "using System.Runtime.Serialization;",
            "using System;"
        ]);
    }
    CsServiceModel.getDefaultServiceClassImports = getDefaultServiceClassImports;
    function getDefaultServiceClassNamespaceStart(genTools, namespaceName) {
        return [
            "namespace " + namespaceName,
            "{"
        ];
    }
    CsServiceModel.getDefaultServiceClassNamespaceStart = getDefaultServiceClassNamespaceStart;
    function getDefaultServiceClassNamespaceEnd(genTools) {
        return ["}"];
    }
    CsServiceModel.getDefaultServiceClassNamespaceEnd = getDefaultServiceClassNamespaceEnd;
    function generateServiceClass(genTools, className, props, copyrightLines, authorName) {
        var classComments = [
            "    /// <summary>",
            "    /// <para>",
            "    /// An entity class that represents a " + className + ".",
            "    /// </para>",
            "    /// </summary>",
            "    /// <threadsafety>This class is mutable, so it is not thread-safe.</threadsafety>",
        ];
        if (authorName) {
            classComments.push("    /// <author>" + authorName + "</author>");
        }
        classComments.push("    /// <version>1.0</version>");
        if (copyrightLines) {
            if (copyrightLines.length === 1) {
                classComments.push("    /// <copyright>" + copyrightLines + "</copyright>");
            }
            else {
                StringArray.addPrePostStrings("    /// <copyright>", StringArray.addCommonPreSuffix("    /// ", null, copyrightLines, classComments), "    /// </copyright>");
            }
        }
        var classStart = {
            accessModifiers: Modifier.publicClass(),
            annotations: ["[DataContract]"],
            className: className,
        };
        var classConstructors = [{
                methodComments: [
                    "/// <summary>",
                    "/// <para>",
                    "/// Initializes a new instance of the <see cref=\"" + className + "\"/> class.",
                    "/// </para>",
                    "/// </summary>"
                ],
                accessModifiers: ["public"],
                name: className,
                code: []
            }];
        var properties = [];
        for (var i = 0, size = props.length; i < size; i++) {
            var prop = props[i];
            var propLines = {
                readOnly: prop.readOnly,
                required: prop.required,
                accessModifiers: ["public"],
                propName: prop.name,
                typeName: prop.typeName
            };
            properties.push(propLines);
        }
        return {
            classImports: getDefaultServiceClassImports(genTools),
            classStart: classStart,
            fields: [],
            classConstructors: classConstructors,
            properties: properties,
            instanceMethods: [],
            staticMethods: [],
        };
    }
    CsServiceModel.generateServiceClass = generateServiceClass;
    function generateServiceNamespaceSource(genTools, namespaceName, className, props, copyrightLines, authorName) {
        var classObj = generateServiceClass(genTools, className, props, copyrightLines, authorName);
        var importStrs = classObj.classImports;
        return {
            classImports: importStrs,
            namespaceStart: getDefaultServiceClassNamespaceStart(genTools, namespaceName),
            classes: [CsClass.toCsClassSource(classObj)],
            namespaceEnd: getDefaultServiceClassNamespaceEnd(genTools)
        };
    }
    CsServiceModel.generateServiceNamespaceSource = generateServiceNamespaceSource;
})(CsServiceModel || (CsServiceModel = {}));
module.exports = CsServiceModel;
