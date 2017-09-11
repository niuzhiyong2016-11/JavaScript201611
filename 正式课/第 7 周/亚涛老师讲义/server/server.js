/**
 * Created by zhufengpeixun on 2016/11/20.
 */
var http = require('http');//创建http服务器
var fs = require('fs'); //=> fileStream
var url = require('url');// 把url格式为对象，方便处理
var path = require('path');// 处理路径
var querystring = require('querystring'); // 将url中的请求参数格式化为对象，方便处理

/**
 * 读取文件
 * @param path 文件路径
 * @param response http响应
 */
function readFile(path, response) {
    fs.readFile(path, function (err, data) {
        if (err) {
            response.writeHead(500);
            response.end('can not found this file : ' + path);
        } else {
            response.writeHead(200);
            response.end(data);
        }
    });
}
// 定义全局根目录
var ROOT_PATH = path.resolve('../');
var bottleList = [];
var server = http.createServer(function (request, response) {
    // 如果用户请求的是根目录“/” 把漂流瓶的页面返回给浏览器
    var urlData = url.parse(request.url, true);
    // 判断用户是否请求的是根目录
    if (urlData.pathname === '/') {
        // 1、读取漂流瓶的html
        // 2、把html内容返回给浏览器
        readFile('../bottle/bottle.html', response);
    } else if (urlData.pathname === '/throwBottle') {
        var data = '';
        // 正在接受浏览器发送过来的数据
        request.on('data', function (chunk) {
            data += chunk;
        });
        // 浏览器请求接收完成
        request.on('end', function () {
            // 格式化请求主体
            data = querystring.parse(data);
            // 返回给浏览器200
            response.writeHead(200,
                {'Content-Type': 'application/json'}
            );
            // 判断浏览器发送的的参数中是否有content字段
            if (data.content) {
                // 把发送过来的漂流瓶内容存储起来
                bottleList.push(data.content);
                // 返回成功
                response.end('{"code":0}');
            } else {
                // 返回失败
                response.end('{"code":1}');
            }

        });

    } else if (urlData.pathname === '/getBottle') {
        // 从BottleList中随机获取一项 生成随机下标
        var index = Math.floor(Math.random() * bottleList.length);
        // 根据随机下标 获取漂流瓶内容
        var item = bottleList[index];
        response.writeHead(200, {'Content-Type': 'application/json'});
        var result = {
            code: 0,
            data: {content: ''}
        };
        // 有漂流瓶内容
        if (item) {
            result.data.content = item;
        } else {
            result.code = 1;
        }
        // 返回给浏览器
        response.end(JSON.stringify(result));
    } else if (urlData.pathname === '/crossOrigin') {
        //response.end('hello cross origin');
        //response.end('console.log("hello cross origin")');
        // http://127.0.0.1:8080/crossOrigin?key=d
        // 获取请求参数中的那个key
        var key = urlData.query.key;
        //response.end('var ' + key + '="hello cross origin";');
        response.end( key + '("hello cross origin");');
        // =>d("hello cross origin");
    } else {
        // 根据根目录解析url的pathname
        var _path = path.resolve(ROOT_PATH, urlData.pathname.slice(1));
        readFile(_path, response);
    }
});

// 监听端口
server.listen(8080, '127.0.0.1', function () {
    console.log('server start successful');
});