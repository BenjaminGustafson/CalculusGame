/**
 * This file contains all of the data for the levels.
 * 
 * The canvas is set to 1600 x 900 px, and scaled down if the window is too small.
 * We do all layout math relative to the 1600 x 900 px.
 * We know that we want the aspect ratio to be 16:9, so we hardcode to 1600 x 900.
 * Its arguably more human readable.
 * 
 * 
*/

/**
 * 
 * Template levels are defined in functions for reuse.
 * 
 * Rather than thinking of this as a dependency tree between levels,
 * you could also just write helper functions that are reused
 * That way its not taking an existing level and modifying it, 
 * and each level is presented constructively.
 * 
 */

function mainMenu(gameState){
    gameState.objects = {
        // Could use alignment and distribution helpers
        button1 : new NavButton(300,250,100,100, (()=> gameState.sceneName = "introMenu"), "1"),
        button2 : new NavButton(600,250,100,100, (()=> gameState.sceneName = "quadMenu"), "2"),
        button3 : new NavButton(900,250,100,100, (()=> gameState.sceneName = "cubicMenu"), "3"),
        button4 : new NavButton(1200,250,100,100, (()=> gameState.sceneName = "expMenu"), "4"),
        button5 : new NavButton(300,550,100,100, (()=> gameState.sceneName = "sineMenu"), "5"),
        button6 : new NavButton(600,550,100,100, (()=> gameState.sceneName = "sumMenu"), "6"),
        button7 : new NavButton(900,550,100,100, (()=> gameState.sceneName = "prodMenu"), "7"),
        button8 : new NavButton(1200,550,100,100, (()=> gameState.sceneName = "chainMenu"), "8"),
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
    gameState.objects.button4.onclick =  (()=> gameState.sceneName = "intro4")
    gameState.objects.button4.label = "1.4"
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

function subMenu(gameState, num, name){
    buttons = []
    for (let i = 0; i < 8; i++){
        buttons.push(new NavButton(300*(i%4+1),250+300*Math.floor(i/4),100,100, (()=> gameState.sceneName = name+(i+1)), num+"."+(i+1)))
    }
    const backButton = new NavButton(100,100,100,100, (()=> gameState.sceneName = "mainMenu"), "↑")
    buttons.push(backButton)

    gameState.update = (()=>{
        for (let i = 0; i < buttons.length; i++){
            if (gameState.completedLevels[name+(i+1)]){
                buttons[i].color = Color.blue
            }
        }
    })
    gameState.objects = buttons
    
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
    const target1 = new Target(target1_coord.x,target1_coord.y,15)
    const target2 = new Target(target2_coord.x,target2_coord.y,15)
    const target3 = new Target(target3_coord.x,target3_coord.y,15)
    const target4 = new Target(target4_coord.x,target4_coord.y,15)
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

function quadDiscLevel(gameState, num_sliders, next){
    const gridLeft = new Grid(300,250,400,400,4,4,5,2,2)
    const gridRight = new Grid(900,250,400,400,4,4,5,2,2)
    var sliders = []
    const slider_spacing = 400/num_sliders
    for (let i = 0; i < num_sliders; i++){
        sliders.push(new Slider(900+slider_spacing*i, 250, 400, 4, 0, 2, 0.01, false, vertical=true,circleRadius=10))
    }
    const target_coords = []
    for (let i = 0; i<num_sliders; i++){
        const x = -2 + (i+1)/num_sliders*4
        target_coords.push([x,x*x/2])
    }
    var targets = []
    for (let i = 0; i < target_coords.length; i++){
        const coord = gridLeft.gridToCanvas(target_coords[i][0],target_coords[i][1])
        targets.push(new Target(coord.x, coord.y, 10))
    }
    const tracer = new ContinuousTracer(300,250,gridLeft,
        {type:"sliders",sliders:sliders,slider_spacing:slider_spacing},
        4,targets)
    const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "quadMenu"),"↑")
    const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
    forward_button.active = false
    function update (){
        if(tracer.solved && !gameState.completedLevels[gameState.sceneName]){
            gameState.completedLevels[gameState.sceneName] = true
            gameState.writeToStorage = true
            
        }
        if (gameState.completedLevels[gameState.sceneName]){
            forward_button.active = true
        }
    }
    const objs = [gridLeft,gridRight,tracer, back_button, forward_button].concat(targets).concat(sliders)
    gameState.objects = objs
    gameState.update = update
}

function cubicDiscLevel(gameState, num_sliders, next){
    // To generalize
    const fun = x => x*x*x/6

    const gridLeft = new Grid(300,250,400,400,4,4,5,2,2)
    const gridRight = new Grid(900,250,400,400,4,4,5,2,2)
    var sliders = []
    const slider_spacing = 400/num_sliders
    for (let i = 0; i < num_sliders; i++){
        sliders.push(new Slider(900+slider_spacing*i, 250, 400, 4, 0, 2, 0.01, false, vertical=true,circleRadius=10))
    }
    const target_coords = []
    for (let i = 0; i<num_sliders; i++){
        const x = -2 + (i+1)/num_sliders*4
        target_coords.push([x,fun(x)])
    }
    var targets = []
    for (let i = 0; i < target_coords.length; i++){
        const coord = gridLeft.gridToCanvas(target_coords[i][0],target_coords[i][1])
        targets.push(new Target(coord.x, coord.y, 10))
    }
    const tracer_start = gridLeft.gridToCanvas(-2,fun(-2))
    const tracer = new ContinuousTracer(tracer_start.x,tracer_start.y,gridLeft,
        {type:"sliders",sliders:sliders,slider_spacing:slider_spacing},
        4,targets)
    const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "cubicMenu"),"↑")
    const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
    forward_button.active = false
    function update (){
        if(tracer.solved && !gameState.completedLevels[gameState.sceneName]){
            gameState.completedLevels[gameState.sceneName] = true
            gameState.writeToStorage = true
            
        }
        if (gameState.completedLevels[gameState.sceneName]){
            forward_button.active = true
        }
    }
    const objs = [gridLeft,gridRight,tracer, back_button, forward_button].concat(targets).concat(sliders)
    gameState.objects = objs
    gameState.update = update
}


