//单例模式
var utils = {
    listToArray : function (likeAry){
        try{
            return Array.prototype.slice.call(likeAry);
        }catch(e){
            var ary = [];
            for(var i=0; i<likeAry.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    },

    jsonParse : function (jsonStr){
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("("+jsonStr+")");
    }
};