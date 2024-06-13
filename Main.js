
function setup() { "use strict";

  var canvas = document.getElementById('myCanvas');
  //  All objects must:
  //  - have a draw(ctx) method
  //  - have a mouseMove(x,y) method that checks if the mouse is over the object
  //    returns the grab priority of that object, or
  //    -1 if the mouse is not over the object
  //  - have a method grab(x,y) that is called if the grab is successful
  //  - have a release(x,y) method that is called when the 
  //    object is grabbed and then released
  
  const nextLevelAudio = new Audio('audio/confirmation_001.ogg')
  const myAudio = document.getElementById('myAudio')

  const myAudio2 = new Audio('audio/confirmation_001.ogg')
  //myAudio.load()

  

  var levelNumber = 1
  var storedLevelNumber = localStorage.getItem('levelNumber')
  if (storedLevelNumber){
    console.log("restore progress level", storedLevelNumber)
    levelNumber = parseInt(storedLevelNumber)
  }
  if (isNaN(levelNumber)){
    console.log("error getting level from local storage")
    levelNumber = 1
  }
  console.log("levelNumber",levelNumber)
  var level = loadLevel(levelNumber)
  var objects = level.objs
  var solved = false

  var grabbedObj = {priority:-1, obj:null};

  // When the mouse is clicked, the (x,y) of the click is broadcast
  // to all objects.
  canvas.addEventListener('mousedown', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    objects.forEach(obj => {
      const priority = obj.mouseMove(x,y)
      if (priority > grabbedObj.priority){
        grabbedObj.priority = priority
        grabbedObj.obj = obj
      }
    })
    if (grabbedObj.obj){
      console.log("grabbed")
      grabbedObj.obj.grab(x,y)
      canvas.style.cursor = 'grabbing'
    }
  });

  // When the mouse is moved, we alert all objects
  canvas.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    
    canvas.style.cursor = 'default'
    objects.forEach(obj => {
      // If any object returns true, we are hovering over a clickable object
      if (obj.mouseMove(x,y) != -1){
        canvas.style.cursor = 'grab'
      }
    })
    // If an object is already grabbed
    if (grabbedObj.obj){
      canvas.style.cursor = 'grabbing'
    }
  });

  canvas.addEventListener('mouseup', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    
    if (grabbedObj.obj){
      grabbedObj.obj.release(x,y)
      console.log(`let go ${grabbedObj.obj}`)
      // reset grabbedObj
      grabbedObj = {priority:-1, obj:null};
      
      // Revert the cursor
      canvas.style.cursor = 'default'
      objects.forEach(obj => {
        // If any object returns true, we are hovering over a clickable object
        if (obj.mouseMove(x,y) != -1){
          canvas.style.cursor = 'grab'
        }
      })
    }
  });

  function draw() {
    if (level.winCon()){
      solved = true
      console.log("correct")
      myAudio.play();
      level = loadLevel(levelNumber + 1)
      levelNumber ++
      objects = level.objs
      localStorage.setItem("levelNumber",levelNumber)
    }
    var ctx = canvas.getContext('2d');

    //Background
    Color.setColor(ctx,Color.black)
    ctx.fillRect(0,0,canvas.width,canvas.height);
    Color.setColor(ctx,new Color(10,10,10))
    ctx.strokeRect(0,0,canvas.width,canvas.height);

    // Color.setColor(ctx,Color.white)
    // loadLevel(ctx)

    // Color.setColor(ctx,Color.red)
    // Shapes.LineSegment(ctx, 100,500, 200,550, 10, 15)
    // Shapes.Circle(ctx, 250,250, 15)

    

    for (let i = 0; i < objects.length; i++){
      objects[i].draw(ctx);
    }


    window.requestAnimationFrame(draw); 
  }
  draw();
  console.log(objects)
}
window.onload = setup;
