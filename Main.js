/**
 * 
 *  The game state is:
 *    - the current level number
 *    - the game objects in that level
 * 
 *  All game objects must:
 *    - have a draw(ctx) method
 *    - have a mouseMove(x,y) method that checks if the mouse is over the object and
 *      returns the grab priority of that object, or -1 if the mouse is not over the object
 *    - have a method grab(x,y) that is called if the grab is successful
 *    - have a release(x,y) method that is called when the 
 *      object is grabbed and then released.
 * 
 *  A level is an object with:
 *    - objs: a list of game objects
 *    - winCon: a function that checks whether the level is solved
 * 
 */


function setup() { "use strict";

  var canvas = document.getElementById('myCanvas');

  var gameState = {
    levelNumber: 0, 
    objects: [], // TODO: swap this to level
    solved: false,
  }

  const levelList = [
    "demoCont",
  ]

  var level = playLevel(levelList[gameState.levelNumber])
  gameState.objects = level.objs

  // ----------------------------------------------------------------------------------------------
  // Mouse events
  // ----------------------------------------------------------------------------------------------
  // We handle which object can be grabbed in the main class
  var grabbedObj = {priority:-1, obj:null};

  // When the mouse is clicked, the (x,y) of the click is broadcast
  // to all objects.
  canvas.addEventListener('mousedown', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    gameState.objects.forEach(obj => {
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
    gameState.objects.forEach(obj => {
      // If any object returns 1, we are hovering over a grabbable object
      if (obj.mouseMove(x,y) == 1){ // TODO: fix magic number
        canvas.style.cursor = 'grab'
      }
      else if (obj.mouseMove(x,y) == 2){ // Clickable object
        canvas.style.cursor = 'pointer'
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
      gameState.objects.forEach(obj => {
        // If any object returns true, we are hovering over a clickable object
        if (obj.mouseMove(x,y) != -1){
          canvas.style.cursor = 'grab'
        }
      })
    }
  });



  // ----------------------------------------------------------------------------------------------
  // The main update loop
  // ----------------------------------------------------------------------------------------------
  function update() {
    if (level.winCon()){
      gameState.solved = true
      console.log("correct")
      gameState.levelNumber ++
    }
    var ctx = canvas.getContext('2d');

    //Background
    Color.setColor(ctx,Color.black)
    ctx.fillRect(0,0,canvas.width,canvas.height);
    Color.setColor(ctx,new Color(10,10,10))
    ctx.strokeRect(0,0,canvas.width,canvas.height);


    for (let i = 0; i < gameState.objects.length; i++){
      gameState.objects[i].draw(ctx);
    }


    window.requestAnimationFrame(update); 
  }

  var ctx = canvas.getContext('2d');
  ctx.font = "40px monospace";
  const tokens = ["x","f","+","•","sin","e","-"]
  for (let i = 0 ; i < tokens.length; i ++){
      console.log(tokens[i], ctx.measureText(tokens[i]).width)
  }


  update();
  console.log(gameState.objects)
}
window.onload = setup;




