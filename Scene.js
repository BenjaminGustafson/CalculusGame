/**
 * This file contains all of the data for the levels.
 * 
 * The canvas is set to 1600 x 900 px, and scaled down if the window is too small.
 * We do all layout math relative to the 1600 x 900 px.
 * 
 * Hardcoding pixel values might seem like bad practice, but we know that we want 
 * the aspect ratio to be 16:9. And its arguably more human readable.
 * 
 * 
*/

/**
 * Defining these levels without code reuse is tricky
 * What we really want is to be able to say level 2 is 
 * the same as level 1, with some changes.
 * All we need is the objects and update. You can't access other levels in the switch case.
 * Store each as a variable. Access via the variable name?! Seems like a bad idea.
 * But a switch case from strings to variable names is not useful...
 * Really I want a tree data structure. But the elements of the tree are instructions
 * Make them variables or functions?
 * I think functions is the better option because you don't need to load everything into memory.
 * Not that it matters for this size of information.
 * 
 * scene1(gameState) returns nothing
 * scene2(gameState){
 *   gameState.objs["name"].field = modify
 * }
 * so objs should be a dict, not a list...
 */

function mainMenu(gameState){
    gameState.objects = {
        button1 : new NavButton(300,250,100,100, (()=> gameState.sceneName = "introMenu"), "1"),
        button2 : new NavButton(600,250,100,100, (()=> gameState.sceneName = "quadMenu"), "2"),
        button3 : new NavButton(900,250,100,100, (()=> gameState.sceneName = ""), "3"),
        button4 : new NavButton(1200,250,100,100, (()=> gameState.sceneName = ""), "4"),
        button5 : new NavButton(300,550,100,100, (()=> gameState.sceneName = ""), "5"),
        button6 : new NavButton(600,550,100,100, (()=> gameState.sceneName = ""), "6"),
        button7 : new NavButton(900,550,100,100, (()=> gameState.sceneName = ""), "7"),
        button8 : new NavButton(1200,550,100,100, (()=> gameState.sceneName = ""), "8"),
    }
    gameState.update = (()=>{})
}

function introMenu(gameState){
    mainMenu(gameState)
    gameState.objects.button1.onclick =  (()=> gameState.sceneName = "intro1")
    gameState.objects.button1.label = "1.1"
    gameState.objects.button2.onclick =  (()=> gameState.sceneName = "intro2")
    gameState.objects.button2.label = "1.2"
    gameState.objects.button3.onclick =  (()=> gameState.sceneName = "intro3")
    gameState.objects.button3.label = "1.3"
    delete gameState.objects.button5
    delete gameState.objects.button6
    delete gameState.objects.button7
    delete gameState.objects.button8
    gameState.objects.backButton = new NavButton(100,100,100,100, (()=> gameState.sceneName = "mainMenu"), "↑"),
    buttons = [gameState.objects.button1, gameState.objects.button2,gameState.objects.button3,
        gameState.objects.button4,gameState.objects.button5,gameState.objects.button6,gameState.objects.button7,gameState.objects.button8
    ]
    gameState.update = (()=>{
        for (let i = 0; i < buttons.length; i++){
            if (gameState.completedLevels["intro"+(i+1)]){
                gameState.objects["button"+(i+1)].color = Color.blue
            }
        }
    })

}

