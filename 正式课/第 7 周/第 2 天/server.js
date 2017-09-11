var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->项目资源文件请求处理
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        //->获取当前请求资源文件的后缀名,根据文件的后缀名计算出它对应的MIME类型
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }

        try {
            var conFile = fs.readFileSync('.' + pathname, 'utf-8');
            var status = 200;
        } catch (e) {
            conFile = 'NOT FOUND!';
            suffixMIME = 'text/plain';
            status = 404;
        }
        //->重写响应头信息:在响应头中告诉浏览器当前资源文件的MIME类型
        response.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        response.end(conFile);
    }
});
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});