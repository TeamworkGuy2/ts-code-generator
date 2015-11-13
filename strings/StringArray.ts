﻿"use strict";
import Arrays = require("../lib/ts-mortar/utils/Arrays");

class StringArray {
    private strs: string[] = [];


    public add(str: string | number | boolean) {
        this.strs.push(String(str));
        return this;
    }


    public addAll(strAry: (string | number | boolean)[]) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(String(strAry[i]));
        }
        return this;
    }


    public insert(str: string | number | boolean, idx: number = 0) {
        if (idx === 0) {
            this.strs.unshift(String(str));
        }
        else {
            this.strs = Arrays.splice(this.strs, [String(str)], idx, 0);
        }
        return this;
    }


    public insertAll(strAry: (string | number | boolean)[], idx: number = 0) {
        if (idx === 0) {
            for (var i = strAry.length - 1; i > -1; i--) {
                this.strs.unshift(String(strAry[i]));
            }
        }
        else {
            this.strs = Arrays.splice(this.strs, strAry.map((s) => String(s)), idx, 0);
        }
        return this;
    }


    public addLines(str: string) {
        var lines = str.split(/\n|\r\n/);
        for (var i = 0, size = lines.length; i < size; i++) {
            this.strs.push(lines[i]);
        }
        return this;
    }


    public prefixAll(prefix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            this.strs[i] = prefix + this.strs[i];
        }
        return this;
    }


    public suffixAll(suffix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            this.strs[i] = this.strs[i] + suffix;
        }
        return this;
    }


    public prefixNonEmpty(prefix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                this.strs[i] = prefix + str;
            }
        }
        return this;
    }


    public suffixNonEmpty(suffix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                this.strs[i] = str + suffix;
            }
        }
        return this;
    }


    public addPrefixAll(strAry: string[], prefix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(prefix + strAry[i]);
        }
        return this;
    }


    public addSuffixAll(strAry: string[], suffix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(strAry[i] + suffix);
        }
        return this;
    }


    public addPrefixNonEmpty(strAry: string[], prefix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            var str = strAry[i];
            this.strs.push(str.length > 0 ? prefix + str : str);
        }
        return this;
    }


    public addSuffixNonEmpty(strAry: string[], suffix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            var str = strAry[i];
            this.strs.push(str.length > 0 ? str + suffix : str);
        }
        return this;
    }


    public filterOutEmpty() {
        var res: string[] = [];
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                res.push(str);
            }
        }
        this.strs = res;
        return this;
    }


    public getLines(copy: boolean = true) {
        return copy ? this.strs.slice() : this.strs;
    }


    public join(separator?: string): string {
        return this.strs.join(separator);
    }


    public copy() {
        return StringArray.of(this.strs, true);
    }


    public static of(strs: string | string[], copy: boolean = true): StringArray {
        var inst = new StringArray();
        inst.strs = Array.isArray(strs) ? (copy ? strs.slice() : strs) : [strs];
        return inst;
    }


    public static newInst() {
        var inst = new StringArray();
        return inst;
    }

}

module StringArray {

    /** Alias for {@link #toStringFromObjectsDeep()} 
     */
    export function toStrings(obj: any): string[] {
        var lines: string[] = [];
        StringArray.toStringFromObjectsDeep(obj, lines);
        return lines;
    }


    /** Convert a multi-level object to an array of string by recursively traversing each property of the object and appending string, string[] properties to the returned array
     */
    export function toStringFromObjectsDeep(obj: any, dst: string[] = []) {
        // String
        if (typeof obj === "string") {
            dst.push(obj);
        }
        // Object
        else if (!Array.isArray(obj)) {
            var props = Object.keys(obj);
            // Object properties
            for (var i = 0, size = props.length; i < size; i++) {
                var prop = obj[props[i]];
                // String
                if (typeof prop === "string") {
                    dst.push(prop);
                }
                // Array
                else if (Array.isArray(prop)) {
                    var ary: any[] = prop;
                    for (var ii = 0, sizeI = ary.length; ii < sizeI; ii++) {
                        if (typeof ary[ii] === "string") {
                            dst.push(ary[ii]);
                        }
                        else {
                            StringArray.toStringFromObjectsDeep(ary[ii], dst);
                        }
                    }
                }
                // Object
                else {
                    StringArray.toStringFromObjectsDeep(prop, dst);
                }
            }
        }
        // Array
        else {
            var ary: any[] = obj;
            for (var i = 0, size = ary.length; i < size; i++) {
                if (typeof ary[i] === "string") {
                    dst.push(ary[i]);
                }
                else {
                    StringArray.toStringFromObjectsDeep(ary[i], dst);
                }
            }
        }
    }


