/*
*   1 处理this
*   2 处理重复
*   3 处理顺序
* */
//on(div1,'click',fn1); // => 已经成功绑定事件
// 给ele元素的type事件绑定fn函数
function on(ele,type,fn){ // 负责绑定事件
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    // for ie6-8
    if(!ele['AAA'+type]){ // 如果不存在就创建一个
        ele['AAA'+type] = [];
        // 这个run方法和这个数组一样，同一个事件类型只能绑定一个run方法。这个自定义属性数组也是，同一个数组只能创建一次
        ele.attachEvent('on'+type,function (){ run.call(ele/*window.event*/); });
    }
    var a = ele['AAA'+type];  //操作起来麻烦写个变量
    for(var i=0; i<a.length; i++){ //如果曾经在同一个事件上绑定过fn函数那么就不要在绑定第二次了
        if(a[i] === fn){
            return; //如果绑定过直接return
        }
    }
    a.push(fn); // 把要绑定在事件上fn函数添加到对应这个事件的数组中
}

function run(e){ // 这个函数才是真正负责按照顺序执行对应事件类型数组中的所有函数
    // 这个run方法也没有事件对象。在ie6-8中的事件对象在window.event上存储。
    e = window.event;
    e.target = e.srcElement;
    e.pageX = (document.documentElement.scrollLeft||document.body.scrollLeft) + e.clientX;
    e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
    e.stopPropagation = function (){  e.cancelBubble = true;  }
    e.preventDefault = function (){ e.returnValue = false; }
    //e.target
    // this => run方法中的this在on方法中就通过call修改成了ele
    //ele['AAA'+click]  e.type
    var a = this['AAA' + e.type];
    if(a){
        // 拿到对应事件类型的数组之后，循环按照索引执行
        for(var i=0; i<a.length; i++){
            // a[i]就是在对应事件类型比如AAAclick数组中的函数。fn1,fn2...然后函数在被执行的时候我们应该按照事件的this逻辑把a[i]函数中的this修改成ele.然后在当前这个run函数中的this就是ele。这是在on方法中通过call修改的。那么就是把a[i]中的this修改成当前函数中的this。并且把已经处理好的e也传给a[i];
            if(typeof a[i] === 'function'){ //因为这个数组中可能在off执行之后有null  [fn1,null,fn3,fn4....]
                a[i].call(this/*ele*/,e);
            }else{ //如果是else里那么说明当前项是null
                a.splice(i,1); //如果在执行的过程中遇到null那么就把这个null删掉，run须保证所有的函数都要执行到。只要删除一项就会漏掉一项。所以需要i--
                i--;
            }
        }
    }
}

//off(div1,'click',fn1); //
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    // for ie 6-8
    // 先找到对应事件类型的自定义属性数组，然后把数组中的fn删除掉
    var a = ele['AAA'+type];
    if(a){
        for(var i=0; i<a.length; i++){
            //循环遍历看看哪个和fn相等
            if(a[i] === fn){
                //a.splice(i,1);
                a[i] = null; //在执行run方法的过程中移除就会有塌陷问题。所以我们不用splice就把这个要移除的函数设置为null。现在数组中可能就会出现[fn1,null,fn3...] 所以在run在按照顺序执行的时候就需要判断是不是函数。
                break; // 因为在on方法中处理过重复绑定的问题。所以找到了一个fn就可以直接删了。因为不可能出现第二个fn
            }
        }
    }
}
//off(div1,'haha',fn1);

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    if(!ele['AAA'+type]){
        ele['AAA'+type] = [];
        ele.attachEvent('on'+type,function () {
            run.call(ele);
        });
    }
    var a = ele['AAA'+type];
    for(var i=0; i<a.length; i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
    // 把fn添加到type对应的自定义属性数组
    // 在on方法中给每一个type事件类型绑定唯一的run方法
}

function run(e){
    e = window.event;
    e.target = e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.stopPropagation = function (){
        e.cancelBubble = true;
    }
    e.preventDefault = function () {
        e.returnValue = false;
    }
    // ele['AAA'+click]
    var a = this['AAA'+e.type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(this,e);
            }else{
                // [null,fn1,fn2...]
                a.splice(i,1);
                i--;
            }
        }
    }
    // run先找到自己对应的数组  this e.type
    // 循环执行数组中的函数。 注意执行的this问题，如果是null删掉
}

function off(ele,type,fn) {
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a = ele['AAA'+type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }

}





