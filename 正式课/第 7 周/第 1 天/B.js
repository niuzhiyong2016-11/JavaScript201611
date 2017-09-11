function fn() {
    console.log('MY NAME IS B');
}

//->导入A模块
var a = require('./A');
a.fn();