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
        str += '<div><img src="" realSrc="'+data[0].src+'"></div>';
        utils.css(bannerInner,'width',(data.length+1)*1000);
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
// 轮播代码
var timer = window.setInterval(autoMove,2000);
var step = 0;
function autoMove(){
    if(step == data.length){
        step = 0;
        utils.css(bannerInner,'left',step*-1000);
    }
    step++;
    animate(bannerInner,{left: step*-1000 },500);
    focusAlign();
}

function focusAlign(){
    var tempStep = step === data.length ? 0 : step;
    for(var i=0; i<lis.length; i++){
        lis[i].className = i === tempStep ? 'selected' : '';
    }
}
banner.onmouseover = function (){
    window.clearInterval(timer);
    left.style.display = right.style.display = 'block';
}
banner.onmouseout = function (){
    timer = window.setInterval(autoMove,2000);
    left.style.display = right.style.display = 'none';
}
left.onclick = function (){
    if(step == 0){
        step = data.length;
        utils.css(bannerInner,'left',step*-1000);
    }
    step--;
    animate(bannerInner,{left : step*-1000},500);
    focusAlign();
}
right.onclick = autoMove;
for(var i=0; i<lis.length; i++){
    lis[i].index = i;
    lis[i].onclick = function (){
        if(step == data.length){ //如果点击的那一刻的step是最后一张(看起来是第一张),那么先把整个bannerInner移动到0的位置。然后再去运动到点击焦点对应的那个图的位置
            step = 0;
            utils.css(bannerInner,'left',0);
        }
        step = this.index;
        animate(bannerInner,{left : step * -1000},500);
        focusAlign();
    }
}
