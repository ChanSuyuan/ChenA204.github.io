function goTop(cls) { //	cls-[字符串]	类名
    $(cls).on('click', function() {
        $('body, html').stop().animate({
            scrollTop: 0
        }, 400 + $(window).scrollTop() * 0.3);
    });
}