var tableBox = document.getElementById('table');
var table = tableBox.getElementsByTagName('table')[0];

var tHead = table.tHead;
var tHeadRow = tHead.rows[0];
var ths = tHeadRow.cells;

var tBody = table.tBodies[0];
var tBodyTrs = tBody.rows;

// 通过Ajax来获取这些数据
/*
*   ajax: Async (异步)  Javascript and XML
*   作用: 专门用来去后台获取数据的。
*   步骤: 1 先创建一个异步对象 => 就是去后台拿数据那个载体
*        2  约定好方式  xhr.open(  以什么样的方式去拿get/post,    去哪拿数据data.txt, 同步还是异步false/true )
*       3 约定状态  绑定事件onreadystatechange readyState == 4 && status==200 这才是成功返回
*           404 找不到页面
*           200 成功 => 2开头的都是成功
*           304 本地缓存
*           501 服务端
*       4 出发  xhr.send(null);
* */
/*
*   同步和异步: 同步是如果上一个任务没有完成，那么下一个任务不开始
*             异步是可以同时进行多个任务
*             同步阻塞代码的运行，异步不阻塞代码运行
* */
(function getData() {
    var xhr = new XMLHttpRequest();

    xhr.open('get', 'js/data.txt', false);

    xhr.onreadystatechange = function () {
        console.log(xhr.readyState);
        if (xhr.status === 200 && xhr.readyState === 4) {
            window.data = utils.jsonParse(xhr.responseText);
        }
    };

    xhr.send(null);
})();

(function bindData() {
    if (window.data) {
        var frg = document.createDocumentFragment(); //创建文档碎片
        for (var i = 0; i < data.length; i++) {
            var curData = data[i];
            var tr = document.createElement('tr'); //创建一个行

            for (var key in curData) {
                var td = document.createElement('td');
                if (key === 'sex') {
                    td.innerHTML = curData[key] === 1 ? "男" : "女";
                } else {
                    td.innerHTML = curData[key];
                }
                tr.appendChild(td);
            }

            frg.appendChild(tr); //把行添加到文档碎片
        }
        tBody.appendChild(frg); //把文档碎片添加到tbody
        frg = null;
    }
})();

function changeColor() {
    for (var i = 0; i < tBodyTrs.length; i++) {
        tBodyTrs[i].className = 'c' + i % 2;
    }
}

changeColor();

function sort() {
    for (var i = 0; i < ths.length; i++) {
        if (ths[i] !== this) {
            ths[i].sortFlag = -1;
        }
    }
    var tBodyTrsAry = utils.listToArray(tBodyTrs);
    var that = this;
    that.sortFlag *= -1;
    tBodyTrsAry.sort(function (a, b) {
        var _a = a.cells[/*n*/that.index].innerHTML;
        var _b = b.cells[/*n*/that.index].innerHTML;
        if (isNaN(_a) || isNaN(_b)) { // 或者条件
            return (_a.localeCompare(_b)) * that.sortFlag;
        }
        return (_a - _b) * that.sortFlag;
    });
    var frg = document.createDocumentFragment();
    for (var i = 0; i < tBodyTrsAry.length; i++) {
        frg.appendChild(tBodyTrsAry[i]);
    }
    tBody.appendChild(frg);
    frg = null;
}

(function bindEvent() {
    for (var i = 0; i < ths.length; i++) {
        if (ths[i].className === 'cursor') {
            ths[i].index = i;
            ths[i].sortFlag = -1;
            ths[i].onclick = function () {
                sort.call(this);
                changeColor();
            }
        }
    }
})();