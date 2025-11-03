
import { GameObjectGroup } from "../GameObjects/GameObject.js"
import {Grid, MathBlock, MathBlockField, MathBlockManager, Slider, Target, TargetAdder, FunctionTracer, IntegralTracer, 
    DrawFunction
} from "../GameObjects/index.js"
import * as Planet from "./Planet.js"
import {Color, Shapes} from '../util/index.js'



/**
 * Shared functions for building levels.
 */
export function targetsFromYs(gameState, {targetYs, grid, targetOpts}){
    const numTargets = targetYs.length
    const spacing = grid.gridWidth / numTargets
    var targets = []
    for (let i = 0; i < numTargets; i++) {
        const x = grid.gridXMin+(i+1)*spacing
        targets.push(new Target({grid: grid, gridX:x, gridY:targetYs[i], ...targetOpts}))
    }
    const targetGroup = new GameObjectGroup(targets)
    targetGroup.insert(gameState.objects, 2)
    return targetGroup
}

export function buildTargetsFromYs({targetYs, targetOpts}){
    return (gameState, grid) => targetsFromYs(gameState, {targetYs: targetYs, grid:grid, targetOpts: targetOpts})
}


export function targetsFromFun(gameState, {fun, grid, numTargets, targetSize}){
    var targets = []
    for (let i = 0; i < numTargets; i++) {
        const x = grid.gridXMin+(i+1)*(grid.gridWidth/numTargets)
        const y = fun(x)
        if (grid.isInBoundsGridY(y))
            targets.push(new Target({grid: grid, gridX:x, gridY:y, size:targetSize}))
    }
    const targetGroup = new GameObjectGroup(targets)
    targetGroup.insert(gameState.objects, 2)
    return targetGroup
}

export function targetsFromDdx(gameState, {ddx, grid, numTargets, targetSize, startY=0}){
    var targets = []
    var y = startY
    const spacing = grid.gridWidth/numTargets
    for (let i = 0; i < numTargets; i++) {
        const x = grid.gridXMin+(i+1)*spacing
        y += ddx(x-spacing)*spacing
        console.log(x,y)
        if (grid.isInBoundsGridY(y))
            targets.push(new Target({grid: grid, gridX:x, gridY:y, size:targetSize}))
    }
    const targetGroup = new GameObjectGroup(targets)
    targetGroup.insert(gameState.objects, 2)
    return targetGroup
}

export function sliderSetup(gameState, {numSliders, grid, sliderOpts}){
    var sliders = []
    const spacing = grid.gridWidth/numSliders
    for (let i = 0; i < numSliders; i++){
        sliders.push(new Slider({grid:grid,
            gridPos:grid.gridXMin + i * spacing,
            increment: 0.1,
            ...sliderOpts}))
    }
    const sliderGroup = new GameObjectGroup(sliders)
    sliderGroup.insert(gameState.objects, 2)
    return sliderGroup
}

function addToUpdate(gameState, funToAdd){
    const oldUpdate = gameState.update
    gameState.update = () => {
        oldUpdate()
        funToAdd()
    }
}

export function sliderLinesSetup(gameState, {sliders, grid, lineWidth=5}){
    var sliderLines = []
    const spacing = grid.canvasWidth/sliders.length
    for (let i = 0; i < sliders.length; i++){
        const slider = sliders[i]
        const line = {
            canvasY: slider.circlePos,
            update: function (ctx){
                this.canvasY = slider.circlePos
                Color.setColor(ctx, slider.circleColor)
                Shapes.Line(ctx, slider.canvasX, this.canvasY, slider.canvasX+spacing, this.canvasY, lineWidth, 'rounded')
            }
        }
        sliderLines.push(line)
    }
    const lineGroup = new GameObjectGroup(sliderLines)
    lineGroup.insert(gameState.objects, 1)
    return lineGroup
}

export function gridSetup({numGrids, gridParams, leftMargin=0, rightMargin=0, topMargin=150, bottomMargin=0,
    gridWidth=400, gridSpacing=50}){
    var grids = []
    const totalWidth = numGrids * gridWidth + (numGrids-1)*gridSpacing
    const startX = (1600-rightMargin-leftMargin)/2 - totalWidth/2
    for (let i = 0; i < numGrids; i++){
        grids.push(new Grid({
            canvasX: startX + i *(gridWidth+gridSpacing),
            canvasY:topMargin,
            canvasWidth:gridWidth, canvasHeight:gridHeight, 
            ...gridParams[i]}))

    }
    return grids
}



