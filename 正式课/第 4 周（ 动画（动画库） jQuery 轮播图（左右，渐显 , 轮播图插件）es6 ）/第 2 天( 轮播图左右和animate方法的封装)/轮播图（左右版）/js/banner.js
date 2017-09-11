/*
*   1 先准备要操作的dom元素
* */
var banner = utils.getElesByClass('banner')[0]; //最外层
// 包含n张图片的盒子
var bannerInner = utils.getElesByClass('bannerInner',banner)[0];
//获取所有的图片
var imgs = bannerInner.getElementsByTagName('img');
//获取焦点的列表ul
var focusList = utils.children(banner,'ul')[0];
// 获取所有的焦点
var lis = focusList.getElementsByTagName('li');
//按钮
var left = utils.getElesByClass('left',banner)[0];
var right = utils.getElesByClass('right',banner)[0];
/*
*   2 获取数据
* */
;(function getData(){
    var xhr = new XMLHttpRequest();
    // 在data.txt拼接一个随机数是为了不读取本地304缓存,保证每次请求的url都不同
    xhr.open('get','data.txt?_='+Math.random(),false); // timeStamp
    // data1.txt?_=0.123123123123124&age=30
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data);
/*
*   3 绑定数据
* */
// <div><img src="images/banner2.jpg" /></div>
;(function bindData(){
    var str = ''; // 给img拼接
    var str1 = ''; //给li拼接
    if(window.data){
        for(var i=0; i<data.length; i++){
            // 每循环一次需要拼接一张图片出来
            str += '<div><img src="" realSrc="'+data[i].src+'" /></div>';
            str1 += i==0 ? '<li class="selected"></li>' : '<li></li>';
        }
        bannerInner.innerHTML = str;
        focusList.innerHTML = str1;
    }
})();
/*
*   3 图片延迟加载（图片有效性验证） => 其实也就是src这个属性的值一定要去加载一个有有效值
* */
;(function imgsLoad(){
    for(var i=0; i<imgs.length; i++){
        //(function (i){ })(i);
            var curImg = imgs[i]; //curImg就是当前即将要被加载的
            //给每一张图片上realSrc的属性值经过验证成功之后赋值给src属性
            var tempImg = document.createElement('img');
            tempImg.src = curImg.getAttribute('realSrc'); // 临时图片去加载
            tempImg.index=i; // 自定义属性方式来处理的
            tempImg.onload = function (){
                imgs[this.index].src = this.src;
                utils.css(imgs[this.index],'display','block');
                animate(imgs[this.index],{opacity : 1},500);
            }
    }
})();
/*
*   4 轮播
* */