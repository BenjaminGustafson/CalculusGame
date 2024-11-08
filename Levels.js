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


function playLevel(levelID){
    switch (levelID){
        case "intro1":{
            const gridLeft = new Grid(500,200,200,400,1,2,5)
            const gridRight = new Grid(900,200,200,400,1,2,5)
            return {objs:[gridLeft,gridRight], winCon: ()=>false} 
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
            function winCon (){
                return tracer.solved
            }
            return {objs:[gridLeft,gridRight,slider1,slider2,slider3,slider4,tracer,target1,target2,target3,target4], winCon:winCon} 
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
            const funLeft = new FunctionTracer(gridLeft, (x => x*x))
            funLeft.color = Color.red
            const mngr = new MathBlockManager([block1,block2],600,150, ty_slider, sy_slider, funRight)
            return {objs:[gridLeft,gridRight,sy_slider,ty_slider,mngr,funLeft,funRight], winCon: ()=>false}
        }
    }
}

