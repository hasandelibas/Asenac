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
Array.prototype.distinct = function () {
    let i = 0;
    while (i < this.length) {
        const element = this[i];
        if (this.indexOf(element) === i) {
            i++;
        }
        else {
            this.popAt(i);
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
String.prototype.matchRequirsive = function (start, end) {
    var search = this;
    var total = 0, startLen = start.length, endLen = end.length;
    var startPoint = -1;
    for (let i = 0; i < search.length - endLen + 1; i++) {
        const element = search[i];
        //console.log(i,element,total,startPoint);
        if (search.substr(i, startLen) == start) {
            //console.log("S:",i)
            total++;
            if (startPoint == -1)
                startPoint = i;
        }
        if (search.substr(i, endLen) == end) {
            //console.log("E:",i)
            total--;
            if (total == 0 && startPoint != -1) {
                return [
                    search.substr(startPoint, i + endLen - startPoint),
                    search.substr(startPoint + startLen, i - startPoint - startLen)
                ];
            }
        }
    }
    return null;
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
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
Element.prototype.empty = function () {
    while (this.childNodes.length > 0) {
        this.firstChild.remove();
    }
};
