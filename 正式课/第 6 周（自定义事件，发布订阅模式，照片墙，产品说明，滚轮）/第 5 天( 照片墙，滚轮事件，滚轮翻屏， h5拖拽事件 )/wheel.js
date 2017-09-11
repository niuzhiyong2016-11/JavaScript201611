/**
 * 处理 DOM鼠标滚轮 事件的兼容性问题
 */

/*addWheelEventListener(div1,function (isDown,e){
    if(isDown){

    }
})*/
;(function (){
    function addWheelEventListener(ele,handler){
        if(window.navigator.userAgent.indexOf('Firefox') !== -1){
            ele.addEventListener('DOMMouseScroll',fn);
        }else{
            ele.onmousewheel = fn;
        }
        function fn(e){
            e = e || window.event;
            var isDown = null;
            if(e.wheelDelta){ // ie/chrome
                isDown = e.wheelDelta < 0; // -120
            }else if(e.detail){
                isDown = e.detail > 0;
            }
            // 如果滚动向下或者向上要执行的代码是从这里开始，从这个位置就开始区分向下滚动要做什么，向上滚动要做什么
            if(typeof handler == 'function'){
                handler.call(ele,isDown,e);
            }
            /*
             fn(isDown);
             if(isDown){
             // 这个位置需要你向下的时候要执行的函数
             fndown()
             }else{
             // 这个位置是向上的时候执行的函数
             fnup();
             }*/
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        }
    }
    // 函数内部的私有变量在外面还想用，利用回调函数的方式
    window.addWheelEventListener =  addWheelEventListener;
})();