function introLevels(gameState, vals, name, next){
    // Right align 100px left of middle (800-100-400=300)
    // Center vertically (450-400/2=250)
    const gridLeft = new Grid(300,250,400,400,4,4,5,2,2)
    // Left align 100px right of middle (800+100=900)
    const gridRight = new Grid(900,250,400,400,4,4,5,2,2)
    // On first four cols of gridRight
    // x = 900, 950, 1000, 1050. top_y = 250.  
    const slider1 = new Slider(900, 250, 400, 8, 0, 4, 0.2, false)
    const slider2 = new Slider(1000, 250, 400,  8, 0, 4, 0.2, false)
    const slider3 = new Slider(1100, 250, 400,  8, 0, 4, 0.2, false)
    const slider4 = new Slider(1200, 250, 400,  8, 0, 4, 0.2, false)
    const target1_coord = gridLeft.gridToCanvas(-1,vals[0])
    const target2_coord = gridLeft.gridToCanvas(0,vals[1])
    const target3_coord = gridLeft.gridToCanvas(1,vals[2])
    const target4_coord = gridLeft.gridToCanvas(2,vals[3])
    const target1 = new Target(target1_coord.x,target1_coord.y,10)
    const target2 = new Target(target2_coord.x,target2_coord.y,10)
    const target3 = new Target(target3_coord.x,target3_coord.y,10)
    const target4 = new Target(target4_coord.x,target4_coord.y,10)
    const tracer = new Tracer(300,450,gridLeft,[slider1,slider2,slider3,slider4],60,[target1,target2,target3,target4])
    const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "introMenu"),"↑")
    const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
    forward_button.active = false
    function update (){
        if(tracer.solved && !gameState.completedLevels[name]){
            //localStorage.setItem(name, "solved");
            gameState.completedLevels[name] = true
            gameState.writeToStorage = true
            
        }
        if (gameState.completedLevels[name]){
            forward_button.active = true
        }
    }
    const objs = [gridLeft,gridRight,slider1,slider2,slider3,slider4,tracer,target1,target2,target3,target4, back_button, forward_button]
    gameState.objects = objs
    gameState.update = update
}


