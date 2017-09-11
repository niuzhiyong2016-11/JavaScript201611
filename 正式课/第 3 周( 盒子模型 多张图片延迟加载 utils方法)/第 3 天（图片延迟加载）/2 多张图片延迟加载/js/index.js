/*
 *   多张图片延迟加载步骤：
 *       1
 *
 * */
var newsList = document.getElementById('newsList');
var imgs = newsList.getElementsByTagName('img');
// 先去获取数据，然后把获取回来的数据拼接成html结构添加到ul中

;(function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'data.txt', false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && /2\d{2}/.test(xhr.status)) {
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data);

/*
* <li>
    <div><img src="" /></div>
    <div><h2>title:</h2><p>desc:</p></div>
 </li>
*
* */

;(function bindData(){
    if(window.data){
        var str = '';
        for(var i=0; i<data.length; i++){
            var curData = data[i]; //每次那一条数据，是一个对象
            // {img:'images/1.jpg','title':'标题','desc':'描述'}
            str += '<li>';
            str += '<div><img src="" realSrc="'+curData.img+'" /></div>';
            str += '<div><h2>'+curData.title+'</h2><p>'+curData.desc+'</p></div>';
            str += '</li>';
        }
        newsList.innerHTML = str;
    }
})();

// 先完成单张图片延迟加载
function imgDelayLoad(img){ //img参数：是图片。传进来的图片才做图片延迟加载。
    if(img.isLoaded){ return;}
    var tempImg = new Image();
    tempImg.src = img.getAttribute('realSrc'); //
    tempImg.onload = function (){
        img.src = this.src;
        utils.setCss(img,'display','block'); //成功之后让图片出现
        //透明度还是0呢? 让这个透明度逐渐从0到1 （动画）
        fadeIn(img);
    }
    img.isLoaded = true;
}
/**
 * @param img 传入的img图片，让这张图片淡入
 */
function fadeIn(img){ //这是一个淡入效果
    var speed = 0.01; // 规定好速度
    // 把定时器的返回值(我是页面中第几个定时器)赋值给图片img的自定义属性上,为了清定时器的时候可以快速查找到。=> 以后定时器的返回值就保存到运动的元素的自定义属性上
    img.timer = window.setInterval(function (){
        var curOpacity = utils.getCss(img,'opacity'); //获取当前的透明度

        if(curOpacity >= 1){ //透明度运动到达终点
            window.clearInterval(img.timer);  //清定时器
            utils.setCss(img,'opacity',1); //主动设置终点
            return;
        }
        curOpacity += 0.01;
        utils.setCss(img,'opacity',curOpacity); //把已经计算好的透明度设置回去
        console.log(curOpacity); // 0.010.01
    },10);
}

//多张图片延迟加载：多个单张图片延迟加载.
function allImgsDelayLoad(){
    for(var i=0; i<imgs.length; i++){ //循环所有的图片，然后判断每一张图片是否已经完全进入到浏览器窗口内，只有进入到窗口内的_a > _b符合条件的，才执行一次单张图片延迟加载，并且把这个当前的img做为参数
        var curImg = imgs[i];
        //判断curImg是否已经进入到窗口内
        var _a = utils.win('clientHeight') + utils.win('scrollTop');
        var _b = curImg.parentNode.offsetHeight + utils.offset(curImg.parentNode).top;
        console.log(_a);
        console.log(_b);
        if(_a > _b){ // 符合这个条件的图片才做图片延迟加载

            imgDelayLoad(curImg); //把当前的图片作为参数传到单张图片延迟加载的函数中去
        }
    }
}
window.onscroll = allImgsDelayLoad; //滚动的时候需要执行多张图片延迟加载
window.setTimeout(allImgsDelayLoad,500); //如果不滚动那么就在500ms之后自动执行



