var http = require('http');
var url = require('url');
//->http.createServer([callback]):创建一个服务,server1就是创建出来的服务；[callback]回调函数并不是在创建完成服务后就执行的,当客户端向服务器端发送请求的时候，才会把这个回调函数触发执行；
//->如何向当前创建的服务发送请求:
//1)在浏览器中输入 http://localhost:端口号
//2)在浏览器中输入 http://本机的IP地址:端口号
var server1 = http.createServer(function (request, response) {
    //->只要客户端请求一次,本回调函数就会触发执行一次,还会有两个默认的参数值
    //request:它是一个对象,在这个对象中存储了我们全部的请求信息
    //->request.url:存储了当前客户端请求的资源文件的路径和名称以及问号传递过来的参数值，例如：/index.html 或者 /index.html?name=zf&age=8

    //response:它是一个对象,在这个对象中存储了一些方法,通过这些方法可以让服务把一些内容返回给客户端
    console.log(url.parse('http://www.zhufengpeixun.com:80/index.html?name=zf&age=8#video', true));
    /*
     Url {
     protocol: 'http:', 协议
     slashes: true, 是否有斜线
     auth: null,
     host: 'www.zhufengpeixun.com:80', 域名+端口
     port: '80', 端口号
     hostname: 'www.zhufengpeixun.com', 域名
     hash: '#video',  HASH值
     search: '?name=zf&age=8', 带问号的问号传参
     query: 'name=zf&age=8', 不带问号的问号传参(如果url.parse方法第二个参数传递是的true，会把传递进来的值都以对象键值对的方式存储下来，例如：{ name: 'zf', age: '8' })
     pathname: '/index.html', 请求资源文件的路径名称
     path: '/index.html?name=zf&age=8',
     href: 'http://www.zhufengpeixun.com:80/index.html?name=zf&age=8#video' }
     */

});

//->server1.listen([port],[callback]):给当前的服务监听端口,[port]是设置的端口号,[callback]是当服务创建成功,并且已经监听成功端口号之后做的事情
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});
