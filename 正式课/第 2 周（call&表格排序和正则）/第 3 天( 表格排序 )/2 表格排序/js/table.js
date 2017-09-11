// 先获取表格中要操作到的元素
var tableBox = document.getElementById('table');
var table = tableBox.getElementsByTagName('table')[0]; //获取表格
//获取表格中表头里面的列th
var tHead = table.tHead; //table.tHead表格特殊的获取方式 获取表头
var tHeadRow = tHead.rows[0]; //tHead下所有行中的第一行
var ths = tHeadRow.cells; //表头第一行下所有的单元格(列)
//console.log(ths);
var tBody = table.tBodies[0]; //获取表格所有tBody中的第一个
var tBodyTrs = tBody.rows; //获取tBody下所有的行
console.log(tBodyTrs); //这里并不存在任何一行，但是在绑定数据之后并不用重新获取，这是由于dom的映射 => 获取的元素集合会随着页面内元素的增加或者删除，集合的长度也会随之增加或者删除
// 在data.txt这个文件中伪造了一些数据，由于这个数据都是在txt文本文件中，所以这些数据暂时就是一个字符串，如果想换成JSON格式还需要处理
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
// 这个自运行函数负责获取数据
;(function getData(){
    var xhr = new XMLHttpRequest(); //固定写法，创建一个异步对象载体。这个xhr就是负责要去后台获取数据的。
    xhr.open('get','js/data1.txt',false); //请求分get和post，data.txt这个参数就是请求的url。false同步/true异步
    // 为什么采用同步: 数据要是没有获取到，那么的下面的其他操作就不用继续了
    xhr.onreadystatechange = function (){
        // 只要xhr的状态改变就会触发这个事件。
        if(xhr.readyState == 4 && xhr.status == 200){
            // 这两个状态组合在一起才是成功返回并且携带数据
            // readyState这个状态代表的xhr是否成功返回
            // xhr.status 代表的xhr还携带data回来的
            //既然数据都回来了，数据肯定在xhr身上
            window.data = utils.jsonParse(xhr.responseText); //xhr的响应文本,数据就在这个属性上
            // 把xhr.responseText赋值给window.data => 相当于添加了一个全局变量data => 只要成功我在外面打印data就不会不错
            // xhr.responseText是字符串 => data.txt是文本文件
        }
    }
    xhr.send(null); //xhr出发
})();
console.log(data);
// 数据已经成功获取到，现在需要把获取到的数据，添加到页面中 => 数据绑定

;(function bindData(){
    if(window.data){ // 要么是数组或者undefined
        //只要是数组我就可以循环，数组里的每一项在表格中就是一行 => tbody的行数和length是相同的
        var frg = document.createDocumentFragment(); //创建文档碎片
        for(var i=0; i<data.length; i++){ //循环执行的次数取决于data里有多少个对象。每一个对象都是一个tr
            var curData = data[i]; //curData就是每次循环时候数组中每一个对象，其实也就是每一条数据,curData都包含5个属性。name,sex,age,height,weight
            var tr = document.createElement('tr'); //创建一个行
            // 向tr这个行中添加列,每个列的标签都是td
            for(var key in curData){ //只要能循环一次，就需要创建一个td。td跟有多少组属性是相同的
                var td = document.createElement('td');
                // td里的内容就是curDate的属性值了
                if(key === 'sex'){ //说明才是循环到性别
                    //if(curData[key] == 1){
                    //    td.innerHTML = '男';
                    //}else{
                    //    td.innerHTML = '女';
                    //}
                    td.innerHTML = curData[key] == 1 ? "男" : "女";
                }else{
                    td.innerHTML = curData[key];
                }

                tr.appendChild(td);
            }

            frg.appendChild(tr); // 把行添加到文档碎片
        }
        tBody.appendChild(frg); // 把文档碎片添加到tbody
        frg = null;
    }
})();

