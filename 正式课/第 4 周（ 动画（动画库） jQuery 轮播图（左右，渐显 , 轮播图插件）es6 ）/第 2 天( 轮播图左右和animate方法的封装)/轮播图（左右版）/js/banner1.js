var banner = utils.getElesByClass('banner')[0];
var bannerInner = utils.getElesByClass('bannerInner',banner)[0];
var focusList = utils.children(banner,'ul')[0];
var left = utils.children(banner,'a')[0];
var right = utils.children(banner,'a')[1];
var imgs = bannerInner.getElementsByTagName('img');
var lis = focusList.getElementsByTagName('li');
//getData
;(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data); // Position JSON  date is not defined
// bindData
;(function bindData(){
    if(window.data){
        var str = '';
        var strLi = '';
        for(var i=0; i<data.length; i++){
            str += '<div><img src="" realSrc="'+data[i].src+'"></div>';
            strLi +=  i == 0 ? '<li class="selected"></li>' : '<li></li>';
        }
        str += '<div><img src="" realSrc="'+ data[0].src +'"></div>'; //在末尾增加一张图片，为了图片在轮播的时候保证无缝连接的
        utils.css(bannerInner,'width',1000*(data.length+1)); //由于多了一张图，但是bannerInner并不够宽，所以需要重新设置宽度,这个宽度其实就是获取或来的数据.length+1
        bannerInner.innerHTML = str;
        focusList.innerHTML = strLi;
    }
})();
// 图片有效性验证
;(function imgsLoad(){
    for(var i=0; i<imgs.length; i++){
        ;(function (i){
            var curImg = imgs[i]; //每一张图片，但是此时src还没有值
            var tempImg = document.createElement('img');
            tempImg.src = curImg.getAttribute('realSrc');
            tempImg.onload = function (){
                curImg.src = this.src;
                utils.css(curImg,'display','block');
                animate(curImg,{opacity : 1},500);
            }
        })(i);
    }
})();


// 轮播图开始
var timer = window.setInterval(autoMove,2000); //这个定时器负责多久更换一次图片
var step = 0; // 默认第一张显示
function autoMove(){ //这个方法就是负责轮播的
    if(step == data.length){
        step = 0;
        utils.css(bannerInner,'left',step*-1000);
    }
    step++; // 0=>1 那么step++之后的值就是我下一次要运动到的终点
    animate(bannerInner,{left : step*-1000},500); //500ms必须要小于timer这个定时器的时间间隔。
    focusAlign(); // 每次轮播之后都需要执行一次焦点跟随
}
function focusAlign(){ // 让焦点和轮播图对应
    var tempStep = step == lis.length ? 0 : step; // 如果step等于123的时候li都有对应的。如果step=4的时候，已经轮播到第五张图片。显示的内容从视觉上看是第一张。所以下面的焦点要对应索引0. 不能更改step的值。因为step是下一次运动到的终点。是全局变量，如果修改了那么就乱了。
    for(var i=0; i<lis.length; i++){
        lis[i].className = i === tempStep ? 'selected' : '';
    }
}

// 给banner绑定事件
banner.onmouseover = function (){
    window.clearInterval(timer); // 鼠标悬停清空定时器，停止轮播
    utils.css(left,'display','block');
    utils.css(right,'display','block');
}
banner.onmouseout = function (){
    timer = window.setInterval(autoMove,2000); // 鼠标离开继续启动定时器开始轮播。必须要给timer重新赋值。保证下次悬停的时候还能找到这个定时器
    left.style.display = right.style.display = 'none';
}
// 点击左右按钮还要切换
left.onclick = function (){
    if(step == 0){
        step = data.length; // 4
        utils.css(bannerInner,'left',step*-1000); //直接设置到这个位置
    }
    step--;
    animate(bannerInner,{left : step*-1000},500);
    focusAlign();
}
/*right.onclick = function (){
    autoMove();
}*/
right.onclick = autoMove;

//给焦点圈绑定点击事件，当时点击的时候切换到对应焦点的图片
;(function bindEvent(){
    for(var i=0; i<lis.length; i++){ //每个焦点框都需要绑定
        var curLi = lis[i];
        curLi.index = i; // 给每一个li都要添加一个自定义属性来保存索引，当点击的时候通过this.index来获取到这个索引。并且step的值就是这个索引。
        curLi.onclick = function (){
            // 点击发生
            step = this.index; // 保证下次轮播还可以从当前点击的这个位置开始
            animate(bannerInner, {left: step*-1000},500);
            focusAlign();
        }
    }
})();

// bug: 当自动轮播到第一张图片（视觉）其实真正的是第五张图片。当我点击第二张焦点圈的时候，不是从第一张顺序切换，而是从第五张倒退回来的。。。这个问题如何处理？？？


