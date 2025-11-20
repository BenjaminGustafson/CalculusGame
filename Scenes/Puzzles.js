
import { GameObjectGroup } from "../GameObjects/GameObject.js"
import {Grid, MathBlock, MathBlockField, MathBlockManager, Slider, Target, TargetAdder, FunctionTracer, IntegralTracer, 
    DrawFunction, TextBox, Button
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

/**
 * 
 * Given the desired derivative for the solution, create a slider level 
 * 
 */
export function sliderLevelFromDdx(gameState, {
    ddx,
    numSliders,
    tracerStart,
}){
    sliderLevel(gameState, {
        numSliders:numSliders,
        targetBuilder: buildTargetsFromDdx({
            ddx:ddx,
            numTargets: numSliders,
            startY:tracerStart,
            targetOpts:{size:20}
        }),
        tracerOpts: {originGridY:tracerStart},
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

/**
 * 
 * This should somehow use slider level and mathblock level...
 */
export function mathBlockSliderLevel(gameState, {
    numSliders, 
    targetBuilder,
    tracerOpts,
    mbSliderOpts,
    sliderOpts,
    nextScenes,
}){
    const grids = twoGridSetup(gameState)
    grids.left.canvasX -= 200
    grids.right.canvasX -= 200

    const sySlider = new Slider({canvasX: 1200, canvasY: 350, ...mbSliderOpts})
    sySlider.insert(gameState.objects, 0)
    const tySlider = new Slider({canvasX: 1300, canvasY: 350, ...mbSliderOpts})
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

    gameState.update = ()=>{
        if (mbField.rootBlock != null){
            const fun = mbField.rootBlock.toFunction()
            if (fun != null){
                for (let i = 0; i < numSliders; i++){
                    sliders[i].moveToValue(fun(sliders[i].gridPos))
                }
            }
        }
    }

    Planet.levelNavigation(gameState, {
        winCon: () => tracer.solved,
        nextScenes: nextScenes,
    })
}

function mathBlockSetup (gameState, {
    sliderOpts,
    blocks,
    grid,
}){
    const {sySlider, tySlider} = mathBlockSlidersSetup(gameState, {sliderOpts:sliderOpts})
    const mbField = new MathBlockField({minX:700, minY:100, maxX:1100, maxY:300})

    const funTracer = new FunctionTracer({grid:grid})
    funTracer.insert(gameState.objects, 1)
    
    const mbm = new MathBlockManager({blocks : blocks,
        toolBarX: 1400, toolBarY:150,
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
        funTracers: [ funTracer ],
    })
    mbm.insert(gameState.objects, 10)

    return {mbField:mbField, funTracer:funTracer}
}

/**
 * Creates the two sliders needed for mathblocks
 */
function mathBlockSlidersSetup(gameState, {
    sliderOpts,
}){
    const sySlider = new Slider({canvasX: 1200, canvasY: 350, maxValue:2,
        sliderLength:4, startValue: 1, ...sliderOpts})
    sySlider.insert(gameState.objects, 0)
    const tySlider = new Slider({canvasX: 1300, canvasY: 350, maxValue:2,
        sliderLength:4, ...sliderOpts})
    tySlider.insert(gameState.objects, 0)
    return {sySlider:sySlider, tySlider:tySlider}
}

/**
 * Two graphs, set the derivative with mathblocks
 * to hit targets
 */
export function mathBlockLevel(gameState, {
    targetBuilder,
    tracerOpts,
    nextScenes,
    blocks,
    gridOpts,
    sliderOpts = {maxValue:2, sliderLength:4, startValue: 1},
}){
    const grids = twoGridSetup(gameState, {gridOpts: gridOpts})
    grids.left.canvasX -= 200
    grids.right.canvasX -= 200

    const {sySlider, tySlider, mbField, funTracer} = mathBlockSetup(gameState, {
        sliderOpts:sliderOpts, blocks:blocks, grid:grids.right,
    })
    
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

/**
 * 
 * Standard level with a drawfunction
 */
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



export function ruleGuess(gameState, {planetUnlock, blocks, targetBlock, correctDdx, initA=1, initB=0}){
    const gss = gameState.stored
    var state = 'no attempt' // 'incorrect' 'correct' 'solved'
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, ['planetMap'])
    
    const gridLeft = new Grid({canvasX:80, canvasY:450, canvasWidth:350, canvasHeight:350, 
        gridXMin:-10, gridXMax:10, gridYMin:-10, gridYMax:10, labels:true, xAxisLabel:'x', yAxisLabel:'f(x)', autoCellSize:true})

    const gridRight = new Grid({canvasX: 700, canvasY:450, canvasWidth:350, canvasHeight:350, 
        gridXMin:-10, gridXMax:10, gridYMin:-10, gridYMax:10, labels:true, xAxisLabel:'x', yAxisLabel: 'f\'(x)', autoCellSize:true})

    const aSlider = new Slider({canvasX: 100, canvasY: 320, canvasLength:350, maxValue:5, sliderLength:10, startValue: initA, showAxis:true, vertical:false})
    const aLabel = new TextBox({content: 'a',originX: 80, originY: 320, font:'25px monospace', align:'right', baseline:'middle'})
    const bSlider = new Slider({canvasX: 100, canvasY: 380, canvasLength:350, maxValue:5, sliderLength:10, startValue: initB, showAxis:true, vertical:false})
    const bLabel = new TextBox({content: 'b',originX: 80, originY: 380, font:'25px monospace', align:'right', baseline:'middle'})

    const funTracer = new FunctionTracer({grid:gridLeft, unsolvedColor:Color.magenta})

    const ddxTracer = new FunctionTracer({grid:gridRight})
    
    const sySlider = new Slider({canvasX: 1250, canvasY: 150, maxValue:5, sliderLength:10, startValue: 1, showAxis:true})
    const tySlider = new Slider({canvasX: 1320, canvasY: 150, maxValue:5, sliderLength:10, showAxis:true})
    const mbField = new MathBlockField({minX:700, minY:200, maxX:1100, maxY:300})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:150, outputType:"none",
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
    })
    const intTracer = new IntegralTracer({grid:gridLeft, input:{
        inputFunction: (x) => {
            if (mbField.rootBlock){
                const fun = mbField.rootBlock.toFunction({a:aSlider.value, b:bSlider.value})
                if (fun != null){
                    return fun(x)
                }
            }
                return 0
        },
        resetCondition : () => {
                    return mbField.newFunction || aSlider.valueChanging || bSlider.valueChanging
                },
        },
        animated:true,
        autoStart:true,
    })

    const checkResult = new TextBox({originX: 700, originY: 160, font:'25px monospace', align:'left', baseline:'top'})
    const checkButton = new Button({originX: 700, originY:50, width: 200, height: 100, label:"Check",
        onclick: () => {
            if (mbField.rootBlock == null || mbField.rootBlock.toFunction() == null){
                checkResult.content = 'No function set'
                return
            } 
                
            // What is an appropriate number of checks here? Somewhere from 100 to 10000
            var correct = true
            outerLoop: for(let a = -10; a <= 10; a += 5){
            for (let b = -10; b <= 10; b += 5){
                const fun = mbField.rootBlock.toFunction({'a':a, 'b':b})
            for (let x = -10; x <= 10; x++){
                const y1 = fun(x)
                const y2 = correctDdx(x,a,b)
                if (Math.abs(y1 - y2) > 0.00001){
                    correct = false
                    //break outerLoop
                }
            }
            }
            }
            if (correct){
                checkResult.content = 'Correct!'
                state = 'correct'
                gss.completedScenes[gss.sceneName] = 'complete'
                if (gss.planetProgress[planetUnlock] == null || gss.planetProgress[planetUnlock] == 'locked')
                    gss.planetProgress[[planetUnlock]] = 'unvisited'

                // Unlock TODO: have a popup the first time this happens
                if (gss.navPuzzleMastery[gss.planet] == null){
                    gss.navPuzzleMastery[gss.planet] = 0
                }
            }else{
                state = 'incorrect'
                checkResult.content = 'Incorrect'
            }
        }
     })

    gameState.objects = [
        new TextBox({originX: 50, originY:200, baseline:'top', content:'f(x) =', font:'40px monospace'}),
        new TextBox({originX: 500, originY:200, baseline:'top', content:'f\'(x) =', font:'40px monospace'}),
        nextButton,backButton,
        sySlider, tySlider, mbm, targetBlock,
        checkButton, checkResult,
        gridLeft, gridRight,
        aLabel, bLabel, aSlider, bSlider,
        funTracer, ddxTracer, intTracer,
    ]

    gameState.update = () => {
        if (state == 'correct'){
            Planet.unlockPopup(gameState, {itemImage:'shipSide', topText:`You solved the ${capFirst(gss.planet)} Rule!`, bottomText:`You can now travel to ${capFirst(planetUnlock)} Planet.`})
            state = 'solved'
        }
        const targetFun = targetBlock.toFunction({a:aSlider.value, b:bSlider.value})
        funTracer.setInputFunction(targetFun)
        intTracer.originGridY = targetFun(-10)
        ddxTracer.setInputFunction(mbField.outputFunction({a:aSlider.value, b:bSlider.value}))
        //aLabel.content = 'a='+aSlider.value.toFixed(1)
    }

    Planet.addWinCon(gameState, ()=>state == 'solved', nextButton)
}

function capFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}
