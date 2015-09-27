function Button(resourcesUrl) {
  Group.call(this);
  resourcesUrl = resourcesUrl || '';
  this.buttonUp = new Bitmap(resourcesUrl + 'Button_normal.png').addTo(this);
  this.buttonDown = new Bitmap(resourcesUrl + 'Button_pressed.png').attr({y: -2}).addTo(this);
  this.pauseGlyph = new Bitmap(resourcesUrl + 'Pause_glyph.png').attr({x: 18, y: 15}).addTo(this);
  this.playGlyph = new Bitmap(resourcesUrl + 'Play_glyph.png').attr({x: 22, y: 13}).addTo(this);
  this.isPlaying = false;
  this.changeState(false);
  this.on('pointerdown', this.handleMouseDown);
  this.on('pointerup', this.handleMouseUp);
}

Button.prototype = Object.create(Group.prototype);

Button.prototype.changeState = function(isDownState) {
  this.buttonDown.attr('visible', isDownState);
  this.buttonUp.attr('visible', !isDownState);
  this.playGlyph.attr('visible', !this.isPlaying);
  this.pauseGlyph.attr('visible', this.isPlaying);
};

Button.prototype.handleMouseDown = function(e) {
  this.changeState(true);
};

Button.prototype.handleMouseUp = function(e) {
  this.isPlaying = !this.isPlaying;
  this.changeState(false);
  this.emit(this.isPlaying ? 'play' : 'pause');
};

var AUDIO_SRC = [
  {src: 'assets/ClosingCredits.mp3'},
  {src: 'assets/ClosingCredits.ogg'}
];
var AUDIO_LENGTH = 45000;

// SOUNDS FROM http://www.mediacollege.com/downloads/sound-effects/star-trek/tos/

var animationDisc, wantsToPlay = false, audioLoaded = false;
var audio = new bonsai.Audio(AUDIO_SRC).addTo(stage).on('load', function() {
  audioLoaded = true;
  if (wantsToPlay) {
    audio.play();
    animationDisc.play();
  }
}).prepareUserEvent();

var centerX = 200/2;
var centerY = 200/2;

(function drawButton() {

  var all = new Group().attr({
    x: centerX - (176/2),
    y: centerY - (176/2)
  }).addTo(stage);

  var disc = new Bitmap('assets/CD.png').attr({
    origin: new Point(88, 87.5)
  });
  var spinner = new Bitmap('assets/Spinner.png').attr({
    x: -5,
    y: -5,
    origin: new Point(94.5, 95)
  });
  var button = new Button('assets/').attr({
    x: 59,
    y: 59
  });

  animationDisc = new Animation('.6s', {
    rotation: Math.PI*2
  }, {
    repeat: Infinity
  }).addSubject(disc);

  button.on('play', function() {
    wantsToPlay = true;

    if (audioLoaded) {
      audio.play();
      animationDisc.play();
    } else {
      // Loading
      // console.log("Loading………");
    }
  });
  button.on('pause', function() {
    wantsToPlay = false;
    audio.pause();
    animationDisc.pause();
  });

  var currentTime = 0;
  var lastTickTime = +new Date;

  stage.on('tick', onTick);

  function onTick() {
    if (audioLoaded && button.isPlaying) {
      // Add to currentTime on every tick (estimating where the audio is at)
      currentTime += +new Date - lastTickTime;
    }
    lastTickTime = +new Date;
    spinner.attr('rotation', Math.PI*2*(currentTime/AUDIO_LENGTH));
    if (currentTime > AUDIO_LENGTH) {
      // Fade out controls at end of audio
      all.animate('.5s', { opacity: 0 });
      stage.removeListener('tick', onTick);
    }
  }

  disc.addTo(all);
  spinner.addTo(all);
  button.addTo(all);

  // Spinner scrubbing

  spinner.on('drag', function(e) {
    var x = e.stageX - centerX;
    var y = e.stageY - centerY;
    // Calculate angle:
    var a = Math.atan2(y, x);
    a += Math.PI/2; // Take quarter
    if (a < 0) a = Math.PI*2 + a; // Make it from 0..(Math.PI*2)
    currentTime = a / (Math.PI*2) * AUDIO_LENGTH;
    audio.attr('time', currentTime / 1000);
  });

})();