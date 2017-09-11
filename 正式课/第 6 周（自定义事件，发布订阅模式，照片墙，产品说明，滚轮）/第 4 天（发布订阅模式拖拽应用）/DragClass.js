var Emitter = function (){};
Emitter.prototype.on = function (type,fn){
    // drag1.on('slefdragstart',increaseIndex)
    if(!this[type]){
        this[type] = [];
    }
    // drag1.selfdragstart = [];
    // [increaeasIndx]
    // drag1.ele = div1;
    var a = this[type];
    for(var i=0; i<a.length; i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
    return this;
}
Emitter.prototype.off = function (type,fn){
    var a = this[type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }
}
Emitter.prototype.run = function (type,e){
    var a = this[type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(this/*.ele*/,e);
            }
        }
    }
}

function Drag(ele){
    this.ele = ele; //把要拖拽的元素添加在实例上当作私有属性
    this.l = null; // 这一次的l和t是保存在实例上的。上一次是保存在ele盒子上的
    this.t = null; //l和t是鼠标按下down那一刻鼠标坐标距离盒子(this.ele)偏移量。
    var that = this; // that就是实例
    this.DOWN = function (e){
        // 这的this依然是ele
        //this.down.call(this,e);
        // that.down(e)
        that.down.call(that,e); // 通过实例找到定义在原型上down方法。并且通过call来把down方法中的this修改成实例。由于真正绑定的是DOWN方法，所以事件对象e就在DOWN中产生的。需要把这个e传给down。
    }
    this.MOVE = function (e){
        that.move(e);
    }
    this.UP = function (e){
        that.up(e);
    }
    //on(this.ele,'mousedown',this.down);
    on(this.ele,'mousedown',this.DOWN);

}
// 为了实现继承Emitter上处理自定义事件也就是selfdragstart的on和off和run方法的
Drag.prototype = new Emitter();
Drag.prototype.constructor = Drag;

Drag.prototype.down = function (e){ // mousedown的时候要执行的函数
    // 保证down里的this是实例
    // 先把l和t算出来
    this.l = e.pageX - this.ele.offsetLeft; // 通过this.ele元素计算出来的鼠标坐标距离盒子的距离。重新赋值给在实例上的私有l属性
    this.t = e.pageY - this.ele.offsetTop;
    if(this.ele.setCapture){ // ie ff
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE); // 只要绑定的时候就要考虑到
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }

    // 在down方法的最尾部，通知那些订阅，绑定过 dragstart 这个事件的函数开始执行啦。
    // 因为这个时刻才是dragstart的时刻
    this.run('selfdragstart',e); // drag1 :
    // 执行的时候应该找到drag1.selfdragstart : [increaseIndex]
}
Drag.prototype.move = function (e){
    // 就是给拖拽的盒子的left和top重新赋值。值是根据鼠标的坐标减去l来的
    this.ele.style.left = e.pageX - this.l + 'px'; // 由于l保存在了实例上
    this.ele.style.top = e.pageY - this.t + 'px';
    // 这次没有处理边界
    e.preventDefault(); //处理一个小bug 处理图片拖拽的默认行为
    this.run('selfdraging',e);
}
Drag.prototype.up = function (e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document, 'mousemove',this.MOVE);
        off(document, 'mouseup', this.UP);
    }
    this.run('selfdragend',e);
}
// 接口已经暴露出来了
// 在拖拽这个类的基础上，添加一个小功能。理解为是选装包。
Drag.prototype.range = function (rangeObj){ // 这个函数是用来限制拖拽的时候的范围。
    // 范围其实就是拖拽的时候的left和top的最大值
    // {left : 300, top : 300}

    this.rangeObj = rangeObj;
    this.on('selfdraging',this.limitRange);
}
Drag.prototype.limitRange = function (e){
    //this.range debugger;
    var maxL = this.rangeObj.left;
    var maxT = this.rangeObj.top;
    var curL = this.ele.offsetLeft; //这个是已经生效的样式了
    var curT = this.ele.offsetTop;
    if(curL > maxL){
        curL = maxL;
    }
    if(curT > maxT){
        curT = maxT;
    }
    this.ele.style.left = curL + 'px';
    this.ele.style.top = curT + 'px';
}