    /** Convert a single level object containing string or string[] properties to an array of strings
     * @return the flattened object with {@code join} string[] inserted between each property
     */
    export function stringMapToArrayJoin(obj: { [id: string]: string[]| string }, join: string[], dst: string[] = []): string[] {
        var props = Object.keys(obj);
        for (var i = 0, size = props.length; i < size; i++) {
            var prop = obj[props[i]];
            if (Array.isArray(prop)) {
                Array.prototype.push.apply(dst, prop);
            }
            else {
                dst.push(<string>prop);
            }

            if (join && i < size - 1) {
                Array.prototype.push.apply(dst, join);
            }
        }

        return dst;
    }


    export function flatten(strsAry: string[][]): string[] {
        return StringArray.joinMulti(strsAry, null, []);
    }


    /** Flatten a string[][] and optionally insert a 'join' string[] between each array
     * @return the flattened {@code strsAry} joined by {@code join}
     */
    export function joinMulti(strArys: string[][], join?: string[], dst: string[] = []): string[] {
        var sizeN1 = strArys.length - 1;
        if (sizeN1 > 0) {
            for (var i = 0; i < sizeN1; i++) {
                var strs = strArys[i];
                Array.prototype.push.apply(dst, strs);
                if (join) {
                    Array.prototype.push.apply(dst, join);
                }
            }
            Array.prototype.push.apply(dst, strArys[sizeN1 - 1]);
        }

        return dst;
    }


    /** Add an optional prefix and suffix to a string and return the result
     */
    export function preAppendStr(prefix: string, str: string, suffix: string): string {
        if (prefix || suffix) {
            if (prefix && suffix) {
                return prefix + str + suffix;
            }
            else if (prefix && !suffix) {
                return prefix + str;
            }
            else if (!prefix && suffix) {
                return str + suffix;
            }
        }
        else {
            return str;
        }
    }


    /** Add optional prefix and suffix strings to an array of strings
     */
    export function preAppendArray(prefix: string, ary: string[], suffix: string): string[] {
        if (prefix) {
            ary.unshift(prefix);
        }
        if (suffix) {
            ary.push(suffix);
        }
        return ary;
    }


    /** Add a common prefix and suffix string to each of the strings in an array of strings
     * @return {@code strs} with prefix and suffix strings added
     */
    export function preAppend(prefix: string, suffix: string, strs: string[], dst: string[] = []): string[] {

        if (prefix || suffix) {
            if (prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(prefix + strs[i] + suffix);
                }
            }
            else if (prefix && !suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(prefix + strs[i]);
                }
            }
            else if (!prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(strs[i] + suffix);
                }
            }
        }
        else {
            for (var i = 0, size = strs.length; i < size; i++) {
                dst.push(strs[i]);
            }
        }

        return dst;
    }


    /** Add a common prefix and suffix string to each of the non-empty strings in an array of strings
     * @return {@code strs} with prefix and suffix strings added
     */
    export function preAppendNonEmpty(prefix: string, suffix: string, strs: string[], dst: string[] = []): string[] {

        if (prefix || suffix) {
            if (prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    var str = strs[i];
                    dst.push(str.length > 0 ? prefix + str + suffix : str);
                }
            }
            else if (prefix && !suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    var str = strs[i];
                    dst.push(str.length > 0 ? prefix + str : str);
                }
            }
            else if (!prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    var str = strs[i];
                    dst.push(str.length > 0 ? str + suffix : str);
                }
            }
        }
        else {
            for (var i = 0, size = strs.length; i < size; i++) {
                dst.push(strs[i]);
            }
        }

        return dst;
    }

}

export = StringArray;