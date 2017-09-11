function down(e) {
    this.l = e.pageX - this.offsetLeft;
    this.t = e.pageY - this.offsetTop;
    if (this.setCapture) {
        this.setCapture();
        on(this, 'mousemove', move);
        on(this, 'mouseup', up);
    } else {
        var that = this;
        this.MOVE = function (e) {
            move.call(that, e)
        };
        this.UP = function (e) {
            up.call(that, e)
        };
        on(document, 'mousemove', this.MOVE);
        on(document, 'mouseup', this.UP);
    }
    window.clearTimeout(this.timer);
    window.clearTimeout(this.timerY);
}
function move(e) {
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
    var minL = 0, maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.offsetWidth;
    l = l < minL ? minL : l > maxL ? maxL : l;
    var minT = 0, maxT = (document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight;
    t = t > maxT ? maxT : t < minT ? minT : t;
    this.style.left = l + 'px';
    this.style.top = t + 'px';
    e.preventDefault();
    if (this.prevPos) {
        this.speed = this.offsetLeft - this.prevPos;
    }
    this.prevPos = this.offsetLeft;
}
function up(e) {
    if (this.releaseCapture) {
        this.releaseCapture();
        off(this, 'mousemove', move);
        off(this, 'mouseup', up);
    } else {
        off(document, 'mousemove', this.MOVE);
        off(document, 'mouseup', this.UP);
    }
    fly.call(this, e);
    drop.call(this,e);
    //bg.call(this,e);
    //border.call(this,e);
}

function fly(e) {
    this.speed  *= 0.98;
    var curL = this.offsetLeft;
    curL += this.speed;
    var minL = 0;
    var maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.offsetWidth;
    if (curL < minL) {
        this.style.left = minL + 'px';
        this.speed *= -1;
    } else if (curL > maxL) {
        this.style.left = maxL + 'px';
        this.speed *= -1;
    } else {
        this.style.left = curL + 'px';
    }
    if(Math.abs(this.speed) > 0.5){
        this.timer = window.setTimeout(processThis(fly,this),10);
    }
}
function drop(e){
    var curTop = this.offsetTop;
    this.speedY = !this.speedY ? 9.8 : this.speedY + 9.8;
    this.speedY *= 0.98;
    curTop += this.speedY;
    var maxTop = (document.documentElement.clientHeight||document.body.clientHeight) - this.offsetHeight;
    if(curTop > maxTop ){
        this.style.top = maxTop + 'px';
        this.speedY *= -1;
        this.dropFlag++;
    }else{
        this.style.top = curTop + 'px';
        this.dropFlag = 0;
    }
    if(this.dropFlag < 2){
        this.timerY = window.setTimeout(processThis(drop,this),10);
    }

}



/**
 * 处理this的函数
 * @param callback  我要处理callback函数中的this
 * @param context 我要把callback函数中的this处理成context
 * @returns {Function}
 */
function processThis(callback,context){ // 处理this
    return function (e){
        callback.call(context,e);
    }
}
//
// function fly(e) {
//     var that = this;
//     var minLeft = 0;
//     var maxLeft = (document.documentElement.clientWidth || document.body.clientWidth) - that.offsetWidth;
//     that.timer = window.setInterval(function () {
//         var l = that.offsetLeft;
//         l = that.speed + l;
//         that.speed *= 0.98;
//         if(Math.abs(that.speed) < 0.5){
//             window.clearInterval(that.timer);
//             return;
//         }
//         if (l > maxLeft) {
//             that.style.left = maxLeft + 'px';
//             that.speed *= -1;
//         }
//         else if (l < minLeft) {
//             that.style.left = minLeft + 'px';
//             that.speed *= -1;
//         }
//         else {
//             that.style.left = l + 'px';
//         }
//     }, 10);
// }