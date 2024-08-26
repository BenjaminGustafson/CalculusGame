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
        case "intro3":{
            // Right align 100px left of middle (800-100-400=300)
            // Center vertically (450-400/2=250)
            const gridLeft = new Grid(300,250,400,400,4,4,5)
            // Left align 100px right of middle (800+100=900)
            const gridRight = new Grid(900,250,400,400,4,4,5)
            // On first four cols of gridRight
            // x = 900, 950, 1000, 1050. top_y = 250.  
            const slider1 = new Slider(900, 250, 400, 4, 0, 2)
            const slider2 = new Slider(1000, 250, 400, 100, 0, 50)
            const slider3 = new Slider(1100, 250, 400, 100, 0, 50)
            const slider4 = new Slider(1200, 250, 400, 100, 0, 50)
            const tracer = new Tracer(300,450,100,[slider1,slider2,slider3,slider4],60)
            return {objs:[gridLeft,gridRight,slider1,slider2,slider3,slider4,tracer], winCon: ()=>false} 
        }
        case "demoCont":{
            // Right align 100px left of middle (800-100-400=300)
            // Center vertically (450-400/2=250)
            const gridLeft = new Grid(100,250,400,400,4,4,5)
            // Left align 100px right of middle (800+100=900)
            const gridRight = new Grid(700,250,400,400,4,4,5)
            const block1 = new MathBlock(MathBlock.VARIABLE,"x",1200,400)
            const block2 = new MathBlock(1,"f",1300,400)
            const block3 = new MathBlock(2,"+",1200,500)
            const slider1 = new Slider(1300, 250, 400, 8, 0, 4, 0.1, true, true)
            const slider2 = new Slider(400, 800, 400, 8, 0, 4, 0.1, true, false)
            block2.setChild(0,block1)
            block1.setupChildren()
            block2.setupChildren()
            block3.setupChildren()
            return {objs:[gridLeft,gridRight,block1,slider1,slider2], winCon: ()=>false} 
        }
    }
}

