function Banner(container,dataUrl,interval){
    //  把所有全局变量存储到实例的私有属性上
    this.container = container; //最外层容器
    this.dataUrl = dataUrl;
    this.interval = interval || 2000;
    this.bannerInner = utils.getElesByClass('bannerInner',this.container)[0];
    this.focusList = utils.children(this.container,'ul')[0];
    this.left = utils.getElesByClass('left',this.container)[0];
    this.right = utils.getElesByClass('right',this.container)[0];
    this.imgs = this.bannerInner.getElementsByTagName('img');
    this.lis = this.focusList.getElementsByTagName('li');
    this.timer = null; //这会没有定时器，要等到公有方法执行才启动定时器
    this.step = 0; // 默认显示第一张
    this.data = null;
    this.init();
    //return this.init(); //在new实例的时刻就要执行这个初始化函数。
}
Banner.prototype = {
    constructor : Banner,
    getData : function (){
        var that = this; //这个this是实例
        var xhr = new XMLHttpRequest();
        xhr.open('get',this.dataUrl+'?_='+new Date().getTime(),false);
        xhr.onreadystatechange = function (){
            if(xhr.readyState ==  4 && /^2\d{2}$/.test(xhr.status)){
                that.data = utils.jsonParse(xhr.responseText);
                //这里的this不是实例，必须把数据赋值到实例的私有属性上。
            }
        }
        xhr.send(null);
    },
    bindData : function (){
        if(this.data){
            var strImg = '';
            var strLi = '';
            for(var i=0; i<this.data.length; i++){
                strImg += '<div><img src="" realSrc="'+this.data[i].src+'"></div>';
                strLi += i === 0 ? '<li class="selected"></li>' :'<li></li>';
            }
            this.bannerInner.innerHTML = strImg;
            this.focusList.innerHTML = strLi;
        }
    },
    imgLoad : function (){
        var that = this;
        for(var i=0; i<this.imgs.length; i++){
            ;(function (i){
                var curImg = that.imgs[i]; //自运行函数中的this是window
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
    },
    autoMove : function (){
        this.step++;
        if(this.step == this.data.length){
            this.step = 0;
        }
        this.setImg();
    },
    setImg : function (){
        for(var i=0; i<this.imgs.length; i++){
            var curImg = this.imgs[i];
            if(i === this.step){
                utils.css(curImg.parentNode,'zIndex',1);
                animate(curImg.parentNode,{opacity : 1},300,function (){
                    var siblings = utils.siblings(this);
                    for(var i=0; i<siblings.length; i++){
                        utils.css(siblings[i],'opacity',0);
                    }
                });
            }else{
                utils.css(curImg.parentNode,'zIndex',0);
            }
        }
        for(var i=0; i<this.lis.length; i++){
            this.lis[i].className = i === this.step ? 'selected' : '';
        }
    },
    bannerBindEvent : function (){
        var that = this;
        this.container.onmouseover = function (){
            window.clearInterval(that.timer); //事件函数中的this不是实例
            that.left.style.display = that.right.style.display = 'block';
        }
        this.container.onmouseout = function (){
            that.timer = window.setInterval(function (){
                // 定时器中的this是window。所以多嵌套了一个匿名函数。函数函数执行的时候我再执行autoMove;这样autoMove方法中的this就是实例了
                that.autoMove();
            },that.interval);
            that.left.style.display = that.right.style.display  = 'none';
        }
    },
    focusBindEvent : function (){
        var that = this;
        for(var i=0; i<this.lis.length; i++){
            var curLi = this.lis[i];
            curLi.index = i;
            curLi.onclick = function (){
                that.step  = this.index;
                that.setImg();
            }
        }
    },
    buttonBindEvent : function (){
        var that = this;
        this.left.onclick = function (){
            that.step--;
            if(that.step == -1){
                that.step = that.data.length-1;
            }
            that.setImg();
        }
        this.right.onclick = function (){
            // 处理方式和定时器雷同。都是当this冲突的时候那么就用一个匿名函数来替代
            that.autoMove();
        };
    },
    init : function (){
        // 初始化函数: 这个方法负责把所有的函数按照顺序执行。这个方法执行结束轮播图就该实现了
        var that = this;
        this.getData();
        this.bindData();
        this.imgLoad();
        this.timer = window.setInterval(function (){
            that.autoMove();
        },this.interval);
        this.bannerBindEvent();
        this.focusBindEvent();
        this.buttonBindEvent();
        //return this;
    }
};










// var banner = utils.getElesByClass('banner')[1];
// var bannerInner = utils.getElesByClass('bannerInner',banner)[0];
// var focusList = utils.children(banner,'ul')[0];
// var left = utils.getElesByClass('left',banner)[0];
// var right = utils.getElesByClass('right',banner)[0];
// var imgs = bannerInner.getElementsByTagName('img');
// var lis = focusList.getElementsByTagName('li');



// ;(function (){
//     var xhr = new XMLHttpRequest();
//     xhr.open('get','data1.txt?_='+new Date().getTime(),false);
//     xhr.onreadystatechange = function (){
//         if(xhr.readyState ==  4 && /^2\d{2}$/.test(xhr.status)){
//             window.data = utils.jsonParse(xhr.responseText);
//         }
//     }
//     xhr.send(null);
// })();
// ;(function (){
//     if(window.data){
//         var strImg = '';
//         var strLi = '';
//         for(var i=0; i<data.length; i++){
//             strImg += '<div><img src="" realSrc="'+data[i].src+'"></div>';
//             strLi += i === 0 ? '<li class="selected"></li>' :'<li></li>';
//         }
//         bannerInner.innerHTML = strImg;
//         focusList.innerHTML = strLi;
//     }
// })();
// ;(function imgsLoad(){ // imgs : [img,img,img,img]
//     for(var i=0; i<imgs.length; i++){
//         ;(function (i){
//             var curImg = imgs[i];
//             var tempImg = new Image();
//             tempImg.src = curImg.getAttribute('realSrc');
//             tempImg.onload = function (){
//                 curImg.src = this.src;
//                 utils.css(curImg,'display','block');
//                 if(i === 0 ){ // 这是第一张
//                     utils.css(curImg.parentNode,'zIndex',1);
//                     animate(curImg.parentNode,{opacity:1},500);
//                 }
//             }
//         })(i);
//     }
// })();
//var timer = window.setInterval(autoMove,2000);
//var step = 0;
// function autoMove(){
//     step++;
//     if(step == data.length){ // step++之后的值就是我下一次要显示的图片。当运动到最后一张图片，最后一张图片的索引是data.length-1，如果step++之后的值和data.length相等。那么我们已经没有索引为data.length的图片。所以设置目标值为0
//         step = 0;
//     }
//     setImg();
// }
// function setImg(){ // 负责让和step的值相等的那一张图片的层级为1，其他的图片的层级全部设置成0
//     for(var i=0; i<imgs.length; i++){
//         var curImg = imgs[i];
//         if(i === step){
//             utils.css(curImg.parentNode,'zIndex',1);
//             // 当层级已经提高之后，让透明度立刻从0运动到1
//             animate(curImg.parentNode,{opacity : 1},300,function (){
//                 var siblings = utils.siblings(this); //除了当前运动元素的其他兄弟节点(也就是除了刚刚层级提高的那个图片盒子之外的其他所有盒子)
//                 for(var i=0; i<siblings.length; i++){
//                     utils.css(siblings[i],'opacity',0);
//                 }
//             });
//         }else{
//             utils.css(curImg.parentNode,'zIndex',0);
//         }
//     }
//     // 焦点对齐的代码
//     for(var i=0; i<lis.length; i++){
//         lis[i].className = i === step ? 'selected' : '';
//     }
// }
// banner.onmouseover = function (){
//     window.clearInterval(timer);
//     left.style.display = right.style.display = 'block';
// }
// banner.onmouseout = function (){
//     timer = window.setInterval(autoMove,2000);
//     left.style.display = right.style.display  = 'none';
// }
// ;(function (){
//     for(var i=0; i<lis.length; i++){
//         var curLi = lis[i];
//         curLi.index = i;
//         curLi.onclick = function (){
//             step  = this.index;
//             setImg(); //循环所有图片和step对应上才显示。执行这个函数的时候，先宝恒step的值先被修改过了
//         }
//     }
// })();
// left.onclick = function (){
//     step--;
//     if(step == -1){
//         step = data.length-1;
//     }
//     setImg();
// }
// right.onclick = autoMove;





