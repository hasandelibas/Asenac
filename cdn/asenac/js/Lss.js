// Forced Define
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
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
function Lss(code, variables = {}) {
    const selectors = {
        "@mobile": "@media only screen and (max-width: 600px)",
        "@tablet": "@media only screen and (min-width: 600px) and (max-width:991px)",
        "@desktop": "@media only screen and (min-width:992px)",
        "@mobile-text": "@media screen and (max-height: 400px)"
    };
    code = code.replaceAll(/\/\*.*\*\//, "");
    for (const key in variables) {
        if (variables.hasOwnProperty(key)) {
            const value = variables[key];
            code = code.replaceAll(key, value);
        }
    }
    function Divide(code) {
        let data = { selector: "", children: [], code: "" };
        var mat = null;
        /**
         * **;** character index
         */
        while ((mat = code.matchRequirsive("{", "}"))) {
            // Tag bul
            // Ara Kodu varsa dataya ekle
            // tagı değiştir tekrar requirsive olarak git
            // buradan devam et.
            var tag = "";
            var dotIndex = code.lastIndexOf(";", mat[2]);
            if (dotIndex != -1 && dotIndex < mat[2]) {
                tag = code.substr(dotIndex + 1, mat[2] - dotIndex - 2);
            }
            else {
                tag = code.substr(0, mat[2] - 1);
                dotIndex = -1;
            }
            // Ara Kod Prev Code ekleme
            var preCode = code.substr(0, dotIndex + 1);
            var insideCode = mat[1];
            if (preCode.trim() != "") {
                //data.children.push({selector:"",code:preCode.trim(),children:[]})
                data.code += preCode.trim();
            }
            code = code.pop(0, mat[3]);
            var newLssPart = Divide(insideCode);
            newLssPart.selector = tag.trim();
            data.children.push(newLssPart);
        }
        if (code.trim() != "") {
            data.code += code.trim();
        }
        return data;
    }
    function JoinTag(selector) {
        if (selector.substring(0, 1) == "&") {
            return selector.substring(1);
        }
        else {
            return " " + selector;
        }
    }
    let CSS = "";
    function Join(data, tag = "", superScript = "") {
        if (data.code.trim() != "") {
            var dumpTag = tag;
            if (superScript != "") {
                dumpTag = selectors[superScript] + "{" + dumpTag;
            }
            if (dumpTag != "") {
                CSS += dumpTag + "{" + data.code + "}" + "\n";
            }
            if (superScript != "") {
                CSS += "}\n";
            }
        }
        // @mobile ..
        for (let i = 0; i < data.children.length; i++) {
            const element = data.children[i];
            if (element.selector in selectors) {
                Join(element, tag, element.selector);
            }
            else if (element.selector.substr(0, 1) == "@") {
                CSS += JoinNormal(element);
            }
            else {
                var splitted = element.selector.split(",");
                for (let j = 0; j < splitted.length; j++) {
                    const split = splitted[j];
                    Join(element, tag + JoinTag(split), superScript);
                }
            }
        }
    }
    function JoinNormal(data) {
        var totalCSS = "";
        for (let i = 0; i < data.children.length; i++) {
            const element = data.children[i];
            totalCSS += JoinNormal(element);
        }
        return data.selector + "{" + totalCSS + data.code + "}";
    }
    var divided = Divide(code);
    Join(divided);
    return CSS;
}
Lss.Multi = function (codes) {
    var variables = {};
    for (let i = 0; i < codes.length; i++) {
        var mat = null;
        while ((mat = codes[i].match(/^ *\$([\w\-]+) *\:(.*)\;/m))) {
            codes[i] = codes[i].replace(mat[0], "");
            variables["$" + mat[1]] = mat[2];
        }
    }
    let cssCode = [];
    for (let i = 0; i < codes.length; i++) {
        const code = codes[i];
        var lssCode = Lss(code, variables);
        lssCode = Lss.Webkit(lssCode);
        cssCode.push(lssCode);
    }
    return cssCode;
};
Lss.Webkit = function (code) {
    var WebkitList = ["align-content", "align-items", "align-self", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "backface-visibility", "background-clip", "background-origin", "background-size", "border-bottom-left-radius", "border-bottom-right-radius", "border-image", "border-radius", "border-top-left-radius", "border-top-right-radius", "box-decoration-break", "box-shadow", "box-sizing", "clip-path", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "font-feature-settings", "font-kerning", "font-variant-ligatures", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hyphens", "justify-content", "justify-items", "justify-self", "line-break", "mask", "mask-clip", "mask-composite", "mask-image", "mask-origin", "mask-position", "mask-repeat", "mask-size", "opacity", "order", "perspective", "perspective-origin", "ruby-position", "scroll-snap-type", "shape-image-threshold", "shape-margin", "shape-outside", "-epub-text-decoration", "text-color-decoration", "text-decoration-line", "text-decoration-style", "-epub-text-emphasis", "text-emphasis", "-epub-text-emphasis-color", "text-emphasis-color", "text-emphasis-position", "-epub-text-emphasis-style", "text-emphasis-style", "text-justify", "text-orientation", "text-size-adjust", "text-underline-position", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "user-select"];
    for (let i = 0; i < WebkitList.length; i++) {
        const css = WebkitList[i];
        var r = new RegExp("\\s" + css + ":([^;]*);", "g");
        code = code.replace(r, css + ":$1;-webkit-" + css + ":$1;");
        /*
        while (code.match(r)) {
            code = code.replace(r,css+":$1;-webkit-"+css+":$1;");
        }
        */
    }
    return code;
};
exports.Lss = Lss;
