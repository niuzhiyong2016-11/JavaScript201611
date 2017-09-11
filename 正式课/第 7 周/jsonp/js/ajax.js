/*
 * ajax：package a common method used to achieve AJAX data request
 * @parameter
 *    options:[object] storage is a parameter set
 * @return：
 *
 * by team on 2016-11-17 12:43:00
 */
function ajax(options) {
    //->init parameter
    var _default = {
        url: null,
        type: 'get',
        dataType: 'text',//->json、xml、text...
        data: null,
        async: true,
        cache: true,
        success: null,
        error: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->send ajax
    var xhr = new XMLHttpRequest;
    !_default.cache ? _default.url += (_default.url.indexOf('?') === -1 ? '?' : '&') + '_=' + Math.random() : null;
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (/^2\d{2}$/.test(xhr.status)) {
            //->success
            if (xhr.readyState === 4) {
                var val = xhr.responseText;
                switch (_default.dataType) {
                    case 'json':
                        val = 'JSON' in window ? JSON.parse(val) : eval('(' + val + ')');
                        break;
                    case 'xml':
                        val = xhr.responseXML;
                        break;
                }
                _default.success && _default.success.call(xhr, val);
            }
            return;
        }
        //->error
        _default.error && _default.error.call(xhr, xhr.responseText);
    };
    _default.data && typeof _default.data === 'object' ? _default.data = JSON.stringify(_default.data) : null;
    xhr.send(_default.data);
}