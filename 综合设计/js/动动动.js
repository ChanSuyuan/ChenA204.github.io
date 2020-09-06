function weasel() {
    var obj = $('x-footer');
    var slot = obj.find('slot');
    var track = slot.find('slot-track');
    var item = slot.find('slot-item');
    var width = obj.width();
    var length = track.length;

    var limit = width / length * 5;
    var timer = null,
        times = 0,
        clientX = 0;

    obj.on('mousemove.move', moveFn);
    obj.on('mousemove.out', $.debounce(5000, outFn));

    function moveFn(ev) {
        clientX = ev.clientX;
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(animation);
        times = new Date().valueOf();
    }

    function outFn() {
        cancelAnimationFrame(timer);
        item.removeAttr('style');
    }

    function animation() {
        var animationTime = new Date().valueOf();

        track.each(function(idx, el) {
            var _this = $(this);
            var _item = _this.find('.slot-item');
            var middle = offsetL(_this) + _this.width() / 2;
            var distance = Math.abs(clientX - middle);

            if (distance > limit) distance = limit;

            var scale = Math.abs(distance / limit) * 50;

            var top = _item.position().top;
            var n = top / slot.height() * 100;
            var t = (scale - n) / 2;
            n += t;

            TweenMax.set(_item, {
                y: n + '%',
                top: 0
            });
        });

        if (animationTime - times < 1000) {
            timer = requestAnimationFrame(animation);
        }
    }

    function offsetL(obj) {
        var left = 0;
        var ol = obj.offset().left;

        while (obj) {
            left += ol;
            obj = null;
        }
        return left;
    }
}