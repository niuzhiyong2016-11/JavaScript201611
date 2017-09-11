/**
 * 这是简单升级一下on和off还有run等方法。为了在处理自定义事件selfdragstart或者selfdraging等。
 */

function on(ele,type,fn){ // type: mousedown  self...
    // 如果是自定义事件那么就不用下面我们以前处理原生系统事件的代码
    // 只要以self开头我们以后就认定为这是自定义事件
    if(/^self/.test(type)){ // self....自定义事件
        if(!ele[type]){   // div1.selfdragstart = []
            // div1.selfdragend : [fly,drop]
            ele[type] = [];
        }
        var a = ele[type];
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                return;
            }
        }
        a.push(fn);
        return; // 如果是自定义事件那么就到此为止，下面的代码都是曾经处理mousedown等系统事件的
    }


    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    if(!ele['AAA'+type]){
        ele['AAA'+type] = [];
        ele.attachEvent('on'+type,function (){  run.call(ele/*,window.event*/); })
    }
    var a = ele['AAA'+type];
    for(var i=0; i<a.length; i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
}
function run(e){
    e = window.event;
    e.target = e.srcElement;
    e.pageX = (document.documentElement.scrollLeft||document.bodyk.scrollLeft) + e.clientX;
    e.pageY = (document.documentElement.scrollTop||document.body.scrollTop) + e.clientY;
    e.preventDefault = function (){  e.returnValue = false;  }
    e.stopPropagation = function () { e.cancelBubble = true; }
    // ele['AAA'+type]
    var a = this['AAA' + e.type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}

function off(ele,type,fn){
    //自定义事件
    if(/^self/.test(type)){
        var a = ele[type];
        if(a){
            for(var i=0; i<a.length; i++){
                if(a[i] === fn){
                    a[i] = null;
                    break;
                }
            }
        }
        return; //这个return别忘记了。
    }



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

function selfRun(type,e){ // div1.selfdragend : [fly,dorp]
    var a = this[type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function processThis(callback,context){
    return function (e){
        callback.call(context,e);
    }
}
