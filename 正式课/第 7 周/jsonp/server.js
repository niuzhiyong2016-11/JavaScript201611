var http = require('http'),
    url = require('url');
var s1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    if (pathname === '/getInfo') {
        var fnName = query['cb'];
        var data = [{"say": "hello world"}];
        res.writeHead(200, {'content-type': 'text/javascript;charset=utf-8;'});
        res.end(fnName + '(' + JSON.stringify(data) + ')');
    }
});
s1.listen(999, function () {
    console.log('起来嗨');
});