//console.log(tBodyTrs); //不用重新获取
// 隔行变色
function changeColor(){
    for(var i=0; i<tBodyTrs.length; i++){
        tBodyTrs[i].className = 'c' + i%2;
    }
}
changeColor();

// 排序: 就是tbody里的行(tr) 按照 年龄/ 身高/ 体重 .. 上下移动

function sort(/*n*/){ //当前按照哪一列去排序取决于这个n参数,只有点击的那一刻才能确定是按照哪一列去排序。=> 那么就是n的值只有在事件发生的那一刻才能确定。事件发生的那一刻只有this最可靠了。
    for(var i=0; i<ths.length; i++){
        if(ths[i] !== this){ //循环所有的表头只要不是当前点击的这一个，那么我就全部恢复成-1.避免间隔点击排序的时候按照降序排列
            ths[i].sortFlag = -1;
        }
    }
    var tBodyTrsAry = utils.listToArray(tBodyTrs); //把类数组转化成数组
     //？？这个this不能是window => 点击的那个表头才行 => 换this => call

     // 用这个that变量保存this，因为sort方法中也使用this，但是this是window
    console.log(this.sortFlag); //这个this已经在绑定事件函数中通过call方法从原来的window修改成了现在的th（点击的那个表头）
    var that = this; // that这个变量保存就是this=>其实也就是那些点击的表头
    that.sortFlag *= -1;
    tBodyTrsAry.sort(function (a,b){
        // a,b分别都是代表tbody下面的行。是按照行下面列的innerHTML排序
        //需要判断每次排序的时候相邻上下两行其中的内容是不是数字，如果不是那么使用localeCompare方法来做字符串排序 => 只要有一个不是有效数字那么就要使用
        var _a = a.cells[/*n*/that.index].innerHTML;
        var _b = b.cells[/*n*/that.index].innerHTML;
        if(isNaN(_a) || isNaN(_b)){ // 或者条件
            return (_a.localeCompare(_b))*that.sortFlag;
        }
        return  (_a - _b)*that.sortFlag;
        // return cells[n] => 按照那一列排序取决于n
    });
    //把排好序的数组(表格下的所有行)还需要回填到表格中，这样才是排序
    var frg = document.createDocumentFragment();
    for(var i=0; i<tBodyTrsAry.length; i++){
        frg.appendChild(tBodyTrsAry[i]);
    }
    tBody.appendChild(frg);
    frg = null;
}
// 给每一个表头th绑定事件
;(function bindEvent(){
    //循环绑定事件给表头
    for(var i=0; i<ths.length; i++){
        // 不是给所有的表头列都绑定事件，只给带cursor这个类的绑定。在绑定之前要做一个判断，判断是否存在cursor这个类
        if(ths[i].className == 'cursor'){
             //每次点击切换正序还是倒叙使用，每次都在原有的基础上乘以这个自定义属性 => 在sort排序函数中return的值上
            ths[i].index = i; //给每一个表头都添加一个自定义属性，用来保存当前表头自己的索引。=> 当点击发生的时候，排序要按照这个索引来排
            ths[i].sortFlag = -1; //这个是用来在排序的时刻每次乘等于这个自定义属性,正序或者倒叙使用的
            ths[i].onclick = function (){
                //点击的表头的时候,就应该排序了
                //console.log(this); //点击那个表头,但是this上也没有索引。在事件发生之前就给每一个表头添加一个自定义属性。
                console.log(this); //这的this就是那些表头，如果把这个this能传到sort函数中就可以了。 => 能把sort函数中的this修改成这个this就可以了 => call方法可以修改this
                sort.call(this/*,this.index*/); //点击事件发生的时候我才知道sort方法中按照哪一列去排序,this都已经能传到sort函数中。那么this.index必然也能在sort函数中获取到
                changeColor(); // 每次排序之后隔行变色就乱了，所以需要重新执行一次
            }
        }
    }
})();




