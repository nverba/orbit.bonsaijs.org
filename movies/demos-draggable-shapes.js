rand = Math.random;

var size = 25;

for (var i = 0; i < 100; ++i) {
  setTimeout(function() {
    var r, x, y, thisSize = rand() * size + size;
    switch (0 | Math.random()*3) {
      case 0:
        r = new Rect(0, 0, 0, 0);
        break;
      case 1:
        r = new Star(0, 0, 0, 0 | rand() * 10 + 3, rand() + 1);
        break;
      case 2:
        r = new Circle(0, 0, 0);
    }
    r.fill(color('red').randomize('h')).stroke('#000', 2).addTo(stage).attr({
      x: rand() * 700,
      y: rand() * 500
    }).on('multi:pointerdown', function(e) {
      // Catch new x/y at beginning of drag
      x = this.attr('x');
      y = this.attr('y');
      r.addTo(r.parent);
    })
    .on('multi:drag', function(e){
      this.attr({
        x: x + e.diffX,
        y: y + e.diffY
      });
    })
    .emit('multi:pointerdown')
    .animate('.5s', {
      radius: thisSize,
      width: thisSize,
      height: thisSize
    }, {
      easing: 'elasticOut'
    });
  }, i * 50);
}
