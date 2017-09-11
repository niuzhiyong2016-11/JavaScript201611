/**
 * Created by zhufengpeixun on 2016/11/19.
 */

(function () {
    /**
     * ajax核心逻辑
     * @param {Object} options 配置对象
     * @return {xhr} ajax对象
     */
    function ajax(options) {
        // 校验参数是否合法
        if (!tools.isType(options, 'Object')) {
            throw new TypeError('参数类型错误');
        }
        // ajax 第一步 获取ajax对象
        var xhr = tools.getXHR();
        // 生成一个判断是否为get系方法正则
        var isGet = /^get|head|delete$/ig;
        // ajax第二步
        var method = options.method || 'get';
        var requestURI = options.url || '/';
        var async = options.async === undefined ? true : !!options.async;
        // 1、如果为get方法，需要把data格式化为querystring的格式并且拼接到url的后面
        var data = tools.param(options.data);
        if (isGet.test(method) && data) {
            // 把格式化完成的data拼接到url的后面
            requestURI = tools.appendToURI(requestURI, data);
            // 因为get系方法不需要给send方法传参数，所以这里将data设置为null
            data = null;
        }
        // 2、如果不使用缓存，则需要在url后面加一串随机数字
        if (options.cache === false) {
            var randomText = Math.random();
            requestURI = tools.appendToURI(requestURI, '_=' + randomText);
        }

        // 打开http请求
        xhr.open(method, requestURI, async);

        // 自定义请求首部
        if (options.headers && xhr.setRequestHeader) {
            for (var n in options.headers) {
                if (!options.headers.hasOwnProperty(n)) {
                    continue;
                }
                xhr.setRequestHeader(n, options.headers[n]);
            }
        }

        // step 3 接收响应
        xhr.onreadystatechange = function () {
            // 判断事务是否完成
            if (xhr.readyState === 4) {
                // 获取响应主体
                var responseText = xhr.responseText;
                // 成功
                if (/^2\d{2}$/.test(xhr.status) || xhr.status === 304) {
                    // 判断是否需要将响应主体格式化为json对象
                    if (options.dataType === 'json') {
                        // 为了防止json parse执行报错
                        try {
                            responseText = tools.parseJSON(responseText);
                        } catch (ex) {
                            // 如果报错，则将报错信息发送给error方法，并且return
                            options.error(ex);
                            return;
                        }
                    }
                    // 成功执行success函数
                    options.success(responseText);
                } else if (/^(4|5)\d{2}$/.test(xhr.status)) {
                    // 失败
                    options.error(xhr.status);
                }
            }
        };

        // STEP 4 发送http请求
        xhr.send(data);
        return xhr;
    }

    var tools = {
        /**
         * 利用惰性函数获取ajax对象
         */
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }], xhr;
            while (xhr = list.shift()) {
                try {
                    xhr();
                    return xhr;
                } catch (ex) {

                }
            }
            throw new ReferenceError('当前浏览器不支持ajax功能');
        })(),
        /**
         * 判断数据类型
         * @param {*} data 需要判断类型的数据
         * @param {string} type 数据类型
         * @return {boolean} 数据类型是否符合
         */
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object' + ' ' + type + ']';
        },
        /**
         * 把数据格式化为querystring的格式
         * data => {a:1,b:2} => a=1&b=2
         * @param {*} data
         * @return {string} 请求参数
         */
        param: function (data) {
            // 因为该方法就是返回一个字符串，如果参数已经是一个字符串，则没有必要处理，直接返回
            if (this.isType(data, 'String')) {
                return data;
            }

            if (data === undefined || data === null) {
                return '';
            }
            if (this.isType(data, 'Object')) {
                var arr = [];
                for (var n in data) {
                    // 不获取原型链的属性
                    if (!data.hasOwnProperty(n)) continue;
                    // 因为url中不能存在非英文字符，所以这里使用encodeURIComponent方法格式化
                    arr.push(encodeURIComponent(n)
                        + '='
                        + encodeURIComponent(data[n]));
                }
                return arr.join('&');
            }
            return data.toString();
        },
        /**
         * 把字符串拼接到url的后面
         * @param url
         * @param padString
         */
        appendToURI: function (url, padString) {
            var hasQuery = /\?/.test(url);
            // 如果hasQuery为true 说明url中存在请求参数，否则不存在
            // www.baidu.com?a=1 + & + b=2
            // www.baidu.com + ? + a=1
            return url + (hasQuery ? '&' : '?') + padString;
        },
        /**
         * 将json字符串格式化为json对象
         * @param jsonString
         * @return {Object}
         */
        parseJSON: function (jsonString) {
            if (window.JSON) {
                return JSON.parse(jsonString);
            }
            return eval('(' + jsonString + ')');
        }
    };
    // 把ajax函数暴露到全局环境中
    this.ajax = ajax;
}());