/**
 *  只处理执行的时候的顺序问题
 */
// 和jq里的on类似负责给元素绑定事件
function on(ele,type,fn){
    if(!ele['AAA'+type]){
        ele['AAA'+type] = [];
    }
    var a = ele['AAA'+type]; //为了操作简单而已
    for(var i = 0; i<a.length; i++){
        if(a[i] == fn){
            return;
        }
    }
    a.push(fn);
    // 上面的所有的代码只是把要绑定的函数放到了一个对应事件类型的自定义属性数组里
    bind(ele,type,run); //这个才是绑定事件的操作,当事件触发的时候真正执行的函数是run。run这个函数负责先根据type找到自己对应的数组。然后按照顺序执行数组里所有的函数
}

function run(e) {
    e = e || window.event;
    var isLowIE = !e.target; // 如果e.target都不存在那么就是低版本的ie
    if(isLowIE){
        e.pageX = (document.documentElement.scrollLeft||document.body.scrollLeft) + e.clientX;
        e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
        e.target = e.srcElement;
        e.preventDefault = function (){ e.returnValue = false;  }
        e.stopPropagation = function (){ e.cancelBubble = true; }
    }
    //var a = ele['AAA'+click];
    var a = e.target['AAA' + e.type];
    console.log(a);
    if(a){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(e.target,e); // ????this???
            }else{ //不是函数的时候一定是null
                a.splice(i,1); // 如果是null那么就删掉。但是按照顺序执行的时候会形成数组塌陷。所以还要i--
                i--;
            }

        }
    }
}
//   div1.AAAclick = [fn1,fn2,fn3,fn4,fn5,fn6]
//   div1.AAAclick = [null,fn2,null,fn4,fn5,fn6]
//                     0   1  2   3   4   5
//  off(div1,'click',fn3);
function  off(ele,type,fn){
    var a = ele['AAA'+type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                //a.splice(i,1);  只有在事件触发按照顺序执行函数的过程中移除事件绑定才会复现数组塌陷问题。那么就会漏掉函数执行
                a[i] = null;
                break;
            }
        }
    }
}