function expDiscLevel(gameState, num_sliders, next){
    // To generalize

    const gridLeft = new Grid(300,250,400,400,4,4,5,4,2)
    const gridRight = new Grid(900,250,400,400,4,4,5,4,2)
    var sliders = []
    const slider_spacing = 400/num_sliders
    for (let i = 0; i < num_sliders; i++){
        sliders.push(new Slider(900+slider_spacing*i, 250, 400, 4, 0, 4, 0.01, false, vertical=true,circleRadius=10))
    }
    const target_coords = []
    for (let i = 0; i<num_sliders-1; i++){
        const x = -2 + (i+1)/num_sliders*4
        target_coords.push([x,0])
    }
    var targets = []
    for (let i = 0; i < target_coords.length; i++){
        const coord = gridLeft.gridToCanvas(target_coords[i][0],target_coords[i][1])
        targets.push(new Target(coord.x, coord.y, 10))
    }
    const tracer_start = gridLeft.gridToCanvas(-2,0.1)
    const tracer = new ContinuousTracer(tracer_start.x,tracer_start.y,gridLeft,
        {type:"sliders",sliders:sliders,slider_spacing:slider_spacing},
        4,targets)
    const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "expMenu"),"↑")
    const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
    forward_button.active = false
    function update (){
        for (let i = 0; i < num_sliders-1; i++){
            targets[i].y = gridLeft.gridToCanvas(0,sliders[i+1].value).y
        }

        if(tracer.solved && !gameState.completedLevels[gameState.sceneName]){
            gameState.completedLevels[gameState.sceneName] = true
            gameState.writeToStorage = true
            
        }
        if (gameState.completedLevels[gameState.sceneName]){
            forward_button.active = true
        }
    }

    const objs = [gridLeft,gridRight,tracer, back_button, forward_button].concat(targets).concat(sliders.slice(1))
    gameState.objects = objs
    gameState.update = update
}

// NOT USED DELETE
// function quadContLevel(gameState, target_coords, next){
//     // Right align 100px left of middle (800-100-400=300)
//     // Center vertically (450-400/2=250)
//     const y_adjust = 100
//     const x_adjust = 100
//     const gridLeft = new Grid(100+x_adjust,250+y_adjust,400,400,4,4,5,2,2)
//     // Left align 100px right of middle (800+100=900)
//     const gridRight = new Grid(600+x_adjust,250+y_adjust,400,400,4,4,5,2,2)
//     const block1 = new MathBlock(MathBlock.VARIABLE,"x",1300+x_adjust,250+y_adjust)
//     const ty_slider = new Slider(1100+x_adjust, 250+y_adjust, 400, 8, 0, 4, 0.1, true, true)
//     const sy_slider = new Slider(1200+x_adjust, 250+y_adjust, 400, 8, 1, 4, 0.1, true, true)
//     const funRight = new FunctionTracer(gridRight)
//     //const funLeft = new FunctionTracer(gridLeft, (x => x*x))
//     //funLeft.color = Color.red
//     const mngr = new MathBlockManager([block1],600+x_adjust,150+y_adjust, ty_slider, sy_slider, funRight)
//     targets = []
//     for (let i = 0; i < target_coords.length; i++){
//         const canvas_coords = gridLeft.gridToCanvas(target_coords[i][0],target_coords[i][1])
//         targets.push(new Target(canvas_coords.x, canvas_coords.y,10))
//     }
//     const tracer = new ContinuousTracer(100+x_adjust,250+y_adjust,gridLeft,{type:"mathBlock",mathBlockMngr:mngr},4,targets)
//     // Nav buttons
//     const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "quadMenu"),"↑")
//     const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
//     forward_button.active = false
    
