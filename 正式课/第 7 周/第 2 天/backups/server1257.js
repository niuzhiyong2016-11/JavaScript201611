var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    if (pathname === '/aa/index.html') {//->为啥有斜杠:因为我们通过request.url获取到的结果就有斜杠
        //->需要把当前项目中的index.html中的源代码获取到
        var con = fs.readFileSync('./aa/index.html', 'utf-8');//->为啥有斜杠:我们是以SERVER为中心,找到当前目录下AA文件夹中的index.html文件

        //->把获取的内容返回
        /*response.write(con);
         response.end();*/
        response.end(con);
    }
});
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});