function fn() {
    console.log('MY NAME IS A');
}
//->module.exports:在A模块中导出需要供别人使用的方法
//->module NODE天生提供的对象,存储了一些模块操作的属性和方法；exports就是用来导出模块中方法的属性；
module.exports = {
    fn: fn
};