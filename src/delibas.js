//#region All Platform Lib
//@ts-ignore
Array.prototype.popAt = function (index) {
    if (index == null) {
        index = this.length - 1;
    }
    return this.splice(index, 1)[0];
};
Array.prototype.unique = function () {
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    return this.filter(onlyUnique);
};
Array.prototype.distinct = function (fn = (a, b) => { return a == b; }) {
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        let find = this.filter(e => { return fn(element, e); });
        for (let j = 1; j < find.length; j++) {
            const element = find[j];
            this.popAt(this.indexOf(element));
        }
    }
};
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
// "" tırnak işaretlerini siler
String.prototype.trimQuotes = function () {
    var str = this;
    str = str.trim();
    if (str[0] == "\"" || str[0] == "'")
        str = str.substr(1);
    if (str[str.length - 1] == "\"" || str[str.length - 1] == "'")
        str = str.substr(0, str.length - 1);
    return str;
};
String.prototype.matchRequirsive = function (start, end, position = 0) {
    var search = this;
    var total = 0, startLen = start.length, endLen = end.length;
    var startPoint = -1;
    for (let i = position; i < search.length - endLen + 1; i++) {
        const element = search[i];
        //console.log(i,element,total,startPoint);
        if (search.substr(i, startLen) == start) {
            //console.log("S:",i)
            total++;
            if (startPoint == -1)
                startPoint = i;
            i += startLen - 1;
        }
        if (search.substr(i, endLen) == end) {
            //console.log("E:",i)
            total--;
            if (total == 0 && startPoint != -1) {
                return [
                    search.substr(startPoint, i + endLen - startPoint),
                    search.substr(startPoint + startLen, i - startPoint - startLen),
                    startPoint + startLen,
                    i + endLen
                ];
            }
            i += endLen - 1;
        }
    }
    return null;
};
String.prototype.pop = function (start, length) {
    return this.substr(0, start) + this.substr(start + length);
};
/** ================= cval ================= */
function cval(obj, arr, defVal) {
    if (defVal === undefined)
        defVal = cval.defValue;
    if (obj == null) {
        return defVal;
    }
    if (arr.length == 0) {
        return obj;
    }
    else {
        var index = arr.popAt(0);
        if (typeof (obj) == "object" && index in obj) {
            return cval(obj[index], arr, defVal);
        }
        else {
            return defVal;
        }
    }
}
cval.defValue = null;
Number.prototype.toDigit = function (x) {
    var str = this.toString();
    var len = str.length;
    for (; x > len; len++) {
        str = "0" + str;
    }
    return str;
};
// MATH BASICS
/**
 * return a array
 * @param start
 * @param end
 */
const range = function (start, end) {
    var ret = [];
    for (let i = start; start < end ? i <= end : i >= start; start < end ? i++ : i--)
        ret.push(i);
    return ret;
};
/**
 * positive range
 * return a array
 * @param start
 * @param end
 */
const prange = function (start, end) {
    var ret = [];
    for (let i = start; i <= end; i++)
        ret.push(i);
    return ret;
};
/**
 * negative return a array
 * @param start
 * @param end
 */
const nrange = function (start, end) {
    var ret = [];
    for (let i = start; i >= start; i--)
        ret.push(i);
    return ret;
};
const val = function (data, def) {
    if (data != null)
        return data;
    return def;
};
/**
 * Convert json to href\n
 *	Example
 * 	url: user
 *  parameters: {name:"Hasan"}
 * 	user?name=Hasan
 * @param url
 * @param parameters
 */
function $H(url, parameters) {
    var qs = "";
    for (var key in parameters) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }
    return url;
}
if (typeof window !== 'undefined') {
    const Append = function (parent, child) {
        if (child instanceof Array) {
            let fragment = document.createDocumentFragment();
            for (let i = 0; i < child.length; i++) {
                const element = child[i];
                console.log(element);
                fragment.appendChild(element);
            }
            console.log(fragment);
            parent.append(fragment);
        }
        if (child instanceof Object) {
            var keys = Object.keys(child);
            for (let i = 0; i < keys.length; i++) {
                const element = child[keys[i]];
                if (element instanceof Element) {
                    parent.appendChild(element);
                }
            }
        }
        if (child instanceof Element) {
            parent.appendChild(child);
        }
        if (child instanceof Text) {
            parent.appendChild(child);
        }
    };
    DocumentFragment.prototype.empty = function () {
        for (let i = 0; i < this.childNodes.length; i++) {
            const element = this.childNodes[i];
            this.removeChild(element);
        }
    };
    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    };
    Element.prototype.empty = function () {
        while (this.childNodes.length > 0) {
            this.firstChild.remove();
        }
    };
}
//#endregion
