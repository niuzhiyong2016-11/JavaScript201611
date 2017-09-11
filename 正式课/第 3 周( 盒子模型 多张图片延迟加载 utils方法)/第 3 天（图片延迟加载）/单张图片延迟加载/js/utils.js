var utils = {
    listToArray : function (likeAry){
        try{
            return Array.prototype.slice.call(likeAry,0);
        }catch(e){
            var ary = [];
            for(var i=0; i<likeAry.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    },
    jsonParse : function (jsonStr){
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('('+jsonStr+')');
    },
    getRandom : function (n,m){
        n = Number(n);
        m = Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n > m){
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.round(Math.random()*(m-n)+n);
    },
    win : function (attr,val){ // 浏览器窗口
        if(typeof val != 'undefined'){
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    },
    offset : function (ele){ // 距离body偏移
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
        return {left: l ,top : t};
    },
    getCss : function (ele,attr){
        var val = null;
        if('getComputedStyle' in window){
            val = window.getComputedStyle(ele,null)[attr];
        }else{
            if(attr == 'opacity'){
                val = ele.currentStyle.filter;
                var reg = /alpha\(opacity=(\d+(?:\.\d+)?)\)/;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = ele.currentStyle[attr];
            }
        }
        //
        var reg = /-?\d+(\.\d+)?(px|pt|em|rem|deg)?/; // -300.5px block
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
        ele.style[attr] = val;
    }
};