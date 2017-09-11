var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    //->我们在客户端请求的时候,传递的请求地址就是以当前项目为根目录,然后去查找请求的http://localhost/js/index.js
    //->而我们写的SERVER模块也是放在当前的项目的根目录下的,在代码中写./的意思就是找当前目录(也就是项目的根目录)

    //->如果请求的是项目中的资源文件(HTML/CSS/JS/PNG/JPG...),所有的资源文件都有自己的后缀名 =>所有静态资源文件的请求处理
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        //->为了避免请求的资源文件在项目中不存在,我们在使用readFileSync查找的时候会报错,我们使用TRY CATCH捕获异常信息,即使没有找到也不让其报错,返回给客户端未找到的信息即可
        try {
            var conFile = fs.readFileSync('.' + pathname, 'utf-8');
        } catch (e) {
            conFile = 'NOT FOUND!'
        }
        response.end(conFile);
    }
});
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});