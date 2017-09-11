var content = document.getElementById('content');
//->开始加载页面的时候,我们通过API文档中的接口地址获取到所有的客户信息,然后把信息展示在页面中(字符串拼接)
ajax({
    url: '/getAllList',
    type: 'get',
    dataType: 'json',
    cache: false,
    success: function (result) {
        if (result && result.code == 0) {
            var data = result.data;
            bindHTML(data);
        }
    }
});
//->实现页面数据的绑定
function bindHTML(data) {
    var str = '';
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        str += '<li>';
        str += '<span>' + cur.id + '</span>';
        str += '<span>' + cur.name + '</span>';
        str += '<span>';
        str += '<a href="detail.html?id=' + cur.id + '">修改</a>';//->传递一个ID值就是到详情页面的时候能够区分是增加还是修改,以及要修改哪一个客户信息：传了ID就是修改,传递的值是多少就是修改谁
        str += '<a href="javascript:;" data-id="' + cur.id + '">删除</a>';//->在自定义属性中存储一个客户的ID，这样以后点击的时候，想要获取它代表的ID，只需要获取这个自定义的属性值即可
        str += '</span>';
        str += '</li>';
    }
    content.innerHTML = str;
}

//->事件委托实现删除操作
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