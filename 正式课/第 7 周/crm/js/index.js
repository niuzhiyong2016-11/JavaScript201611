var customerRender = (function () {
    var content = document.getElementById('content');

    //->实现删除
    function bindEvent() {
        content.onclick = function (e) {
            e = e || window.event;
            var tar = e.target || e.srcElement,
                tarTag = tar.tagName.toUpperCase();
            if (tarTag === 'A' && tar.innerHTML === '删除') {
                var customId = tar.getAttribute('data-id');
                var flag = confirm('确定要删除编号为 [ ' + customId + ' ] 的客户吗?');
                if (flag) {
                    //->点击的是确定
                    ajax({
                        url: '/removeInfo?id=' + customId,
                        type: 'get',
                        dataType: 'json',
                        cache: false,
                        success: function (result) {
                            if (result && result.code == 0) {
                                content.removeChild(tar.parentNode.parentNode);
                            }
                        }
                    });
                }
            }
        };
    }


    //->实现页面数据的绑定
    function bindHTML(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li>';
            str += '<span>' + cur.id + '</span>';
            str += '<span>' + cur.name + '</span>';
            str += '<span>';
            str += '<a href="detail.html?id=' + cur.id + '">修改</a>';
            str += '<a href="javascript:;" data-id="' + cur.id + '">删除</a>';
            str += '</span>';
            str += '</li>';
        }
        content.innerHTML = str;
    }

    return {
        init: function () {
            ajax({
                url: '/getAllList',
                type: 'get',
                dataType: 'json',
                cache: false,
                success: function (result) {
                    if (result && result.code == 0) {
                        var data = result.data;
                        bindHTML(data);
                        bindEvent();
                    }
                }
            });
        }
    }
})();
customerRender.init();

