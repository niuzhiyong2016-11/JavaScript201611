function banner(/*container,*/dataUrl){
    //var $banner = $('.banner',document);
// children utils.children
    var $bannerInner = this.find('.bannerInner');
    var $focusList = this.find('.focusList');
    var $left = this.find('.left');
    var $right = this.find('.right');
// 使用jQuery对于动态绑定进来的元素需要重新获取
    var $imgs = null;
    var $lis = null;
//ajax
    $.ajax({
        url : dataUrl,
        type : 'get',
        async : false,
        dataType : 'json',
        success : function (data){
            window.data = data;
        }
    });
    console.log(data);

// bindData
    if(window.data){
        var str = '';
        var str1 = '';
        $.each(data,function (index,item){
            str += '<div><img src="" realSrc="'+ item.src +'"></div>';
            str1 += index == 0 ?  '<li class="selected"></li>' : '<li></li>';
        });
        $bannerInner.html(str);
        $focusList.html(str1);
    }
// 加载图片
    $imgs = $bannerInner.find('img');
    $lis = $focusList.find('li');
//
    $imgs.each(function (index,item){
        //this == item
        var temp = new Image(); // $('<img>')
        // attr prop
        $(temp).prop('src',$(item).attr('realSrc'));
        $(temp).on('load',function (){ // 用on绑定事件一般前面事件类型前面的on'去掉
            if(index == 0){
                $(item).parent().css({'zIndex':1}).animate({opacity:1},500);
            }
            $(item).prop('src',$(this).prop('src'));
            $(item).css('display','block');
        });
    });

    var timer = window.setInterval(autoMove,2000);
    var step = 0;
    function autoMove(){
        step++;
        if(step == data.length){
            step = 0;
        }
        setImg();
    }
    function setImg(){
        $imgs.each(function (index,item){
            if(index == step){
                $(this).parent().css('zIndex',1).animate({opacity:1},500,function (){
                    $(item).parent().siblings().each(function (index,item){
                        $(item).css('opacity',0);
                    });
                });
            } else{
                $(this).parent().css('zIndex',0);
            }
        });
        $lis.each(function (index,item){
            index === step ? $(item).addClass('selected') : $(item).removeClass('selected');
        });
    }
}

$.extend({
    banner : banner
});
$.fn.extend({
    banner : banner
})
var $banner = $('.banner');
$banner.banner(/*$banner,*/'data1.txt');
$('#banner1').banner('data2.txt');
//$().banner($banner,'data1.txt');