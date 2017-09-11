//get ele
var banner = utils.getElesByClass('banner')[1];

var bannerInner = utils.getElesByClass('bannerInner',banner)[0];
var focusList = utils.children(banner,'ul')[0];
var left = utils.getElesByClass('left',banner)[0];
var right = utils.getElesByClass('right',banner)[0];
var imgs = bannerInner.getElementsByTagName('img');
var lis = focusList.getElementsByTagName('li');
//getData
;(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+new Date().getTime(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState ==  4 && /^2\d{2}$/.test(xhr.status)){
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
// bindData
;(function (){
    if(window.data){
        var strImg = '';
        var strLi = '';
        for(var i=0; i<data.length; i++){
            strImg += '<div><img src="" realSrc="'+data[i].src+'"></div>';
            strLi += i === 0 ? '<li class="selected"></li>' :'<li></li>';
        }
        bannerInner.innerHTML = strImg;
        focusList.innerHTML = strLi;
    }
})();
// 验证图片有效性
;(function imgsLoad(){ // imgs : [img,img,img,img]
    for(var i=0; i<imgs.length; i++){
        ;(function (i){
            var curImg = imgs[i];
            var tempImg = new Image();
            tempImg.src = curImg.getAttribute('realSrc');
            tempImg.onload = function (){
                curImg.src = this.src;
                utils.css(curImg,'display','block');
                if(i === 0 ){ // 这是第一张
                    utils.css(curImg.parentNode,'zIndex',1);
                    animate(curImg.parentNode,{opacity:1},500);
                }
            }
        })(i);
    }
})();
// 自动轮播
var timer = window.setInterval(autoMove,2000);
var step = 0;
function autoMove(){
    step++;
    if(step == data.length){ // step++之后的值就是我下一次要显示的图片。当运动到最后一张图片，最后一张图片的索引是data.length-1，如果step++之后的值和data.length相等。那么我们已经没有索引为data.length的图片。所以设置目标值为0
        step = 0;
    }
    setImg();
}
function setImg(){ // 负责让和step的值相等的那一张图片的层级为1，其他的图片的层级全部设置成0
    for(var i=0; i<imgs.length; i++){
        var curImg = imgs[i];
        if(i === step){
            utils.css(curImg.parentNode,'zIndex',1);
            // 当层级已经提高之后，让透明度立刻从0运动到1
            animate(curImg.parentNode,{opacity : 1},300,function (){
                var siblings = utils.siblings(this); //除了当前运动元素的其他兄弟节点(也就是除了刚刚层级提高的那个图片盒子之外的其他所有盒子)
                for(var i=0; i<siblings.length; i++){
                    utils.css(siblings[i],'opacity',0);
                }
            });
        }else{
            utils.css(curImg.parentNode,'zIndex',0);
        }
    }
    // 焦点对齐的代码
    for(var i=0; i<lis.length; i++){
        lis[i].className = i === step ? 'selected' : '';
    }
}
// 滑过清空定时器并且显示左右按钮
banner.onmouseover = function (){
    window.clearInterval(timer);
    left.style.display = right.style.display = 'block';
}
// 鼠标离开的时候启动定时器然后隐藏左右按钮
banner.onmouseout = function (){
    timer = window.setInterval(autoMove,2000);
    left.style.display = right.style.display  = 'none';
}
// 点击焦点对应切换图片
;(function (){
    for(var i=0; i<lis.length; i++){
        var curLi = lis[i];
        curLi.index = i;
        curLi.onclick = function (){
            step  = this.index;
            setImg(); //循环所有图片和step对应上才显示。执行这个函数的时候，先宝恒step的值先被修改过了
        }
    }
})();
// 点击左右也要切换图片
left.onclick = function (){
    step--;
    if(step == -1){
        step = data.length-1;
    }
    setImg();
}
right.onclick = autoMove;