//     function update (){
//         if(tracer.solved && !gameState.completedLevels[gameState.sceneName]){
//             //localStorage.setItem(gameState.sceneName, "solved");
//             gameState.completedLevels[gameState.sceneName] = true
//             gameState.writeToStorage = true
            
//         }
//         if (gameState.completedLevels[gameState.sceneName]){
//             forward_button.active = true
//         }
//     }
//     gameState.objects = [gridLeft,gridRight,sy_slider,ty_slider,mngr,funRight,tracer,forward_button,back_button].concat(targets)
//     gameState.update = update
// }

function cubicContLevel(gameState, fun, next){
    const blocks = [[MathBlock.VARIABLE,"x"],[MathBlock.POWER,"2"]]

    const target_coords = []
    const num_targets = 16
    for (let i = 0; i < num_targets; i++){
        const x = -2 + (i+1)/num_targets*4
        const y = fun(x)
        target_coords.push([x,y])
    }

    const y_adjust = 100
    const x_adjust = 100
    const gridLeft = new Grid(100+x_adjust,250+y_adjust,400,400,4,4,5,2,2)
    const gridRight = new Grid(600+x_adjust,250+y_adjust,400,400,4,4,5,2,2)
    const block1 = new MathBlock(MathBlock.VARIABLE,"x",1300+x_adjust,250+y_adjust)
    const block2 = new MathBlock(MathBlock.POWER,"2",1300+x_adjust,350+y_adjust)
    const ty_slider = new Slider(1100+x_adjust, 250+y_adjust, 400, 8, 0, 4, 0.1, true, true)
    const sy_slider = new Slider(1200+x_adjust, 250+y_adjust, 400, 8, 1, 4, 0.1, true, true)
    const funRight = new FunctionTracer(gridRight)
    //const funLeft = new FunctionTracer(gridLeft, (x => x*x))
    //funLeft.color = Color.red
    const mngr = new MathBlockManager([block1,block2],600+x_adjust,150+y_adjust, ty_slider, sy_slider, funRight)
    targets = []
    for (let i = 0; i < target_coords.length; i++){
        const canvas_coords = gridLeft.gridToCanvas(target_coords[i][0],target_coords[i][1])
        targets.push(new Target(canvas_coords.x, canvas_coords.y,10))
    }
    tracer_start = gridLeft.gridToCanvas(-2,fun(-2))
    const tracer = new ContinuousTracer(tracer_start.x,tracer_start.y,gridLeft,{type:"mathBlock",mathBlockMngr:mngr},4,targets)
    // Nav buttons
    const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "cubicMenu"),"↑")
    const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
    forward_button.active = false
    
    function update (){
        if(tracer.solved && !gameState.completedLevels[gameState.sceneName]){
            //localStorage.setItem(gameState.sceneName, "solved");
            gameState.completedLevels[gameState.sceneName] = true
            gameState.writeToStorage = true
            
        }
        if (gameState.completedLevels[gameState.sceneName]){
            forward_button.active = true
        }
    }
    gameState.objects = [gridLeft,gridRight,sy_slider,ty_slider,mngr,funRight,tracer,forward_button,back_button].concat(targets)
    gameState.update = update
}


