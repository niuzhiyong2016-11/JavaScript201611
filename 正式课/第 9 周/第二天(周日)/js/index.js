/*--String.prototype--*/
~function (pro) {
    function queryURLParameter() {
        var obj = {},
            reg = /([^?&=#]+)=([^?&=#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });

        //->GET HASH
        reg = /#([^?&=#]+)/;
        if (reg.test(this)) {
            obj['HASH'] = reg.exec(this)[1];
        }
        return obj;
    }

    function formatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        template = template.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                result = ary[index];
            result = result || '00';
            result.length < 2 ? result = '0' + result : null;
            return result;
        });
        return template;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatTime = formatTime;
}(String.prototype);

/*--NAV RENDER--*/
var navRender = (function () {
    var $menu = $('#menu'),
        $nav = $('#nav');
    return {
        init: function () {
            $menu.tap(function () {
                if ($nav.attr('isBlock') === 'true') {
                    $nav.css({
                        padding: 0,
                        height: 0
                    }).attr('isBlock', false);
                    return;
                }
                $nav.css({
                    padding: '.1rem 0',
                    height: '2.22rem'
                }).attr('isBlock', true);
            });
        }
    }
})();
navRender.init();

/*--MATCH RENDER--*/
var matchRender = (function () {
    var $matchTemplate = $('#matchTemplate'),
        $match = $('#match');

    //->bindHTML:数据绑定
    function bindHTML(matchInfo) {
        var template = $matchTemplate.html();
        var res = ejs.render(template, {matchInfo: matchInfo});
        $match.html(res);

        bindSupport();
    }

    //->bindSupport:支持处理
    function bindSupport() {
        var $support = $match.find('.support'),
            $supportLeft = $support.eq(0),
            $supportRight = $support.eq(1),
            $progress = $match.find('.progress');
        var isTouch = false,
            supportInfo = localStorage.getItem('support');
        if (supportInfo) {
            //->以前支持过
            supportInfo = JSON.parse(supportInfo);
            supportInfo.type == 1 ? $supportLeft.addClass('bg') : $supportRight.addClass('bg');
            return;
        }

        $support.tap(function () {
            if (isTouch) return;
            isTouch = true;

            //->增加选中的样式,数字在原有基础上加1
            var oldNum = parseFloat($(this).html());
            $(this).addClass('bg').html(oldNum + 1);

            //->改变进度条
            var leftNum = parseFloat($supportLeft.html()),
                rightNum = parseFloat($supportRight.html());
            $progress.css('width', (leftNum / (leftNum + rightNum)) * 100 + '%');

            //->告诉服务器支持的谁
            var type = $(this).attr('data-type');
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1469151&type=' + type,
                type: 'get',
                dataType: 'jsonp'
            });

            //->为了保证下一次在加载页面的时候不会重复的支持,我们把本次支持的信息存储到本地,下一次打开页面,先从本地获取,看是否支持过
            //->localStorage存储的信息只能是字符串格式的
            localStorage.setItem('support', JSON.stringify({
                type: type,
                isTouch: true
            }));
        });
    }

    return {
        init: function () {
            //->JSONP GET DATA
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1469151',
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result[0] == 0) {
                        result = result[1];
                        var matchInfo = result['matchInfo'];
                        matchInfo.leftSupport = result['leftSupport'];
                        matchInfo.rightSupport = result['rightSupport'];
                        bindHTML(matchInfo);
                    }
                }
            });
        }
    }
})();
matchRender.init();

/*--PLAYER RENDER--*/
var playerRender = (function () {
    var $player = $('#player'),
        $playerItem = $player.children('ul'),
        $playerTemplate = $('#playerTemplate');

    function bindHTML(playerList) {
        //var template = $playerTemplate.html();
        //var res = ejs.render(template, {playerList: playerList});
        //$playerItem.html(res).css('width', playerList.length * 2.4 + 'rem');
        $playerItem.html(ejs.render($playerTemplate.html(), {playerList: playerList})).css('width', playerList.length * 2.4 + 0.3 + 'rem');

        //->ISCROLL
        new IScroll('#player', {scrollX: true});
    }

    return {
        init: function () {
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchStatV37?mid=100000:1469151',
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result[0] == 0) {
                        result = result[1]['stats'];
                        $.each(result, function (index, item) {
                            if (item.type == 9) {
                                result = item.list;
                                return false;
                            }
                        });
                        bindHTML(result);
                    }
                }
            });
        }
    }
})();
playerRender.init();