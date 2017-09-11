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


/*--computed content height--*/
~function () {
    var $mainContent = $('.main-content'),
        $menu = $mainContent.children('.menu');

    function fn() {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var tarH = winH - 64 - 40;//->WINH-HEADER-MARGIN
        $mainContent.css('height', tarH);
        $menu.css('height', tarH - 2);
    }

    fn();
    $(window).on('resize', fn);
}();

/*--MENU--*/
var menuRender = (function () {
    var $menu = $('#menu'),
        $links = $menu.find('a'),
        menuExample = null;

    var $menuPlain = $.Callbacks();//->create plain

    //->ISCROLL
    $menuPlain.add(function () {//->add plain function / remove
        menuExample = new IScroll('#menu', {
            scrollbars: true,
            mouseWheel: true,
            fadeScrollbars: true,
            click: true
        });
    });

    //->BY HASH POSITION TO ELEMENT
    $menuPlain.add(function () {
        var hash = window.location.href.queryURLParameter()['HASH'],
            $tar = $links.filter('[href="#' + hash + '"]');
        $tar.length === 0 ? $tar = $links.eq(0) : null;
        $tar.addClass('bg');
        menuExample.scrollToElement($tar[0], 0);

        //->加载页面的时候,左侧MENU区域定位好之后,根据定位的内容展示右侧信息
        calendarRender.init($tar.attr('data-id'));
    });

    //->CLICK
    $menuPlain.add(function () {
        $links.on('click', function () {
            $(this).addClass('bg').parent().siblings().children('a').removeClass('bg');

            //->点击左侧MENU的时候,右侧也需要跟着改变
            calendarRender.init($(this).attr('data-id'));
        });
    });

    return {
        init: function () {
            $menuPlain.fire();//->fire all function run,如果这块传递了参数值,那么所有的方法都可以接收到传递的值
        }
    }
})();

/*--CALENDAR--*/
var calendarRender = (function () {
    var $calendarPlain = $.Callbacks(),
        $calendar = $('#calendar'),
        $wrapper = $calendar.children('.wrapper'),
        $item = $calendar.find('.item'),
        $links = null,
        $btn = $calendar.children('.btn');
    var minL = 0, maxL = 0;

    //->BIND HTML
    $calendarPlain.add(function (columnId, today, data) {
        var str = '';
        $.each(data, function (index, cur) {
            str += '<li><a href="javascript:;" data-time="' + cur.date + '">';
            str += '<span class="week">' + cur.weekday + '</span>';
            str += '<span class="date">' + cur.date.formatTime('{1}-{2}') + '</span>';
            str += '</a></li>';
        });
        $item.html(str).css('width', data.length * 110);

        $links = $item.find('a');
        minL = -(data.length - 7) * 110;
    });

    //->POSITION
    $calendarPlain.add(function (columnId, today, data) {
        var $tar = $links.filter('[data-time="' + today + '"]');

        //->今天的日期在列表中不一定有,我们需要找它后面紧挨着的日期
        if ($tar.length === 0) {
            var todayTime = today.replace(/-/g, '');
            $links.each(function (index, curLink) {
                var curTime = $(curLink).attr('data-time').replace(/-/g, '');
                if (curTime > todayTime) {
                    $tar = $(curLink);
                    return false;
                }
            });
        }

        //->比完一圈,返现一个比当前日期大的都没有,我们则选中最后一个A即可
        $tar.length === 0 ? $tar = $links.eq($links.length - 1) : null;

        //->让获取到的$TAR定位到七个展示A中的中间位置
        $tar.addClass('bg');
        var parIndex = $tar.parent().index(),
            tarL = -parIndex * 110 + 330;
        tarL = tarL < minL ? minL : (tarL > maxL ? maxL : tarL);
        $item.css('left', tarL);

        //->根据当前的情况计算出展示的七个A中第一个和最后一个代表的时间
        var strIn = Math.abs(tarL / 110),
            endIn = strIn + 6;
        var strTime = $links.eq(strIn).attr('data-time'),
            endTime = $links.eq(endIn).attr('data-time');

        //->展示比赛区域的信息
        matchRender.init(columnId, strTime, endTime);
    });

    //->CLICK
    $calendarPlain.add(function (columnId, today, data) {
        $btn.on('click', function () {
            var curL = parseFloat($item.css('left'));
            curL % 110 !== 0 ? curL = Math.round(curL / 110) * 110 : null;
            $(this).hasClass('btnLeft') ? curL += 770 : curL -= 770;
            curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
            $item.stop().animate({left: curL}, 300, function () {
                //->让展示的这七个中的第一个被选中
                var strIn = Math.abs(curL / 110),
                    endIn = strIn + 6;
                var strTime = $links.eq(strIn).attr('data-time'),
                    endTime = $links.eq(endIn).attr('data-time');
                $links.eq(strIn).addClass('bg').parent().siblings().removeClass('bg');
                //->MATCH区域的内容也要跟着变
                matchRender.init(columnId, strTime, endTime);
            });
        });
    });

    return {
        init: function (columnId) {
            //->GET DATA
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + columnId,
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result.code == 0) {
                        result = result['data'];
                        var today = result['today'],
                            data = result['data'];
                        $calendarPlain.fire(columnId, today, data);
                    }
                }
            });
        }
    }
})();

/*--MATCH--*/
var matchRender = (function () {
    return {
        init: function (columnId, starTime, endTime) {

        }
    }
})();


menuRender.init();