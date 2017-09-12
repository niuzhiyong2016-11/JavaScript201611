/**
 * Created by 牛志勇 on 2016/10/21.
 */
var utils = (function () {
    //检测浏览器：标准浏览器为true，非标准浏览器(IE6~8)为false
    var browserFlag = "getComputedStyle" in window;

    /**
     * getRandom:获取n到m之间的随机数
     * @param n
     * @param m
     * @returns {number}
     */
    function getRandom(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.round(Math.random() * (m - n) + n);
    }

    /**
     * formatJSON:把JSON格式字符串转换为JSON格式对象
     * @param JSONStr JSON格式字符串
     * @returns {Object} JSON格式对象
     */
    function formatJSON(JSONStr) {
        return browserFlag ? JSON.parse(JSONStr) : eval("(" + JSONStr + ")");
    }

    /**
     * listToArray:把类数组集合转换为数组
     * @param likeAry
     * @returns {*}
     */
    function listToArray(likeAry) {
        if (browserFlag) {
            return Array.prototype.slice.call(likeAry, 0);
        }
        var ary = [];
        for (var i = 0, len = likeAry.length; i < len; i++) {
            ary.push(likeAry[i]);
        }
        return ary;
    }

    /**
     * win:操作浏览器的盒子模型信息
     * @param attr
     * @param value
     * @returns {*}
     */
    function win(attr, value) {
        if (typeof value !== "undefined") {
            document.documentElement[attr] = value;
            document.body[attr] = value;
            return;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    /**
     * offset:获取页面中任意元素距离BODY的偏移
     * @param ele
     * @returns {{left: *, top: *}}
     */
    function offset(ele) {
        var totalLeft = null, totalTop = null, par = ele.offsetParent;
        totalLeft += ele.offsetLeft;
        totalTop += ele.offsetTop;
        while (par) {
            if (window.navigator.userAgent.indexOf('MSIE 8') === -1) {
                totalLeft += par.clientLeft;
                totalTop += par.clientTop;
            }
            totalLeft += par.offsetLeft;
            totalTop += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: totalLeft, top: totalTop};
    }

    /**
     * getCss:获取元素的样式值
     * @param attr
     * @returns {*}
     */
    function getCss(attr) {
        var value = null, reg = null;
        if (browserFlag) {
            value = window.getComputedStyle(this, null)[attr];
        } else {
            if (attr === "opacity") {
                value = this.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                value = reg.test(value) ? reg.exec(value)[1] / 100 : 1;
            } else {
                value = this.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
        return reg.test(value) ? parseFloat(value) : value;
    }

    /**
     * setCss:给当前元素的某一个样式属性设置值(增加在行内样式上的)
     * @param attr
     * @param value
     */
    function setCss(attr, value) {
        if (attr === "float") {
            this["style"]["cssFloat"] = value;
            this["style"]["styleFloat"] = value;
            return;
        }
        if (attr === "opacity") {
            this["style"]["opacity"] = value;
            this["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += "px";
            }
        }
        this["style"][attr] = value;
    }

    /**
     * setGroupCss:给当前元素批量设置样式属性值
     * @param options
     */
    function setGroupCss(options) {
        //->遍历对象中的每一项，调用setCss方法一个个的进行设置即可
        for (var key in options) {
            if (options.hasOwnProperty(key)) {//只有私有属性才调用setCss
                setCss.call(this, key, options[key]);
            }
        }
    }

    /**
     * css:此方法实现了获取、单独设置、批量设置的样式值
     * @param ele
     * @returns {*}
     */
    function css(ele) {
        var ary = listToArray(arguments).slice(1);
        if (typeof ary[0] === "string") {
            if (typeof ary[1] === "undefined") {
                return getCss.apply(ele, ary);
            }
            setCss.apply(ele, ary);
            return;
        }
        ary[0] = ary[0] || 0;
        if ((ary[0]).toString() === "[object Object]") {
            setGroupCss.apply(ele, ary);
        }
    }

    /**
     * children:获取所有的元素子节点
     * @param ele
     * @param tagName
     * @returns {Array}
     */
    function children(ele, tagName) {
        var ary = [];
        if (browserFlag) {
            ary = Array.prototype.slice.call(ele.children, 0);
        } else {
            var nodeList = ele.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                if (curNode.nodeType === 1) {
                    ary.push(curNode);
                }
            }
            nodeList = null;
        }
        //如果传递了tagName进行二次筛选
        if (typeof tagName === "string") {
            var newAry = [];
            for (i = 0, len = ary.length; i < len; i++) {
                var curEleNode = ary[i];
                if (curEleNode.nodeName.toLowerCase() === tagName.toLowerCase()) {
                    newAry.push(curEleNode);
                }
            }
            ary = null;
            return newAry;
        }
        return ary;
    }

    /**
     * prev:获取上一个哥哥元素节点
     * @param ele
     * @returns {*}
     */
    function prev(ele) {
        if (browserFlag) {
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    /**
     * next:获取下一个弟弟元素节点
     * @param ele
     * @returns {*}
     */
    function next(ele) {
        if (browserFlag) {
            return ele.nextElementSibling;
        }
        var nex = ele.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    /**
     * prevAll:获取所有哥哥元素节点
     * @param ele
     * @returns {Array}
     */
    function prevAll(ele) {
        var ary = [];
        var pre = prev(ele);
        while (pre) {
            ary.unshift(pre);
            pre = prev(pre);
        }
        return ary;
    }

    /**
     * nextAll:获取所有弟弟元素节点
     * @param ele
     * @returns {Array}
     */
    function nextAll(ele) {
        var ary = [];
        var nex = next(ele);
        while (nex) {
            ary.push(nex);
            nex = next(nex);
        }
        return ary;
    }

    /**
     * sibling:获取相邻的两个元素节点
     * @param ele
     * @returns {Array}
     */
    function sibling(ele) {
        var ary = [];
        var pre = prev(ele);
        var nex = next(ele);
        pre ? ary.push(pre) : null;
        nex ? ary.push(nex) : null;
        return ary;
    }

    /**
     * siblings:获取所有的兄弟元素节点
     * @param ele
     * @returns {Array.<*>}
     */
    function siblings(ele) {
        return prevAll(ele).concat(nextAll(ele));
    }

    /**
     * index:获取当前元素的索引
     * @param ele
     * @returns {Number}
     */
    function index(ele) {
        return prevAll(ele).length;
    }

    /**
     * firstChild:获取第一个元素子节点
     * @param ele
     * @returns {null}
     */
    function firstChild(ele) {
        var chs = children(ele);
        return chs.length ? chs[0] : null;
    }

    /**
     * lastChild:获取最后一个元素子节点
     * @param ele
     * @returns {null}
     */
    function lastChild(ele) {
        var chs = children(ele);
        return chs.length ? chs[chs.length - 1] : null;
    }

    /**
     * prepend:向指定容器的开头追加元素
     * @param newEle
     * @param container
     */
    function prepend(newEle, container) {
        var fir = firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return;
        }
        container.appendChild(newEle);
    }

    /**
     * append:向指定容器的末尾追加元素
     * @param newEle
     * @param container
     */
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    /**
     * insertBefore:向容器中指定元素的前面插入元素
     * @param newEle
     * @param oldEle
     */
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    /**
     * insertAfter:向容器中指定元素的后面插入元素
     * @param newEle
     * @param oldEle
     */
    function insertAfter(newEle, oldEle) {
        var nex = next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }

    /**
     * hasClass:验证当前元素中是否包含className这个样式类名
     * @param ele
     * @param className
     * @returns {boolean}
     */
    function hasClass(ele, className) {
        if (typeof className === "string") {
            className = className.replace(/^ +| +$/g, "");
            var reg = new RegExp("(^| +)" + className + "( +|$)");
            return reg.test(ele.className);
        }
    }

    /**
     * addClass:给元素增加样式类名
     * @param ele
     * @param className
     */
    function addClass(ele, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (!hasClass(ele, curName)) {
                ele.className += " " + curName;
            }
        }
        ary = null;
    }

    /**
     * removeClass:给元素移除样式类名
     * @param ele
     * @param className
     */
    function removeClass(ele, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (hasClass(ele, curName)) {
                var reg = new RegExp("(^| )" + curName + "(?=( |$))", "g");
                ele.className = ele.className.replace(reg, " ");
            }
        }
        ary = null;
    }

    /**
     * getElementByClass:通过元素的样式类名获取一组元素集合
     * @param className
     * @param context
     * @returns {*}
     */
    function getElementByClass(className, context) {
        context = context || document;
        if (browserFlag) {
            return listToArray(context.getElementsByClassName(className));
        }
        //IE6~8
        var ary = [];
        var nodeList = context.getElementsByTagName("*");
        var classNameAry = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var curNode = nodeList[i];
            var isOk = true;//假设curNode中包含了所有的样式
            for (var k = 0, len1 = classNameAry.length; k < len1; k++) {
                var curClassName = classNameAry[k];
                var reg = new RegExp("(^| +)" + curClassName + "( +|$)");
                if (!reg.test(curNode.className)) {
                    isOk = false;
                    break;
                }
            }
            if (isOk) {
                ary.push(curNode);
            }
        }
        return ary;
    }

    // Element.prototype.getCss = getCss;
    // Element.prototype.setCss = setCss;
    // Element.prototype.setGroupCss = setGroupCss;

    return {
        getRandom: getRandom,
        formatJSON: formatJSON,
        listToArray: listToArray,
        win: win,
        offset: offset,
        css: css,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        prepend: prepend,
        append: append,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementByClass: getElementByClass
    };
})();