(function (){
    //window.down = down;
    //window.animate = animate
})();

function down(e){
    this.l = e.pageX - this.offsetLeft;
    this.t = e.pageY - this.offsetTop;
    if(this.setCapture){
        this.setCapture();
        on(this,'mousemove',move);
        on(this,'mouseup',up);
    }else{
        var that = this;
        this.MOVE = function (e){ // 真正绑定的函数是这个this.MOVE
            move.call(that,e); // 这个e事件对象，是this.MOVE当作参数传给move的
        }
        this.UP = function (e){
            up.call(that,e);
        }
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
    //
    //selfRun.call(this,'selfdragstart',e); // 无论哪个方法订阅过selfdragstart这个事件。那么这一会真的就是已经开始准备拖拽了。那么订阅过这个事件的这些函数就可以执行了

}

function move(e){
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
    this.style.left = l + 'px';
    this.style.top = t + 'px';
    e.preventDefault(); //拖拽图片有默认行为
    //selfRun.call(this,'selfdraging',e);
}

function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,'mousemove',move);
        off(this,'mouseup',up);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    //selfRun.call(this,'selfdragend',e);
}


