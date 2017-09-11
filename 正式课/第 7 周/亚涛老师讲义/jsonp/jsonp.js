/**
 * Created by zhufengpeixun on 2016/11/20.
 */
(function () {
    /**
     * jsonp
     * @param requestURI jsonp接口地址
     * @param data 发送的数据
     * @param query server定义好的请求参数
     * @param callback 回调函数
     */
    function jsonp(requestURI, data, query, callback) {
        // 全局函数名 发送给服务器
        // 全局函数体 用来执行
        var cbName = 'cb' + counter++;
        // 把data拼接到requestURI后
        requestURI = appendToURI(requestURI, data);
        // 需要把请求参数和全局函数名拼接到requestURI后
        requestURI = appendToURI(requestURI, query + '=' + cbName);

        // 定义全局函数体
        window[cbName] = function (data) {
            try {
                callback(data);
            } finally {
                // 删除script和全局函数
                script.parentNode.removeChild(script);
                delete window[cbName];
            }

        };

        var script = document.createElement('script');
        script.src = requestURI;
        //console.log(document.readyState);
        // 解决dom没有加载完成的情况下 body为null的bug
        if (document.readyState !== 'loading') {
            document.body.appendChild(script);
            return;
        }

        if (window.addEventListener) {
            window.addEventListener('load', function () {
                document.body.appendChild(script);
            }, false)
        } else {
            window.attachEvent('onload', function () {
                document.body.appendChild(script);
            });
        }

    }

    // 定义计数器，让每次url都不一样， 防止缓存
    var counter = 1;
    // 把数据格式化为querystring格式
    function param(data) {
        if (typeof data === 'string') {
            return data;
        }
        if (typeof data === 'undefined' || data === null) {
            return '';
        }
        if (Object.prototype.toString.call(data) === '[object Object]') {
            var arr = [];
            for (var n in data) {
                if (!data.hasOwnProperty(n)) continue;
                arr.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]));
            }
            return arr.join('&');
        }
        return data.toString();
    }

    // 把请求参数拼接到url中
    function appendToURI(url, data) {
        data = param(data);
        if (!data) {
            return url;
        }
        var hasQuery = /\?/.test(url);
        return url + (hasQuery ? '&' : '?') + data;
    }

    this.jsonp = jsonp;
}());