function mathBlockSliderLevel(gameState, {

}){

}

export function twoGridSetup(gameState, {
    gridXMin, gridYMin, gridXMax, gridYMax,
}={}){
    const gridLeft = new Grid({canvasX: 300, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})
    gridLeft.insert(gameState.objects)
    const gridRight = new Grid({canvasX: 900, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})
    gridRight.insert(gameState.objects)
    return {left:gridLeft, right:gridRight}
}


export function levelNavigation(gameState, {
    winCon,
    nextScenes,
}){
    const backButton = Planet.backButton(gameState)
    backButton.insert(gameState.objects, 0)
    const nextButton = Planet.nextButton(gameState, nextScenes)
    nextButton.insert(gameState.objects, 0)

    Planet.winCon(gameState, winCon, nextButton)
    Planet.unlockScenes(nextScenes, gameState.stored)
}

export function sliderFunLevel(gameState, {
    numSliders,
    targetFun,
    tracerOpts,
    sliderOpts,
    targetOpts,
    nextScenes,
}){
    const grids = twoGridSetup(gameState)
    const tracer = new IntegralTracer({
        grid: grids.left,
        input: {type:'sliders', 
            sliders: sliderSetup(gameState, {
                numSliders:numSliders,
                grid:grids.right,
                sliderOpts:sliderOpts}).objects
        },
        targets: targetsFromFun(gameState, {
            fun: targetFun,
            grid:grids.left,
            numTargets: numSliders,
            targetOpts:targetOpts,
        }).objects,
        tracerOpts:tracerOpts,
    })
    tracer.insert(gameState.objects,1)
    levelNavigation(gameState, {
        winCon: tracer.solved,
        nextScenes: nextScenes,
    })
}


/**
 * 
 * We want to allow defining targets in multiple ways, like with the functions
 * targetsFromFun, targetsFromDdx, and targetsFromYs. So we take in a function 
 * that builds the targets given a grid.
 * 
 */
export function sliderLevel(gameState, {
    numSliders,
    targetBuilder,
    tracerOpts,
    sliderOpts,
    nextScenes,
}){
    const grids = twoGridSetup(gameState)
    const sliders = sliderSetup(gameState, {
        numSliders:numSliders,
        grid:grids.right,
        sliderOpts:sliderOpts}).objects
    sliderLinesSetup(gameState, {sliders: sliders, grid:grids.right})
    const tracer = new IntegralTracer({
        grid: grids.left,
        input: {type:'sliders',
            sliders: sliders
        },
        targets: targetBuilder(gameState, grids.left).objects,
        ...tracerOpts,
    })
    tracer.insert(gameState.objects,1)
    levelNavigation(gameState, {
        winCon: () => tracer.solved,
        nextScenes: nextScenes,
    })
}

