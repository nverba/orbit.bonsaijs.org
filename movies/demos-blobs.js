// credits: http://twitter.com/crafics

var groups = [];
groups.push( new Group().addTo(stage) );
groups.push( new Group().addTo(stage) );

var currentState;
var blobs = [];

var width = env.windowWidth/2; // minus side nav

var setup;
function updateSetup() {
  var width = env.windowWidth/2; // minus side nav
  setup = {
    stageWidth: width,
    stageHeight: env.windowHeight,
    stageCenter: {x:width/2,y:env.windowHeight/2}
  };
}

updateSetup();
env.on('change', updateSetup);

var dynamic = {
    scale: true,
    opacity: false,
    blur: false,
    speed: 1
};
/* tools */
var fps = {
  strength:20,
  frameTime:0,
  lastLoop:new Date(),
  thisLoop:null,
  measure:function(){
    fps.frameTime += ((fps.thisLoop=new Date())-fps.lastLoop-fps.frameTime)/fps.strength;
    fps.lastLoop = fps.thisLoop;
    return this;
  },
  toString:function(){
    return (1000/this.frameTime).toFixed(1) + " fps";
  }
};
function newColor(){
  return color('white').randomize();
}
function newBlob(){
  var blob = {
    width:Math.random()*40,
    height:Math.random()*40,
    scale:0.2,
    opacity:1,
    x:setup.stageCenter.x,
    y:setup.stageCenter.y,
    xSpeed:Math.random()*10-5,
    ySpeed:Math.random()*10-5
  };
  blob.shape = Path.circle(blob.x,blob.y,blob.width).attr({fillColor:newColor(),opacity:blob.opacity});
  return blob;
}
function stats(){
  var statsStr = blobs.length+" blobs at "+fps.measure().toString();
  frameCalcText.attr('text',statsStr);
}

/* states */
function stateInit(){
  frameCalcText = new Text("Calculating...")
    .attr({x:10,y:16,fontFamily: 'Arial',fontSize: '12px',textFillColor: 'black'}).addTo(stage);
  setInterval(stats,1000);
  currentState = stateRun;
}
function stateRun(){
  stats();
  var i=0;
  for(;i<dynamic.speed;i++){
    var blob = newBlob();
    blob.shape.addTo(groups[1],0);

    blobs.push(blob);
  }
  // filters are now on groups
  if(dynamic.blur){ groups[1].attr("filters", [new filter.Blur(2)]); }
  else { groups[1].attr("filters", []); }
  for(i=0;i<blobs.length;i++){
    if(blobs[i].opacity<=0||blobs[i].x>setup.stageWidth||blobs[i].x<0||blobs[i].y>setup.stageHeight||blobs[i].y<0){
      blobs[i].shape.remove();
      blobs.splice(i,1);
    }
    blobs[i].x += blobs[i].xSpeed;
    blobs[i].y += blobs[i].ySpeed;
    blobs[i].scale *= 1.04;
    blobs[i].opacity -= 0.015;
    if(dynamic.scale){ blobs[i].shape.attr("scale", blobs[i].scale); }
    if(dynamic.opacity){ blobs[i].shape.attr("opacity", blobs[i].opacity); }
    //if(dynamic.blur){ blobs[i].shape.attr("filters", [new filter.Blur(1)]); }
    blobs[i].shape.attr("x", blobs[i].x);
    blobs[i].shape.attr("y", blobs[i].y);
  }
}
function statePause(){ stats(); }
function stateDispose(){ /* implement */ }

/* init */
currentState = stateInit;
stage.on("tick", function(){ currentState(); });
