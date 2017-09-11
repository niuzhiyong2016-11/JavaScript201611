
function Drag(ele) { // div1
    this.ele = ele; // 把要拖拽的dom元素对象添加在实例的私有属性上，在其他的方法中(原型上的方法)如果再想使用这个ele元素。只能通过this.ele调用.时刻保证this是实例
    this.l = null; // 鼠标按下那一刻鼠标坐标距离ele的偏移量
    this.t = null; // 只有在按下那一刻才能获取。暂时赋值为null
    var that = this;
    this.DOWN = function (e){
        // this : ele
        that.down.call(that,e);
    }
    this.MOVE = function (e){
        that.move.call(that,e);
    }
    this.UP = function (e){
        that.up.call(that,e);
    }
    //on(this.ele,'mousedown',this.down); // this.down方法中的this是this.ele。 this.ele => div1 => this.down方法中的this变成要拖拽的那个元素。
    on(this.ele,'mousedown',that.DOWN);
}
Drag.prototype.down = function (e){
    // 我要保证这个函数中的this是实例
    // 因为没有直接把这个down方法绑定给ele，我们是通过DOWN处理了这个this为实例
    this.l = e.pageX - this.ele.offsetLeft; //盒子已经是this.ele了
    this.t = e.pageY - this.ele.offsetTop; // 一开始是null，在down那一刻我重新赋值
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE); // 由于这个MOVE方法在构造函数中也已经处理过了。所以只要绑定事件就要注意到事件中执行绑定的函数中的this是实例
        on(this.ele,'mouseup',this.UP);
    }else{ // 如果不支持setCapture就绑定给document
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
}
Drag.prototype.move = function (e){
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
    this.ele.style.left = l + 'px';
    this.ele.style.top = t + 'px';
    e.preventDefault(); //在move的时候不要忘记这个，图片的拖拽是有默认行为的.
}
Drag.prototype.up = function (e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
}
// 主动暴露接口让我们的类有拓展性 *** 以后要延伸的方向
