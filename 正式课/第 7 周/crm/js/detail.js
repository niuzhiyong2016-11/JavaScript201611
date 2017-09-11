/*--String.prototype--*/
~function (pro) {
    //->queryURLParameter:获取URL地址后面问号传递的参数值
    function queryURLParameter() {
        var obj = {},
            reg = /([^?&=#]+)=([^?&=#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

var detailRender = (function () {
    var submit = document.getElementById('submit'),
        userName = document.getElementById('userName');
    var urlObj, customId, isUpdate;

    function bindText() {
        ajax({
            url: '/getInfo?id=' + customId,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result && result.code == 0) {
                    var data = result.data;
                    userName.value = data.name;
                }
            }
        });
    }

    function bindEvent() {
        submit.onclick = function () {
            var nameText = userName.value,
                data = {
                    name: nameText
                };
            if (isUpdate) {
                //->修改
                data['id'] = customId;
                ajax({
                    url: '/updateInfo',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    success: function (result) {
                        if (result && result.code == 0) {
                            window.location.href = 'index.html';
                        }
                    }
                });
                return;
            }

            //->增加
            ajax({
                url: '/addInfo',
                type: 'post',
                data: data,
                dataType: 'json',
                success: function (result) {
                    if (result && result.code == 0) {
                        //->增加成功后回到列表页面(index.html)
                        window.location.href = 'index.html';//->在JS中通过此操作实现页面之间的跳转即可
                    }
                }
            });
        };
    }

    return {
        init: function () {
            urlObj = window.location.href.queryURLParameter();
            customId = urlObj['id'];
            isUpdate = typeof customId === 'undefined' ? false : true;
            if (isUpdate) {
                bindText();
            }
            bindEvent();
        }
    }
})();
detailRender.init();