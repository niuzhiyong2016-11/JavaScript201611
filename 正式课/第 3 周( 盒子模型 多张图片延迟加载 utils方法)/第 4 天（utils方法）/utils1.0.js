/*utils工具包第一版*/
var utils = {

    listToArray : function (likeAry){ //类数组转化成数组
        // try catch
        try{
            return Array.prototype.slice.call(likeAry);
        }catch (e){
            var ary = [];
            for(var i=0; i<ary.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    },
    jsonParse : function (jsonStr){ // 把json格式的字符串转化称json格式的对象
        // 'JSON' in window ? :
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('('+jsonStr+')');
    },
    getRandom : function (n,m){ // 获取随机数
        n = Number(n);
        m = Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n > m){
            var temp = m;
            m = n;
            n = temp;
        }
        return Math.round(Math.random(m-n)+n);
    },
    offset: function (ele){ // 获取ele距离body的偏移
        var l = null;
        var t = null;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        var par = ele.offsetParent;
        while(par){
            if(window.navigator.userAgent.indexOf('MSIE 8') === -1){
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left : l, top : t};
    },
    win : function (attr,val){ // 如果val不存在
        if(typeof val !== 'undefined'){ //scrollLeft scrollTop
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    },
    getCss : function (ele,attr){//获取样式
        var val = null;
        if(window.getComputedStyle){
            val = window.getComputedStyle(ele,null)[attr];
        }else{ // for ie
            if(attr =='opacity'){
                // alpha(opacity=55.5)
                var reg = /alpha\(opacity=(\d+(\.\d+)?)\)/;
                val = ele.currentStyle.filter;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = ele.currentStyle[attr];
            }
        }
        var reg = /-?\d+(\.\d+)?(px|pt|em|rem|deg)?/; //300px -200.5px
        if(reg.test(val)){
            val = parseFloat(val);
        }
        return val;
    },
    setCss : function (ele,attr,val){
        if(attr == 'opacity'){
            ele.style.opacity = val;
            ele.style.filter = 'alpha(opacity='+val*100+')';
            return;
        }
        if(attr == 'float'){
            ele.style.cssFloat = val;
            ele.style.styleFloat = val;
            return;
        }
        var reg = /width|height|left|right|top|bottom|(margin|padding)(Left|Right|Top|Bottom)?/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val += 'px';
            }
        }
        ele.style[attr] = val; //行内
    },
    children : function (ele,tagName){ //获取所有的*元素子节点
        var ary = [];
        if(ele.children){ //children属性是支持的。标准
            ary = this.listToArray(ele.children);
        }else{
            var nodeList = ele.childNodes;
            for(var i=0;i<nodeList.length;i++){
                if(nodeList[i].nodeType === 1){
                    ary.push(nodeList[i]);
                }
            }
        }
        if(typeof tagName == "string"){
            for(var i=0;i<ary.length;i++){
                if(ary[i].nodeName !== tagName.toUpperCase()){
                    ary.splice(i,1);
                    i--;
                }
            }
        }
        return ary;
    },
    prev : function (ele){ // 获取上一个*元素哥哥节点
        if(ele.previousElementSibling){
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling; //先获取哥哥节点(不一定是元素，甚至是null)
        while(pre && pre.nodeType != 1){ //只要哥哥存在，并且这个哥哥不是元素节点。那么就继续向上查找
            pre = pre.previousSibling; //继续以哥哥为基准向上找哥哥的哥哥
        }
        return pre;
    },
    next : function (ele){ // 获取下一个元素弟弟节点
        if(ele.nextElementSibling){ //如果这个属性存在那么说明是标准浏览器。直接使用这个属性就可以了
            return ele.nextElementSibling;
        }
        var next = ele.nextSibling;
        while(next && next.nodeType != 1){
            next = next.nextSibling;
        }
        return next;
    },
    prevAll : function (ele){ // 获取所有的元素哥哥节点
        // 每一个哥哥都需要做判断，如果是元素就放到一个数组。一直到把所有的哥哥节点全部循环 => 一直到不存在哥哥为止。
        var ary = [];
        var pre = ele.previousSibling; // 先获取一个哥哥节点
        while(pre){ //只要pre哥哥存在那么就要判断它是不是元素
            if(pre.nodeType == 1){
                ary.unshift(pre);
            }
            pre = pre.previousSibling;
        }
        return ary;
    },
    nextAll : function (ele){ // 所有的元素弟弟节点,利用next方法
        var ary = [];
        var next = this.next(ele); // 只要能获取那么必然是一个元素
        while(next){
            ary.push(next); //这里不用判断是否是元素，因为在this.next方法已经处理过
            next = this.next(next); //在第一个元素弟弟的基础上，继续向下查找。

        }
        return ary;
    },
    firstEleChild : function (ele){ // 第一个*元素子节点
        if(ele.firstElementChild){
            return ele.firstElementChild;
        }
        var allEleChilds = this.children(ele); // 使用children方法获取素有的元素子节点
        return allEleChilds.length>0 ? allEleChilds[0] : null;
    },
    lastEleChild : function (ele){ //最后一个*元素子节点
        if(ele.lastElementChild){
            return ele.lastElementChild;
        }
        var allEleChilds = this.children(ele); //有可能是空数组
        return allEleChilds.length > 0 ? allEleChilds[allEleChilds.length-1] : null;
    },
    siblings : function (ele){ //获取所有的*元素兄弟节点
        return this.prevAll(ele).concat(this.nextAll(ele));
    },
    sibling : function (ele){ //获取相邻两个元素节点
        var ary = [];
        var prev = this.prev(ele); //哥哥
        var next = this.next(ele); //弟弟
        prev ? ary.push(prev) : void 0;
        next ? ary.push(next) : void 0;
        return ary;
    },
    index : function (ele){ //获取元素的索引
        return this.prevAll(ele).length;
    },
    // jquery方法中也有一个雷同的方法
    append : function (ele,container){ //把元素添加到指定容器中末尾
        container.appendChild(ele);
    },
    prepend : function (ele,container){ // 把元素添加到指定容器的开头
        //先获取container容器的第一个元素子节点,如果存在插入到它前面，如果不存在说明没有元素子节点。那么直接appendChild添加到最后就可以了
        var first = this.firstEleChild(container);
        first ? container.insertBefore(ele,first) : container.appendChild(ele);
    },
    insertBefore : function (oldEle,newEle){
        oldEle.parentNode/*必须使用父节点*/.insertBefore(newEle,oldEle);
    },
    insertAfter : function (oldEle,newEle){ // 把新元素newEle插入到oldEle的后面
        //如果oldEle的元素弟弟存在，那么就插入到它前面，如果不存在说明oldEle就是最后一个元素。那么直接把newEle添加到最后(父节点调用)
        var next = this.next(oldEle);
        next ? oldEle.parentNode.insertBefore(newEle,next) : oldEle.parentNode.appendChild(newEle);
    },
    /*重点： hasClass,addClass,removeClass*/
    // utils.hasClass(span,'c1');
    hasClass : function (ele,strClass){ // 判断ele是否含有strClass这个类
        //要么strClass两边包含一个或者多个空格，如果左边没有空格那么必须以strClass开始,如果右面没有空格，那么必须以strClass结束
        var reg = new RegExp('(^| +)'+strClass+'( +|$)');
        return reg.test(ele.className); // true/false
    },

    addClass : function (ele,strClass){ // 给ele添加strClass类
        //先把strClass的首尾空格去掉 addClass('    c5  c6 ')
        // 以一个或者多个空格开始，或者以一个或者多个空格结束 => 去首尾空格,并且还要按照一个或者多个空格拆分成数组
        var strClassAry = strClass.replace(/^ +| +$/g,'').split(/ +/);
        // [c5,c6]
        for(var i=0; i<strClassAry.length; i++){
            //循环判断当前class中是否含c5或者c6，如果有就不用添加了
            var curClass = strClassAry[i]; // c5,c6
            if(!this.hasClass(ele,curClass)){
                ele.className += ' ' + curClass; //需要加个空格
            }
        }
    },
    removeClass : function (ele,strClass){ //移除ele上的strClass这个类
        var strClassAry = strClass.replace(/^ +| +$/g,'').split(/ +/);
        // [c5,c6]
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i]; // c5,c6
            // while循环可以处理这个问题，只要存在c5或c6就执行。一直到把c5和c6全部替换结束
            while(this.hasClass(ele,curClass)){ // 包含这个类才移除
                // 移除类其实就是把className上符合规则的哪一段（空格+/开头c5空格+或者结尾）替换成空格（如果替换成空字符串就当前这个类的前后两项连接上了）
                var reg = new RegExp('(^| +?)'+curClass+'( +?|$)','g'); // g是全文，保证把所有的符合规则的类都移除
                ele.className = ele.className.replace(reg,'  '); //两个空格
                // 把符合规则的className中的一段字符串全部替换成空格，replace方法是返回替换后的新字符串。所以重新赋值给ele.className
            }
        }
    },
    getElesByClass : function (strClass,context){ //通过类名获取元素
        context = context || document;
        if(context.getElementsByClassName){
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        // for ie 6-8
        var strClassAry = str.replace(/^ +| +$/g,'').split(/ +/);
        var tags = context.getElementsByTagName('*');
        var ary = [];
        for(var i = 0; i< tags.length; i++){
            var curTag = tags[i];
            var curTagIsOk = true;
            for(var j=0; j<strClassAry.length; j++){
                var curClass = strClassAry[j];
                var reg = new RegExp('(^| +)'+curClass+('( +|$)'));
                if(!reg.test(curTag.className)){
                    curTagIsOk = false;
                    break;
                }
            }
            if(curTagIsOk){
                ary.push(curTag);
            }
        }
        return ary;
    }










};