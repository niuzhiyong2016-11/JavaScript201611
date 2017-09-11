/*
 * ajax：package a common method used to achieve AJAX data request
 * @parameter
 *    options:[object] storage is a parameter set
 * @return：
 *
 * by team on 2016-11-17 12:43:00
 */
function ajax(options) {
    //->init parameters
    var _default = {
        url: null,
        type: 'get',//->HTTP METHOD
        dataType: 'txt',//->服务器返回的都是字符串,我们这个参数是控制需不需要把返回的内容解析成其它的方式 txt、json、xml...
        data: null,//->如果当前是POST请求,我们把请求主体中需要传递的内容放在DATA中传递进来即可(其实我们想要让方法比较完善,我们需要把DATA做很多的处理:如果是GET请求的话,我们需要把DATA中的每一项内容拼接到URL的末尾；如果是POST请求我们才把它放到SEND中，并且把传递进来的JSON对象转换为JSON字符串),
        cache: true,//->是否有缓存,默认是有缓存的,如果设置为FALSE,我们需要在GET请求的时候清除缓存,
        async: true,//->设置同步还是异步,默认是异步,设置同步的话传递FALSE
        success: null,//->回调函数，当请求成功后触发这个回调函数执行
        error: null//->回调函数，当请求失败后触发这个回调函数执行
    };
    //->用传递进来的内容替换我们的默认值
    for (var key in options) {
        if (options.hasOwnProperty(key)) {//->回去后看原型继承视频前面的部分
            _default[key] = options[key];
        }
    }

    //->SEND AJAX
    var xhr = new XMLHttpRequest;
    //->如果当前的请求是GET系列的请求,并且CACHE设置为FALSE,我们清除缓存:在URL的末尾追加随机数
    if (/^(get|delete|head)$/i.test(_default.type) && _default.cache === false) {
        var chat = _default.url.indexOf('?') === -1 ? '?' : '&';
        _default.url += chat + '_=' + Math.random();
    }
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (/^2\d{2}$/.test(xhr.status)) {
            if (xhr.readyState === 4) {
                var text = xhr.responseText;
                //->数据解析
                switch (_default.dataType) {
                    case 'json':
                        text = 'JSON' in window ? JSON.parse(text) : eval('(' + text + ')');
                        break;
                    case 'xml':
                        text = xhr.responseXML;
                        break;
                }

                //->成功
                _default.success && _default.success.call(xhr, text);
            }
            return;
        }
        //->失败:执行ERROR方法,让方法中的THIS变为AJAX实例,在把错误的原因传递给这个方法
        typeof _default.error === 'function' ? _default.error.call(xhr, xhr.responseText) : null;
    };
    if (_default.data != null) {
        _default.data = JSON.stringify(_default.data);//->IE6~7不兼容,思考题:回去查一下如何处理JSON.stringify的兼容
    }
    xhr.send(_default.data);
}


/*
 * 当我们封装的方法需要传递的参数过多的时候,我们把其定义成一个个形参的方式不好:必须都要传递,有一个不传递后面传递的值就乱套了;传递的顺序也必须保持一致;如果后期在升级的话,还需要往后面在加参数...
 * 解决方案：
 *   我们只给这个方法传递一个参数值options,这个参数是一个对象数据类型的,我们把需要配置的信息都已键值对的方式存储到这个对象中
 */