export function mathBlockLevel(gameState, {
    targetFun,
    tracerStart,
    sliderSize,
    targetSize,
    nextScenes,
}){
    const grids = twoGridSetup(gameState)
    grids.left.canvasX -= 200
    grids.right.canvasX -= 200
    const sySlider = new Slider({canvasX: 1200, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
    sySlider.insert(gameState.objects, 0)
    const tySlider = new Slider({canvasX: 1300, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})
    tySlider.insert(gameState.objects, 0)
    const mbField = new MathBlockField({minX:700, minY:100, maxX:1100, maxY:300})
    const funTracer = new FunctionTracer({grid:grids.right})
    funTracer.insert(gameState.objects, 1)
    const mbm = new MathBlockManager({blocks : blocks,
        toolBarX: 1400, toolBarY:150,
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
        funTracers: [ funTracer ],
    })
    mbm.insert(gameState.objects, 10)
    const tracer = new IntegralTracer({
        grid: grids.left,
        originGridY:tracerStart,
        input:{type:'mathBlock', 
            blockField:mbField,
            },
        targets: targetsFromFun(gameState, {
            fun: targetFun,
            grid:grids.left,
            numTargets: numSliders,
            targetSize:targetSize,
        }).objects,
    })
    tracer.insert(gameState.objects,1)
    levelNavigation(gameState, {
        winCon: tracer.solved,
        nextScenes: nextScenes,
    })
    
}

export function drawLevel(gameState, {
    targetFun,
    numTargets,
    tracerStart,
    targetSize,
    nextScenes,
}){
    const grids = twoGridSetup(gameState)
    const drawer = new DrawFunction ({grid: grids.right})
    drawer.insert(gameState.objects, 1)
    const tracer = new IntegralTracer({
        grid: grids.left,
        originGridY:tracerStart,
        input:{type:'drawFunction', 
            drawFunction: drawer},
        targets: targetsFromFun(gameState, {
            fun: targetFun,
            grid: grids.left,
            numTargets: numTargets,
            targetSize:targetSize,
        }).objects,
    })
    tracer.insert(gameState.objects,1)
    levelNavigation(gameState, {
        winCon: tracer.solved,
        nextScenes: nextScenes,
    })
}



   export function drawFunctionLevel (gameState, {
        tracerStart=1,
        targetSize = 30, sliderSize = 15,
        nextScenes = [],
        gridSize = 2,
        targetYs = [],
    }){
        const gss = gameState.stored
        const backButton = Planet.backButton(gameState)
        const nextButton = Planet.nextButton(gameState, nextScenes)
    
        console.log('DRAW FUNCTION LEVEL')
    
        const gridLeft = new Grid({canvasX: 300, canvasY:350, canvasWidth:400, canvasHeight:400, 
            gridXMin:-gridSize, gridYMin:-gridSize, gridXMax:gridSize, gridYMax:gridSize, labels:false, arrows:true})
        const gridRight = new Grid({canvasX: 900, canvasY:350, canvasWidth:400, canvasHeight:400, 
            gridXMin:-gridSize, gridYMin:-gridSize, gridXMax:gridSize, gridYMax:gridSize, labels:false, arrows:true})
        
        const drawFunction = new DrawFunction ({grid: gridRight})
    
    
        const numTargets = targetYs.length
        const spacing = gridLeft.gridWidth / numTargets
        var targets = []
        for (let i = 0; i < numTargets; i++) {
            const x = gridLeft.gridXMin+(i+1)*spacing
            targets.push(new Target({grid: gridLeft, gridX:x, gridY:targetYs[i], size:targetSize}))
        }
        
        
        const tracer = new IntegralTracer({grid: gridLeft, input:{type:'drawFunction', drawFunction:drawFunction}, targets:targets,
        })
        
    
        gameState.objects = [gridLeft, gridRight, backButton, nextButton, drawFunction, tracer].concat(targets)    
    
        Planet.winCon(gameState, ()=>tracer.solved, nextButton)
        Planet.unlockScenes(nextScenes, gss)
    }
    


export function mathBlockTutorial(gameState, {
    targetSize = 20,
    numTargets,
    targetFun,
    blocks,
    nextScenes,
    gridXMin=-2, gridYMin=-2, gridXMax=2, gridYMax=2,
}) {
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const grid = new Grid({canvasX:600, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:false, arrows:true})

    const spacing = grid.gridWidth/numTargets

    var targets = []
    for (let i = 0; i < numTargets; i++) {
        const x = grid.gridXMin+(i+1)*spacing
        if (targetFun(x) <= gridYMax && targetFun(x) >= gridYMin)
            targets.push(new Target({grid: grid, gridX:x, gridY:targetFun(x), size:targetSize}))
    }
     
    const functionTracer = new FunctionTracer({grid: grid, targets: targets, solvable:true})

    
    const sySlider = new Slider({canvasX: 1200, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
    const tySlider = new Slider({canvasX: 1300, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})

    const mbField = new MathBlockField({minX:600, minY:100, maxX:1000, maxY:300})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:100, outputType:"sliders",
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
        funTracers: [functionTracer],
    })

    gameState.update = ()=>{

    }

    gameState.objects = [grid, functionTracer, backButton, nextButton, mbm, sySlider, tySlider].concat(targets)
    Planet.winCon(gameState, ()=>functionTracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}
