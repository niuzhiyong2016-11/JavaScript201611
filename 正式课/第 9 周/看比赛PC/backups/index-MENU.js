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

    pro.queryURLParameter = queryURLParameter;
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

    return {
        init: function () {
            //->ISCROLL
            menuExample = new IScroll('#menu', {
                scrollbars: true,
                mouseWheel: true,
                fadeScrollbars: true,
                click: true
            });

            //->BY HASH POSITION TO ELEMENT
            var hash = window.location.href.queryURLParameter()['HASH'],
                $tar = $links.filter('[href="#' + hash + '"]');
            $tar.length === 0 ? $tar = $links.eq(0) : null;
            $tar.addClass('bg');
            menuExample.scrollToElement($tar[0], 0);

            //->CLICK
            $links.on('click', function () {
                //$(this).addClass('bg').parent().siblings().children('a').removeClass('bg');
                var _this = this;
                $links.each(function (index, item) {
                    _this === item ? $(item).addClass('bg') : $(item).removeClass('bg');
                });
            });
        }
    }
})();

menuRender.init();