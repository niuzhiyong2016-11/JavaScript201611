/**
 *  new Drag(div1).on('selfdragstart',increaseZIndex);
 *  on(drag1,'selfdragstart',handler) 我是操作这个实例么？
 *  如果不做任何处理，记住如果想操作绑定selfdragstart/selfdraging/selfdragend事件函数中的this是new Drag,而你要操作的那个元素在new Drag.element上呢
 */
function Emitter(){}
Emitter.prototype.on = function (type,fn){
    if(!this[type]){
        this[type] = [];
    }
    var a = this[type];
    for(var i=0; i<a.length; i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
    return this; // 为了能on完了之后继续使用on方法 => 链式写法
}
Emitter.prototype.off = function (type,fn){
    var a = this[type];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }
    return this;
}
Emitter.prototype.run = function (type,e){
    var a = this[type];
    if(a && a.length){
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

function Drag(ele){
    this.element = ele;
    this.l = null;
    this.t = null;
    var that = this;
    this.DOWN = function (e){
        that.down(e);
    }
    this.MOVE = function (e){
        that.move(e);
    }
    this.UP = function (e){
        that.up(e);
    }
    on(this.element,'mousedown',this.DOWN);
}

Drag.prototype = new Emitter();
Drag.prototype.constructor = Drag;

Drag.prototype.down = function (e){
    // this => new Drag()
    this.l = e.pageX - this.element.offsetLeft;
    this.t = e.pageY - this.element.offsetTop;
    if(this.element.setCapture){
        this.element.setCapture();
        on(this.element,'mousemove',this.MOVE);
        on(this.element,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
    // 我准备开始拖拽啦 => 广播通知 => 哪些函数绑定过这个事件那么就可以在这个时刻执行了。
    this.run('selfdragstart',e);
}

Drag.prototype.move = function (e){
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
    var minL = 0, minT = 0;
    var maxL = (document.documentElement.clientWidth||document.body.clientWidth) - this.element.offsetWidth;
    var maxT = (document.documentElement.clientHeight|| document.body.clientHeight) - this.element.offsetHeight;
    l = l < minL ? minL : l > maxL ? maxL : l;
    t = t < minT ? minT : t > maxT ? maxT : t;
    this.element.style.left = l + 'px';
    this.element.style.top = t + 'px';
    e.preventDefault(); //图片拖拽会有问题
    // move方法在执行的时候，那一定在拖拽的过程中。那么不管谁订阅了拖拽(或者说绑定了拖拽中)的事件，都在这一会触发。
    this.run('selfdraging',e);
}
Drag.prototype.up = function (e){
    if(this.element.releaseCapture){
        this.element.releaseCapture();
        off(this.element,'mousemove',this.MOVE);
        off(this.element,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    // 最后这一步虽然容易忘记，但是这一行代码才是真正让拖拽和其他在拖拽过程中要执行的函数联系起来的根本。这就是拖拽产品主动普露给别人的接口。
    this.run('selfdragend',e);
}
