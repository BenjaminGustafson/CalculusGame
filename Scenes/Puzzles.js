
import { GameObjectGroup } from "../GameObjects/GameObject.js"
import {Grid, MathBlock, MathBlockField, MathBlockManager, Slider, Target, TargetAdder, FunctionTracer, IntegralTracer, 
    DrawFunction
} from "../GameObjects/index.js"
import * as Planet from "./Planet.js"
import {Color, Shapes} from '../util/index.js'


/**
 * Shared functions for building levels.
 */


/**
 * Given an array of y values, create a GameObject group of targets
 * Also takes a grid to put the targets on
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

/**
 * Builder version of targetsFromYs
 * Allows target creation to be specified without grid
 */
export function buildTargetsFromYs({targetYs, targetOpts}){
    return (gameState, grid) => targetsFromYs(gameState, {targetYs: targetYs, grid:grid, targetOpts: targetOpts})
}

/**
 * Given a function, create a GameObject group of targets 
 * whose value is the function value 
 */
export function targetsFromFun(gameState, {fun, grid, numTargets, targetOpts}){
    var targets = []
    for (let i = 0; i < numTargets; i++) {
        const x = grid.gridXMin+(i+1)*(grid.gridWidth/numTargets)
        const y = fun(x)
        if (grid.isInBoundsGridY(y))
            targets.push(new Target({grid: grid, gridX:x, gridY:y, ...targetOpts}))
    }
    const targetGroup = new GameObjectGroup(targets)
    targetGroup.insert(gameState.objects, 2)
    return targetGroup
}

/**
 * Builder version of targetsFromFun
 */
export function buildTargetsFromFun({fun, numTargets, targetOpts}){
    return (gameState, grid) => targetsFromFun(gameState, {fun: fun, grid:grid, numTargets:numTargets, targetOpts: targetOpts})
}

/**
 * Given a derivative function, create a GameObject group of targets
 * so that slider values matching the derivative function hit the targets
 */
export function targetsFromDdx(gameState, {ddx, grid, numTargets, targetOpts, startY=0}){
    var targets = []
    var y = startY
    const spacing = grid.gridWidth/numTargets
    for (let i = 0; i < numTargets; i++) {
        const x = grid.gridXMin+(i+1)*spacing
        y += ddx(x-spacing)*spacing
        if (grid.isInBoundsGridY(y))
            targets.push(new Target({grid: grid, gridX:x, gridY:y, ...targetOpts}))
    }
    const targetGroup = new GameObjectGroup(targets)
    targetGroup.insert(gameState.objects, 2)
    return targetGroup
}

/**
 * Builder version of targetsFromDdx
 */
export function buildTargetsFromDdx({ddx, numTargets, targetOpts, startY}){
    return (gameState, grid) => targetsFromDdx(gameState, {ddx: ddx, grid:grid, numTargets:numTargets, targetOpts: targetOpts, startY:startY})
}

/**
 * Evenly spaces sliders on a grid
 */
export function sliderSetup(gameState, {
    numSliders, // number of sliders
    grid, // the grid to put the sliders on
    sliderOpts, // parameters to be passed to slider constructor
}){
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

/**
 * Put constant lines after sliders
 */
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

/**
 * 
 */
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
    gridOpts,
}={}){
    const gridLeft = new Grid({canvasX: 300, canvasY:350, ...gridOpts})
    gridLeft.insert(gameState.objects)
    const gridRight = new Grid({canvasX: 900, canvasY:350, ...gridOpts})
    gridRight.insert(gameState.objects)
    return {left:gridLeft, right:gridRight}
}

export function threeGridSetup(gameState, {
    gridOpts,
}={}){
    const gridLeft = new Grid({canvasX: 300, canvasY:350, ...gridOpts})
    gridLeft.insert(gameState.objects)
    const gridRight = new Grid({canvasX: 900, canvasY:350, ...gridOpts})
    gridRight.insert(gameState.objects)
    const gridMiddle = new Grid({canvasX: 900, canvasY:350, ...gridOpts})
    gridMiddle.insert(gameState.objects)
    return {left:gridLeft, right:gridRight, middle:gridMiddle}
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
    Planet.levelNavigation(gameState, {
        winCon: () => tracer.solved,
        nextScenes: nextScenes,
    })
}

export function tripleGraphSliderLevel(gameState, {
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
    Planet.levelNavigation(gameState, {
        winCon: () => tracer.solved,
        nextScenes: nextScenes,
    })
}



export function mathBlockLevel(gameState, {
    targetBuilder,
    tracerOpts,
    nextScenes,
    blocks,
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
    
    const targets = targetBuilder(gameState, grids.left).objects
    const tracer = new IntegralTracer({
        grid: grids.left,
        input:{type:'mathBlock', 
            blockField:mbField,
            },
        targets: targets,
        ...tracerOpts,
    })
    tracer.insert(gameState.objects,1)

    Planet.levelNavigation(gameState, {
        winCon: () => tracer.solved,
        nextScenes: nextScenes,
    })
}

export function drawFunctionLevel(gameState, {
    targetBuilder,
    tracerStart,
    gridOpts,
    nextScenes,
}){
    const grids = twoGridSetup(gameState, {gridOpts:gridOpts})
    const drawer = new DrawFunction ({grid: grids.right})
    drawer.insert(gameState.objects, 1)

    const targets = targetBuilder(gameState, grids.left)

    const tracer = new IntegralTracer({
        grid: grids.left,
        originGridY:tracerStart,
        input:{type:'drawFunction',
            drawFunction: drawer},
        targets: targets.objects,
    })
    tracer.insert(gameState.objects,1)

    Planet.levelNavigation(gameState, {
        winCon: () => tracer.solved,
        nextScenes: nextScenes,
    })
}
  


export function mathBlockTutorial(gameState, {
    numTargets,
    targetOpts,
    targetFun,
    blocks,
    nextScenes,
    gridXMin=-2, gridYMin=-2, gridXMax=2, gridYMax=2,
}) {
    
    const grid = new Grid({canvasX:600, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:false, arrows:true})
    grid.insert(gameState.objects,0)

    const spacing = grid.gridWidth/numTargets
    
    const targets = targetsFromFun(gameState, {fun: targetFun, grid:grid, numTargets:numTargets, targetOpts:targetOpts})

    const functionTracer = new FunctionTracer({grid: grid, targets: targets.objects, solvable:true})
    functionTracer.insert(gameState.objects, 1)

    const sySlider = new Slider({canvasX: 1200, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
    const tySlider = new Slider({canvasX: 1300, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})

    const mbField = new MathBlockField({minX:600, minY:100, maxX:1000, maxY:300})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:100, outputType:"sliders",
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
        funTracers: [functionTracer],
    })
    const mathBlockObjs = new GameObjectGroup([sySlider,tySlider,mbField])
    mathBlockObjs.insert(gameState.objects, 0)
    mbm.insert(gameState.objects, 1)

    Planet.levelNavigation(gameState, {
        winCon: () => functionTracer.solved,
        nextScenes: nextScenes,
    })
}
