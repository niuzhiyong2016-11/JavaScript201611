//获取元素
var tableBox = document.getElementById('table');
var table = tableBox.getElementsByTagName('table')[0];
var ths = table.tHead.rows[0].cells;
var tBody = table.tBodies[0];
var tBodyRows = tBody.rows;
var data = null;
//获取数据 ajax
;(function getData(){
    // 1,2,3,4
    var xhr = new XMLHttpRequest();
    xhr.open('get','js/data1.txt',false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data);
//绑定数据
;(function bindData(){
    if(data){
        var frg = document.createDocumentFragment();
        for(var i=0; i<data.length; i++){
            var curData = data[i];
            var tr = document.createElement('tr');
            for(var key in curData){
                var td = document.createElement('td');
                if(key ==='sex'){
                    td.innerHTML = curData['sex'] == 1 ? '男' : '女';
                }else{
                    td.innerHTML =  curData[key];
                }
                tr.appendChild(td);
            }
            frg.appendChild(tr);
        }
        tBody.appendChild(frg);
        frg = null;
    }
})();
function changeColor(){
    for(var i=0; i<tBodyRows.length; i++){
        tBodyRows[i].className = i%2 ? 'c0' : 'c1';
    }
}
changeColor();
//绑定事件
;(function bindEvent(){
    for(var i=0; i<ths.length; i++){
        if(ths[i].className == 'cursor'){
            ths[i].index = i;
            ths[i].sortFlag = -1;
            ths[i].onclick = function (){
                sort.call(this,this.index);
                changeColor();
            }
        }
    }
})();
// 排序函数
function sort(n){
    for(var i=0; i<ths.length; i++){
        if(ths[i] !== this){
            ths[i].sortFlag = -1;
        }
    }
    var tBodyRowsAry = utils.listToArray(tBodyRows);
    var that = this;
    that.sortFlag *= -1;
    tBodyRowsAry.sort(function (a,b){
        var _a = a.cells[n].innerHTML;
        var _b = b.cells[n].innerHTML;
        if(isNaN(_a) || isNaN(_b)){
            return (_a.localeCompare(_b))*that.sortFlag;
        }
        return  (_a - _b)*that.sortFlag;
    });
    var frg = document.createDocumentFragment();
    for(var i=0; i<tBodyRowsAry.length; i++){
        frg.appendChild(tBodyRowsAry[i]);
    }
    tBody.appendChild(frg);
    frg = null;
}

