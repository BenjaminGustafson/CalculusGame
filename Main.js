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

  // When the mouse is clicked, the (x,y) of the click is broadcast
  // to all objects.
  canvas.addEventListener('mousedown', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    canvas.style.cursor = 'default'
    gameState.objects.forEach(obj => {
        if (typeof obj.mouseDown === 'function'){
            const cursor = obj.mouseDown(x,y)
            if (cursor != null){
                canvas.style.cursor = cursor
            }
        }
    })

  });

  canvas.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    canvas.style.cursor = 'default'
    gameState.objects.forEach(obj => {
        if (typeof obj.mouseMove === 'function'){
            const cursor = obj.mouseMove(x,y)
            if (cursor != null){
                canvas.style.cursor = cursor
            }
        }
    })
  });

  canvas.addEventListener('mouseup', function (event) {
    var rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)*(canvas.width/rect.width);
    const y = (event.clientY - rect.top)*(canvas.height/rect.height);
    canvas.style.cursor = 'default'
    gameState.objects.forEach(obj => {
        if (typeof obj.mouseUp === 'function'){
            const cursor = obj.mouseUp(x,y)
            if (cursor != null){
                canvas.style.cursor = cursor
            }
        }
    })
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




