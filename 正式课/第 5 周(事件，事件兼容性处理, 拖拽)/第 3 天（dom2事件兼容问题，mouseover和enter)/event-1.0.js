/**
 * event.js处理dom2事件绑定在ie6-8中的各种兼容问题
 */

/**
 * bind处理事件绑定的兼容性问题
 * @param ele 给ele绑定事件
 * @param type 给ele绑定type事件  eg: 'click'  'mouseover' ...
 * @param fn  给ele的type事件绑定fn函数
 */
// div1.addEventListener(click,fn1);
// div1.attachEvent(click,fn1)
function bind(ele,type,fn){ // 绑定事件
    if(ele.addEventListener){
        ele.addEventListener(type,fn);
        return;
    }
    // 这个判断执行之后一定会在ele的my+type的自定义属性上有一个数组
    if(!ele['my'+type]){ //这是在获取ele.my+'click' => ele.myclick
        ele['my'+type] = []; // 如果没有就添加一个
    }
    // 代码运行到这一行的时候已经存在一个叫做ele.myclick = []这么一个数组了，这个数组装载经过处理过this的tempFn
    var a = ele['my'+type]; // 数组名字太长，操作起来不方便

    var tempFn = function (){ // 为了处理把this处理为ele。真正绑定给ele的type事件的函数不是fn，而是这个tempFn.
        fn.call(ele);
    }
    tempFn.origin = fn; // 让这个tempFn在绑定之前添加一个自定义属性记录自己原来是哪个函数经过包装的。添加这个属性是为了移除事件的时候还能根据fn找到真正要移除哪个tempFn.
    a.push(tempFn);  // 把经过处理过this的tempFn添加到这个自定义属性数组中。因为那个ele的事件池我们不能获取，然后移除的时候还必须要找到这个函数。所以我们才造这么个数组。保存已经绑定过后的tempFn
    ele.attachEvent('on'+type,tempFn);
}

function unbind(ele,type,fn){
    if(ele.removeEventListener){ // 标准浏览器
        ele.removeEventListener(type,fn);
        return;
    }
    // IE6-8
    var a = ele['my'+type]; //直接通过事件类型先找到这个数组。
    if(a){
        for(var i=0; i<a.length; i++){
            var tempFn = a[i]; // 数组里的每一项原来都是tempFn，只是那个自定义origin的属性值是不同函数fn
            if(tempFn.origin === fn){
                ele.detachEvent('on'+type,tempFn);
                a.splice(i,1);
                break;
            }
        }
    }

    ele.detachEvent('on'+type,fn);
}
//&&&&&&&&&&&&&&&&&下午&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
/*
*   addEventListener('click',fn1)
*   addEventListener('click',fn1) // 同一个事件同一个函数不支持绑定多次
*   addEventListener('click',fn2)
*   addEventListener('click',fn3)
*
*   attachEvent('onclick',fn1)
*   attachEvent('onclick',fn2)
*   attachEvent('onclick',fn3)
*
*   1 绑定函数的执行顺序有问题
*   2 函数中的this也有问题  window  解决
*   3  重复绑定的问题
*
*
* */
// div1.attachEvent('click',fn1)
function bind(ele,type,fn){
    //判断是否可以使用标准浏览器的方法

    if(ele.addEventListener){
        ele.addEventListener(type,fn);
        return;
    }
    // for ie6-8  // 处理this的问题
    var tempFn = function (){ // 这种写函数的方式也很常用
        fn.call(ele)
    }

    // 为了移除才写的代码  Start
    tempFn.origin = fn; //用来记录这个tempFn在绑定之前是哪个函数，为了移除的时候还能通过fn来找到这个绑定的tempFn函数

    if(!ele['my'+type]){ // ele.myclick ??? 不存在是undefined，我就添加一个自定义属性模拟事件池
        ele['my'+type] = []; //同一个事件只会执行一次
    }
    // 这个模拟的数组事件池已经造好，那么把这个tempFn添加到数组中一个，添加到事件池中一个
    var a = ele['my'+ type ]; //名字太长

    // 为了处理重复绑定  Start
    for(var i=0; i<a.length; i++){
        // 遍历自定义属性数组，如果数组中的tempFn.origin和传进来的参数fn相等。那么比如曾经绑定过。直接return掉
        if(a[i].origin === fn){
            return;
        }
    }
    // 为了处理重复绑定  End


    a.push(tempFn); //添加到数组中
    //  为了移除才写的代码  End

    // 添加到事件池只有attachEvent才能做

    ele.attachEvent('on'+type,tempFn); // 为了处理this的问题。我们把传进来的fn函数包装一层匿名函数，真正绑定的确是叫做tempFn的函数。

}

function unBind(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn);
        return;
    }
    // for ie 6-8
    var a = ele['my'+type];  // div1.mykeydown   undefined
    if(a){ // 为了防止直接移除没有绑定过的函数   unBind(div1,'keydown',fn1);
        for(var i=0; i<a.length; i++){ // div1.myclick : [tempFn(fn1),tempFn(fn2),tempFn(fn3)]
            var  tempFn = a[i]; //
            if(tempFn.origin === fn){
                a.splice(i,1); //
                ele.detachEvent('on' + type,tempFn);
                break;
            }

        }
    }


}




//bind(div1,'click',fn1); // 我使用的时候我就认为绑定的是fn1这个函数
//unbind(div1,'click',fn1); // 绑定的时候是fn1那么移除的时候必然也是通过fn1来移除


// 成功处理了this和重复绑定的问题  => 顺序问题还没有处理 =>  还不能处理顺序问题，如果只绑定一个函数那么bind已经很完美了。如果绑定多个函数顺序仍然是乱的



