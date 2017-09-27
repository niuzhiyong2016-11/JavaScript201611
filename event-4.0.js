/**
 * 解决问题：
 *   1、顺序问题
 *   2、重复问题
 *   3、this问题
 *   4、'on'问题
 */
function on(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
        return;
    }
    if (!ele["AAA" + type]) {
        ele["AAA" + type] = [];
        ele.attachEvent("on" + type, function () {
            run.call(ele/*,window.event*/);
        });
    }
    var arr = ele["AAA" + type];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === fn) {
            return;
        }
    }
    arr.push(fn);
}
function run(e) {
    e = window.event;
    e.target = e.srcElement;
    e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
    e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
    e.preventDefault = function () {
        e.returnValue = false;
    };
    e.stopPropagation = function () {
        e.cancelBubble = true;
    };
    var arr = this["AAA" + e.type];
    if (arr && arr instanceof Array) {
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] === "function") {
                arr[i].call(this, e);
            } else {
                arr.splice(i, 1);
                i--;
            }
        }
    }
}
function off(ele, type, fn) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fn, false);
        return;
    }
    var arr = ele["AAA" + type];
    if (arr && arr instanceof Array) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === fn) {
                arr[i] = null;
                break;
            }
        }
    }
}