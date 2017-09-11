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


var submit = document.getElementById('submit');
var userName = document.getElementById('userName');

//->进入详情页面的第一件事情:获取当前地址栏URL地址后面问号传参的值(也就是获取那个ID)以此来确定是修改还是增加
var nowURL = window.location.href;//->获取当前页面的URL地址
var urlObj = nowURL.queryURLParameter(),
    customId = urlObj['id'],
    isUpdate = typeof customId === 'undefined' ? false : true;

//->如果是修改的话,我们首先通过ID到服务器上获取到客户信息,然后展示在页面的文本框中
if (isUpdate) {
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


submit.onclick = function () {
    var nameText = userName.value,
        data = {
            name: nameText
        };//->data:就是我们准备传递给服务器的内容(在AJAX方法库中,会把我们准备的对象转换为JSON字符串传递给服务器)

    //->点击提交的时候需要知道是修改还是增加
    if (isUpdate) {
        //->修改:传递给服务器的内容需要在增加的基础上多一个ID
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

    //->增加:发送AJAX请求给服务器,把客户信息按照API文档的要求传递给服务器
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