var newsList = document.getElementById('newsList');
var imgs = newsList.getElementsByTagName('img');
//获取数据
;(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt',false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
//console.log(data)  data is not defined   JSON  position
//绑定数据
;(function bindData(){
    if(window.data){
        var str = '';
        for(var i=0; i<data.length; i++){
            str += '<li>';
            str += '<div><img src="" realSrc="'+ data[i].img +'"/></div>';
            str += '<div><h2>'+data[i].title+'</h2><p>'+data[i].desc+'</p></div>';
            str += '</li>';
        }
        newsList.innerHTML = str;
    }

})();
// 到页面中去看一看到底是否已经出现多个li了
// 单张图片延迟加载
function imgDelayLoad(img){ // @param img就是需要做延迟加载的图片
    if(img.isLoaded){return;}
    var tempImg = new Image();
    tempImg.src = img.getAttribute('realSrc');
    tempImg.onload = function (){
        img.src = this.src;
        utils.setCss(img,'display','block');
        fadeIn(img);
    }
    img.isLoaded = true;
    tempImg = null;
}

function allImgsDelayLoad(){
    for(var i=0; i<imgs.length; i++){
        var curImg = imgs[i];
        var _a = utils.win('clientHeight') + utils.win('scrollTop');
        var _b = curImg.parentNode.offsetHeight + utils.offset(curImg.parentNode).top;
        if(_a > _b){
            imgDelayLoad(curImg);
        }
    }
}

function fadeIn(img){ //img淡入
    img.timer = window.setInterval(function (){
        var opacity = utils.getCss(img,'opacity');
        if(opacity >= 1){
            window.clearInterval(img.timer);
            utils.setCss(img,'opacity',1);
            return;
        }
        opacity += 0.01;
        utils.setCss(img,'opacity',opacity);
    },10);
}
allImgsDelayLoad(); //刷新之后立刻执行
window.onscroll = allImgsDelayLoad; // 滚动条滚动的时候再执行

