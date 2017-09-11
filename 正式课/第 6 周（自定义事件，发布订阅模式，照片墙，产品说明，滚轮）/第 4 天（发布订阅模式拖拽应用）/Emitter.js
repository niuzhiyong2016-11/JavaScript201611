var Emitter = function (){};
Emitter.prototype.on = function (type,fn){
    // drag1.on('slefdragstart',increaseIndex)
    if(!this[type]){
        this[type] = [];
    }
    // drag1.selfdragstart = [];
    // [increaeasIndx]
    // drag1.ele = div1;
    var a = this[type];
    for(var i=0; i<a.length; i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
    return this;
}
Emitter.prototype.off = function (type,fn){
    var a = this[type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }
}
Emitter.prototype.run = function (type,e){
    var a = this[type];
    if(a){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(this/*.ele*/,e);
            }
        }
    }
}