function genContLevel(gameState, fun, blocks, next){

    const target_coords = []
    const num_targets = 16
    for (let i = 0; i < num_targets; i++){
        const x = -2 + (i+1)/num_targets*4
        const y = fun(x)
        target_coords.push([x,y])
    }

    const y_adjust = 100
    const x_adjust = 100
    const gridLeft = new Grid(100+x_adjust,250+y_adjust,400,400,4,4,5,2,2)
    const gridRight = new Grid(600+x_adjust,250+y_adjust,400,400,4,4,5,2,2)
    const ty_slider = new Slider(1100+x_adjust, 250+y_adjust, 400, 8, 0, 4, 0.1, true, true)
    const sy_slider = new Slider(1200+x_adjust, 250+y_adjust, 400, 8, 1, 4, 0.1, true, true)
    const funRight = new FunctionTracer(gridRight)
    //const funLeft = new FunctionTracer(gridLeft, (x => x*x))
    //funLeft.color = Color.red
    const math_blocks = []
    for (let i = 0; i < blocks.length; i++){
        math_blocks.push(new MathBlock(blocks[i][0],blocks[i][1],1300+x_adjust,250+y_adjust+100*i))
    }
    const mngr = new MathBlockManager(math_blocks,600+x_adjust,150+y_adjust, ty_slider, sy_slider, funRight)
    targets = []
    for (let i = 0; i < target_coords.length; i++){
        const canvas_coords = gridLeft.gridToCanvas(target_coords[i][0],target_coords[i][1])
        targets.push(new Target(canvas_coords.x, canvas_coords.y,10))
    }
    tracer_start = gridLeft.gridToCanvas(-2,fun(-2))
    const tracer = new ContinuousTracer(tracer_start.x,tracer_start.y,gridLeft,{type:"mathBlock",mathBlockMngr:mngr},4,targets)
    // Nav buttons
    const back_button = new NavButton(100,100,100,100, (()=> gameState.sceneName = "cubicMenu"),"↑")
    const forward_button = new NavButton(300,100,100,100, (()=> gameState.sceneName = next),"→")
    forward_button.active = false
    
    function update (){
        if(tracer.solved && !gameState.completedLevels[gameState.sceneName]){
            //localStorage.setItem(gameState.sceneName, "solved");
            gameState.completedLevels[gameState.sceneName] = true
            gameState.writeToStorage = true
            
        }
        if (gameState.completedLevels[gameState.sceneName]){
            forward_button.active = true
        }
    }
    gameState.objects = [gridLeft,gridRight,sy_slider,ty_slider,mngr,funRight,tracer,forward_button,back_button].concat(targets)
    gameState.update = update
}




/**
 * 
 * The main function for serving up scenes.
 */

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
            subMenu(gameState,"2","quad")
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
            quadDiscLevel(gameState,4,"quad4")
            break
        }

        case "quad2":{
            quadDiscLevel(gameState,8,"quad4")
            break
        }

        case "quad3":{
            quadDiscLevel(gameState,16,"quad4")
            break
        }

        case "quad4":{
            const fun = x => x*x/2
            const blocks = [[MathBlock.VARIABLE,"x"]]
            genContLevel(gameState, fun, blocks, "quad5")
            break
        }

        case "quad5":{
            const fun = x => x*x/4
            const blocks = [[MathBlock.VARIABLE,"x"]]
            genContLevel(gameState, fun, blocks, "quad6")
            break
        }

        case "quad6":{
            const fun = x => x*x
            const blocks = [[MathBlock.VARIABLE,"x"]]
            genContLevel(gameState, fun, blocks, "quad7")
            break
        }

        case "quad7":{
            const fun = x => x*x/4
            const blocks = [[MathBlock.VARIABLE,"x"]]
            genContLevel(gameState, fun, blocks, "quad8")
            break
        }

        case "quad8":{
            const fun = x => x*x/4
            const blocks = [[MathBlock.VARIABLE,"x"]]
            genContLevel(gameState, fun, blocks, "cubicMenu")
            break
        }

        case "cubicMenu":{
            subMenu(gameState,"3","cubic")
            break
        }

        case "cubic1":{
            cubicDiscLevel(gameState, 4, "cubic2")
            break
        }

        case "cubic2":{
            cubicDiscLevel(gameState, 8, "cubic3")
            break
        }

        case "cubic3":{
            cubicDiscLevel(gameState, 16, "cubic4")
            break
        }

        case "cubic4":{
            const fun = x => x*x*x/6
            cubicContLevel(gameState, fun, "cubic5")
            break
        }

        case "cubic5":{
            const fun = x => x*x*x/10
            cubicContLevel(gameState, fun, "cubic6")
            break
        }

        case "expMenu":{
            subMenu(gameState,"4","exp")
            break
        }

        case "exp1":{
            expDiscLevel(gameState, 4, "exp2")
            break
        }

        case "exp2":{
            expDiscLevel(gameState, 8, "exp3")
            break
        }

        case "exp3":{
            expDiscLevel(gameState, 16, "exp4")
            break
        }

        case "exp5":{
            const fun = x => Math.E ** x
            const blocks = [[MathBlock.VARIABLE,"x"],[MathBlock.POWER,"2"],[MathBlock.EXPONENT,"e"],[MathBlock.FUNCTION,"sin"]]
            genContLevel(gameState, fun, blocks, "exp6")
            break
        }
        
        
    }
}


