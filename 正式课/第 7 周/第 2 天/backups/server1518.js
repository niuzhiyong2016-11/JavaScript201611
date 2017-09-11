var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    if (pathname === '/index.html') {
        var con = fs.readFileSync('./index.html', 'utf-8');
        response.end(con);
    }

    if (pathname === '/css/index.css') {
        con = fs.readFileSync('./css/index.css', 'utf-8');
        response.end(con);
    }

    if (pathname === '/js/index.js') {
        con = fs.readFileSync('./js/index.js', 'utf-8');
        response.end(con);
    }
});
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});