function loadScene(gameState){
    switch (gameState.sceneName){
        case "":
        case "mainMenu":{   
            mainMenu(gameState)
            break
        }
        case "introMenu":{
            introMenu(gameState)
            break
        }
        case "quadMenu":{
            gameState.objects = [ 
                new NavButton(300,250,100,100, (()=> gameState.sceneName = "quad1"), "2.1"),
                new NavButton(600,250,100,100, (()=> gameState.sceneName = "quad2"), "2.2"),
                new NavButton(900,250,100,100, (()=> gameState.sceneName = "quad3"), "2.3"),
                new NavButton(1200,250,100,100, (()=> gameState.sceneName = "quad4"), "2.4"),
                new NavButton(100,100,100,100, (()=> gameState.sceneName = "mainMenu"), "←"),
            ]
            
            if (localStorage.getItem("quad1") == "solved"){
                gameState.objects[0].color = Color.blue
            }
            if (localStorage.getItem("quad2") == "solved"){
                gameState.objects[1].color = Color.blue
            }
            gameState.update = (()=>{})
            break
        }
        
        case "intro1":{
            introLevels(gameState, [0,1,1,2], "intro1", "intro2")
            break
        }
        case "intro2":{
            introLevels(gameState, [1,0,-1,0], "intro2", "intro3")
            break
        }
        case "intro3":{
            introLevels(gameState, [0.5,1,0.5,1.5], "intro3", "intro4")
            break
        }
        case "intro4":{
            introLevels(gameState, [2,1.5,-0.5,-2], "intro4", "intro5")
            break
        }
        case "quad1":{
            // Right align 100px left of middle (800-100-400=300)
            // Center vertically (450-400/2=250)
            const gridLeft = new Grid(300,250,400,400,4,4,5,2,2)
            // Left align 100px right of middle (800+100=900)
            const gridRight = new Grid(900,250,400,400,4,4,5,2,2)
            // On first four cols of gridRight
            // x = 900, 950, 1000, 1050. top_y = 250.  
            const slider1 = new Slider(900, 250, 400, 8, 0, 4, 0.2, false)
            const slider2 = new Slider(1000, 250, 400,  8, 0, 4, 0.2, false)
            const slider3 = new Slider(1100, 250, 400,  8, 0, 4, 0.2, false)
            const slider4 = new Slider(1200, 250, 400,  8, 0, 4, 0.2, false)
            const target1_coord = gridLeft.gridToCanvas(-1,0)
            const target2_coord = gridLeft.gridToCanvas(0,0)
            const target3_coord = gridLeft.gridToCanvas(1,0)
            const target4_coord = gridLeft.gridToCanvas(2,0)
            const target1 = new Target(target1_coord.x,target1_coord.y,10)
            const target2 = new Target(target2_coord.x,target2_coord.y,10)
            const target3 = new Target(target3_coord.x,target3_coord.y,10)
            const target4 = new Target(target4_coord.x,target4_coord.y,10)
            const tracer = new Tracer(300,450,gridLeft,[slider1,slider2,slider3,slider4],60,[target1,target2,target3,target4])
            const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "quadMenu"),"←")
            const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
            forward_button.active = false
            function update (){
                if(tracer.solved){
                    localStorage.setItem(name, "solved");
                    forward_button.active = true
                }
            }
            const objs = [gridLeft,gridRight,slider1,slider2,slider3,slider4,tracer,target1,target2,target3,target4, back_button, forward_button]
            gameState.objects = objs
            gameState.update = update
            break
        }
        case "demoDisc":{
            // Right align 100px left of middle (800-100-400=300)
            // Center vertically (450-400/2=250)
            const gridLeft = new Grid(300,250,400,400,4,4,5,2,2)
            // Left align 100px right of middle (800+100=900)
            const gridRight = new Grid(900,250,400,400,4,4,5,2,2)
            // On first four cols of gridRight
            // x = 900, 950, 1000, 1050. top_y = 250.  
            const slider1 = new Slider(900, 250, 400, 8, 0, 4, 0.2, false)
            const slider2 = new Slider(1000, 250, 400,  8, 0, 4, 0.2, false)
            const slider3 = new Slider(1100, 250, 400,  8, 0, 4, 0.2, false)
            const slider4 = new Slider(1200, 250, 400,  8, 0, 4, 0.2, false)
            const target1_coord = gridLeft.gridToCanvas(-1,1)
            const target2_coord = gridLeft.gridToCanvas(0,0.5)
            const target3_coord = gridLeft.gridToCanvas(1,0.5)
            const target4_coord = gridLeft.gridToCanvas(2,0)
            const target1 = new Target(target1_coord.x,target1_coord.y,10)
            const target2 = new Target(target2_coord.x,target2_coord.y,10)
            const target3 = new Target(target3_coord.x,target3_coord.y,10)
            const target4 = new Target(target4_coord.x,target4_coord.y,10)
            const tracer = new Tracer(300,450,gridLeft,[slider1,slider2,slider3,slider4],60,[target1,target2,target3,target4])
            const button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "mainMenu"))
            button.active = false
            function update (){
                if(tracer.solved){
                    button.active = true
                }
            }
            const objs = [gridLeft,gridRight,slider1,slider2,slider3,slider4,tracer,target1,target2,target3,target4, button]
            gameState.objects = objs
            gameState.update = update
            break
        }
        case "intro2x2":{

        }
        case "demoCont":{
            // Right align 100px left of middle (800-100-400=300)
            // Center vertically (450-400/2=250)
            const gridLeft = new Grid(100,250,400,400,4,4,5,4,2)
            // Left align 100px right of middle (800+100=900)
            const gridRight = new Grid(600,250,400,400,4,4,5,2,2)
            const block1 = new MathBlock(MathBlock.VARIABLE,"x",1300,250)
            const block2 = new MathBlock(MathBlock.POWER,"2",1300,350)
            const ty_slider = new Slider(1100, 250, 400, 8, 0, 4, 0.1, true, true)
            const sy_slider = new Slider(1200, 250, 400, 8, 1, 4, 0.1, true, true)
            const funRight = new FunctionTracer(gridRight)
            //const funLeft = new FunctionTracer(gridLeft, (x => x*x))
            //funLeft.color = Color.red
            const mngr = new MathBlockManager([block1,block2],600,150, ty_slider, sy_slider, funRight)
            const target_coords = [
                gridLeft.gridToCanvas(-1,0.5),
                gridLeft.gridToCanvas(0,0)
            ]
            const targets = []
            for (let i = 0; i < target_coords.length; i++){
                targets.push(new Target(target_coords[i].x, target_coords[i].y,10))
            }
            const tracer = new ContinuousTracer(100,450,gridLeft,{type:"mathBlock",mathBlockMngr:mngr},60,targets)
            gameState.objects = [gridLeft,gridRight,sy_slider,ty_slider,mngr,funRight,tracer].concat(targets)
            break
        }
    }
}


