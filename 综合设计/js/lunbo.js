var items = document.getElementsByClassName('item');
var points = document.getElementsByClassName('point');
var goPreBtn = document.getElementById('goPre');
var goNextBtn = document.getElementById('goNext');
var time = 0;
//index表示第几张图片在显示
var index = 0;

var clearAcitive = function() {
    for (var i = 0; i < items.length; i++) {
        items[i].className = 'item';
    }
    for (var i = 0; i < items.length; i++) {
        points[i].className = 'point';
    }
}
var goIndex = function() {
    clearAcitive();
    console.log(index);
    points[index].className = 'point active';
    items[index].className = 'item active';
}
var goNext = function() {
    if (index < 4) {
        index++;
    } else {
        index = 0;
    }

    goIndex();
}
var goPre = function() {
    if (index == 0) {
        index = 4;

    } else {
        index--;
    }
    goIndex();
}
goNextBtn.addEventListener('click', function() {
    goNext();
})
goPreBtn.addEventListener('click', function() {
    goPre();
})

for (var i = 0; i < points.length; i++) {
    points[i].addEventListener('click', function() {
        var pointIndex = this.getAttribute('data-index');
        index = pointIndex;
        goIndex();
        time = 0;
    })
}


setInterval(function() {
    time++;
    if (time == 30) {
        goNext();
        time = 0;
    }

}, 100)