
function setup() { "use strict";

  var canvas = document.getElementById('myCanvas');
  var objects = []
  
  var topGrab = {priority:-1, obj:null};

  // When the mouse is cliked, the (x,y) of the click is broadcast
  // to all objects.
  canvas.addEventListener('mousedown', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    objects.forEach(obj => obj.mouseDown(x,y,topGrab))
    if (topGrab.obj){
      console.log(`grabbed ${topGrab.obj.token} ${topGrab.priority}`)
      topGrab.obj.grabbed = true
    }
    
  });

  canvas.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    objects.forEach(obj => obj.mouseMove(x,y))
  });

  canvas.addEventListener('mouseup', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    objects.forEach(obj => obj.mouseUp(x,y))
    if (topGrab.obj){
      topGrab.obj.grabbed = false
      console.log(`let go ${topGrab.obj}`)
      topGrab = {priority:-1, obj:null};
    }
  });

  function draw() {

    var ctx = canvas.getContext('2d');
    canvas.width = canvas.width;

    //Background
    Color.setColor(ctx,Color.black)
    ctx.fillRect(0,0,canvas.width,canvas.height);

    Color.setColor(ctx,Color.white)
    loadLevel(ctx)

    Color.setColor(ctx,Color.red)
    Shapes.LineSegment(ctx, 100,500, 200,550, 10, 15)
    Shapes.Circle(ctx, 250,250, 15)


    for (let i = 0; i < objects.length; i++){
      objects[i].draw(ctx);
    }

    window.requestAnimationFrame(draw); 
  }
  draw();
  console.log(objects)
}
window.onload = setup;
