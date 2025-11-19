import {Color, Shapes} from '../util/index.js'
import {TileMap, Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import * as Planet from './Planet.js'
import * as Experiment from './Experiment.js'
import { measurementPuzzle } from './Linear.js'
import { drawFunctionLevel } from './Puzzles.js'

/**
 * 
 * Dialogue
 * 
 * That curve shape is called a quadratic.
 * 'Quad' means square. Like x^2.
 * Like if I have a square whose sides are x units,
 * 
 * 
 */



const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// SW 0,1 NW -1,0 NE 0,-1 SE 1,0
const nodes = {
    'planetMap':        [5,1, 0,-1],
    'quadratic.puzzle.1': [6,1, 0,-1],
    'quadratic.puzzle.2': [7,1, 0,-1],
    'quadratic.puzzle.3': [8,1, 0,-1],
    'quadratic.puzzle.4': [9,1, 0,-1],
    'quadratic.puzzle.5': [10,1, 0,-1],
    'quadratic.puzzle.6': [11,1, 0,-1],
    'quadratic.puzzle.7': [12,1, 0,-1],
    'quadratic.puzzle.8': [13,1, 0,-1],
    'quadratic.puzzle.9': [14,1, 0,-1],
    'quadratic.puzzle.10':[15,1, 0,-1],
    'quadratic.puzzle.11': [15, 3, 0,-1],
    'quadratic.puzzle.12': [14, 3, 0,-1],
    'quadratic.puzzle.13': [13, 3, 0,-1],
    'quadratic.puzzle.14': [12, 3, 0,-1],
    'quadratic.puzzle.15': [11,3, 0,-1],
    'quadratic.puzzle.16': [10,3, 0,-1],
    'quadratic.puzzle.17': [9,3, 0,-1],
    'quadratic.puzzle.18': [8,3, 0,-1],
    'quadratic.puzzle.19': [7,3, 0,-1],
    'quadratic.puzzle.20': [6,3, 0,-1],
}

const paths = 
[
    {start: 'planetMap', end: 'quadratic.puzzle.1'},
    {start: 'quadratic.puzzle.1', end: 'quadratic.puzzle.2', steps: [] },
    {start: 'quadratic.puzzle.2', end: 'quadratic.puzzle.3', steps: [] },
    {start: 'quadratic.puzzle.3', end: 'quadratic.puzzle.4', steps: [] },
    {start: 'quadratic.puzzle.4', end:  'quadratic.puzzle.5', steps: [] },
    {start: 'quadratic.puzzle.5', end: 'quadratic.puzzle.6', steps: [] },
    {start: 'quadratic.puzzle.6', end: 'quadratic.puzzle.7', steps: [] },
    {start: 'quadratic.puzzle.7', end: 'quadratic.puzzle.8', steps: [] },
    {start: 'quadratic.puzzle.8', end: 'quadratic.puzzle.9', steps: [] },
    {start: 'quadratic.puzzle.9', end: 'quadratic.puzzle.10', steps: [] },
    {start: 'quadratic.puzzle.10', end: 'quadratic.puzzle.11', steps: []},
    {start: 'quadratic.puzzle.11', end: 'quadratic.puzzle.12', steps: [] },
    {start: 'quadratic.puzzle.12', end: 'quadratic.puzzle.13', steps: [] },
    {start: 'quadratic.puzzle.13', end: 'quadratic.puzzle.14', steps: [] },
    {start: 'quadratic.puzzle.14', end: 'quadratic.puzzle.15', steps: [] },
    {start: 'quadratic.puzzle.15', end: 'quadratic.puzzle.16', steps: [] },
    {start: 'quadratic.puzzle.16', end: 'quadratic.puzzle.17', steps: [] },
    {start: 'quadratic.puzzle.17', end: 'quadratic.puzzle.18', steps: [] },
    {start: 'quadratic.puzzle.18', end: 'quadratic.puzzle.19', steps: [] },
    {start: 'quadratic.puzzle.19', end: 'quadratic.puzzle.20', steps: [] },
]



const experimentData =  {
    '1':{
        solutionFun: x=> -x*x+10,
        solutionDdx:x=>-2*x,
        solutionFunString:"-t^2+10",
        solutionDdxString:"-2t",
        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
        syDdxMax: 2,
        syDdxLen: 4,
        tyDdxMax: 2,
        tyDdxLen: 4,
        tMax:5,
        numMeasurement:5,
        ddxSliderSpacing:0.5,
        ddxMax: 0, ddxMin:-10,
        funMax: 10, funMin:0, 
    },
    '2': {
        
    },
    '3':{
        
    },
    '4':{
        
    },
    '5':{
        
    }
}

export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'quadratic'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        quadraticPlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1':{

                    drawFunctionLevel(gameState, {nextScenes:["quadratic.puzzle.2"],targetYs:[1], targetSize:50})
                    const uiTip = {
                        update: function(ctx){
                            Color.setColor(ctx, Color.lightGray)
                            ctx.font = '20px monospace'
                            ctx.textAlign = 'left'
                            ctx.textBaseline = 'bottom'
                            ctx.fillText('Click and drag to draw.',900,320)
                        }
                    }
                    gameState.objects.push(uiTip)
                }
                    break
                case '2':
                    drawFunctionLevel(gameState, {nextScenes:["quadratic.puzzle.3"],targetYs:[-1,0],targetSize:50})
                    break
                case '3':
                    drawFunctionLevel(gameState, {nextScenes:["quadratic.puzzle.4"],targetYs:[0.5,1,1.5,2],targetSize:40})
                    break
                case '4':
                    drawFunctionLevel(gameState, {nextScenes:["quadratic.puzzle.5"],targetYs:[-1.5,-2,-1.5,0],targetSize:40})
                    break
                case '5':
                    quadDiscLevel(gameState, {numSliders:4, nextScenes:["quadratic.puzzle.6"], ddx: x=>x, tracerStart:2})
                    break
                case '6':
                    quadDiscLevel(gameState, {numSliders:8, nextScenes:["quadratic.puzzle.7"], ddx: x=>x, tracerStart:2})
                    break
                case '7':
                    quadDiscLevel(gameState, {numSliders:20, withMathBlock:true, nextScenes:["quadratic.puzzle.8"], ddx: x=>x, tracerStart:2})
                    break
                case '8':
                    quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10, withMathBlock:true, nextScenes:["quadratic.puzzle.9"]})
                    break
                case '9':
                    quadDiscLevel(gameState, {numSliders:8, nextScenes:["quadratic.puzzle.10"], ddx: x=> -x, tracerStart:-1})
                    break
                case '10':
                    quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
                        withMathBlock:true, nextScenes:["quadratic.puzzle.11"], ddx: x=> -x, tracerStart:-1})
                    break
                case '11':
                    quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
                        withMathBlock:true, nextScenes:["quadratic.puzzle.12"], ddx: x=> -0.5*x, tracerStart:0})
                    break
                case '12':
                    quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
                        withMathBlock:true, nextScenes:["quadratic.puzzle.13"], func: x=>0.1*x*x})
                    break
                case '13':
                    quadMathBlockTutorial(gameState, {
                        targetVals: [0.5,0,0.5,2], 
                        nextScenes: ["quadratic.puzzle.14"],
                    })
                    break
                case '14':
                    quadMathBlockTutorial(gameState, {
                        targetVals: [1,2,1,-2], 
                        nextScenes: ["quadratic.puzzle.15"],
                    })
                    break
                case '15':
                    applePuzzle(gameState, {
                        version:'sliders',
                        nextScenes: ["quadratic.puzzle.16"],
                        solutionFun: x=> -x*x+9,
                        solutionDdx:x=> -2*x,
                        solutionFunString:"-t^2+9",
                        solutionDdxString:"-2t",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        tMax:3,
                        barMax:4,
                        barStep:1,
                        numMeasurement:5,
                        ddxSliderSpacing:1,
                        ddxMax: 0, ddxMin:-10,
                        funMax: 10, funMin:0,
                    })
                    break
                case '16':
                    applePuzzle(gameState, {
                        version:'fitDdx',
                        nextScenes: ["quadratic.puzzle.17"],
                        solutionFun: x=> -2*x*x+10,
                        solutionDdx:x=>-4*x,
                        solutionFunString:"-2t^2+10",
                        solutionDdxString:"-4t",
                        syFunMax: 5, syFunLen: 10, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 5,
                        syDdxLen: 10,
                        tyDdxMax: 0,
                        tyDdxLen: 10,
                        tMax:3,
                        tStep:0.5,
                        barMax:2.5,
                        barStep:0.5,
                        adderXPrecision:0.5,
                        adderYPrecision:0.5,
                        numMeasurement:5,
                        ddxSliderSpacing:0.5,
                        ddxMax: 0, ddxMin:-10,
                        funMax: 10, funMin:0, 
                    })
                    break
                case '17':
                    applePuzzle(gameState, {
                        version:'fitDdx',
                        nextScenes: ["quadratic.puzzle.18"],
                        solutionFun: x=> -0.5*x*x+8,
                        solutionDdx:x=>-x,
                        solutionFunString:"-0.5t^2+5",
                        solutionDdxString:"-t",
                        syFunMax: 5, syFunLen: 10, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 5,
                        syDdxLen: 10,
                        tyDdxMax: 0,
                        tyDdxLen: 10,
                        tMax:4,
                        barMax:5,
                        barStep:1,
                        adderYPrecision:0.5,
                        numMeasurement:5,
                        ddxSliderSpacing:0.5,
                        ddxMax: 0, ddxMin:-10,
                        funMax: 10, funMin:0, 
                    })
                    break
                case '18':
                    applePuzzle(gameState, {
                        version:'fitDdx',
                        nextScenes: ["quadratic.puzzle.19"],
                        solutionFun: x=> -4*x*x+10,
                        solutionDdx:x=>-10*x,
                        solutionFunString:"-4t^2+10",
                        solutionDdxString:"-10t",
                        syFunMax: 5, syFunLen: 10, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 0,
                        syDdxLen: 10,
                        tyDdxMax: 0,
                        tyDdxLen: 10,
                        tMax:2,
                        tStep:0.5,
                        barMax:2,
                        barStep:0.5,
                        adderYPrecision:1,
                        adderXPrecision:0.5,
                        numMeasurement:5,
                        ddxSliderSpacing:0.5,
                        ddxMax: 0, ddxMin:-20,
                        funMax: 10, funMin:0, 
                    })
                    break
                case '19':
                    applePuzzle(gameState, {
                        version:'fitDdx',
                        nextScenes: ["quadratic.puzzle.20"],
                        solutionFun: x=> x*x,
                        solutionDdx:x=> 2*x,
                        solutionFunString:"t^2",
                        solutionDdxString:"2 t",
                        syFunMax: 5, syFunLen: 10, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 5,
                        syDdxLen: 10,
                        tyDdxMax: 5,
                        tyDdxLen: 10,
                        tMax:5,
                        barMax:4,
                        barStep:1,
                        numMeasurement:5,
                        ddxSliderSpacing:0.5,
                        ddxMax: 10, ddxMin:0,
                        funMax: 10, funMin:0, 
                    })
                    break
                case '20':{
                    const targetBlock = new MathBlock({type: MathBlock.BIN_OP, token:"+", originX: 200, originY: 200})
                    const multBlock = new MathBlock({type: MathBlock.BIN_OP, token:"*"})
                    multBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"a"})) 
                    const squareBlock = new MathBlock({type: MathBlock.POWER, token:'2'})
                    multBlock.setChild(1, squareBlock)
                    squareBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
                    targetBlock.setChild(0, multBlock) 
                    targetBlock.setChild(1, new MathBlock({type: MathBlock.VARIABLE, token:"b"}))
                    const blocks = [
                        new MathBlock({type:MathBlock.CONSTANT}),
                        new MathBlock({type:MathBlock.VARIABLE, token:"a"}),
                        new MathBlock({type:MathBlock.VARIABLE, token:"b"}),
                        new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
                        new MathBlock({type:MathBlock.BIN_OP, token:"*"}),
                    ]
                    Experiment.ruleGuess(gameState, {planetUnlock:'exponential', targetBlock:targetBlock, blocks: blocks,
                        correctDdx:(x,a,b) => 2 * a * x,
                        initA:0.1,
                        initB:-5,
                    })
                }
                break
            }
        break

        case 'dialogue':
            quadraticPlanet(gameState)
            switch(sceneNameSplit[2]){
                case '1':
                    Planet.dialogueScene(gameState, {nextScenes:["quadratic.puzzle.5"], text: [
                        'The more points you add, the smoother the line gets.',    
                    ]})
                break
                case '2':
                    Planet.dialogueScene(gameState, {nextScenes:["quadratic.puzzle.9"], text: [
                        'Did you recognize that curved graph in the last few levels?',
                        'It\'s the graph of x^2!',
                        'Take this, it will let you make x^2 graphs.'
                    ],
                    onComplete:(gameState)=>{
                        Planet.unlockPopup(gameState, {itemImage:'squareBlock', topText: 'You got a Square Block!', bottomText:''})
                    }})
                break
                case '3':
                    Planet.dialogueScene(gameState, {nextScenes:["quadratic.lab"], text: [  
                        'Have you ever noticed that things speed up as they fall?',
                    ]})
                break
            }
            break

        case "lab":
            Experiment.experimentMenu(gameState, {experimentData: experimentData, ruleFunString:'ax^2+b', ruleDdxString:'2ax'})
            break
        
        case "trial":
            if (sceneNameSplit[2] == 'rule') {
               
            } else {
                quadExperimentTrial(gameState, experimentData[sceneNameSplit[2]])
            } 
            break
    }
}


function quadraticPlanet(gameState,message={}){
    Planet.planetScene(gameState, {
        planetName:'quadratic',
        shipX:10, shipY: -200,
        tileMap:tileMap,
        playerNodes:nodes,
        playerPaths:paths,
        bgImg: 'quadPlanetBg',
        fgImg: 'placeholderFg',
        message
    })
}

function quadDiscLevel (gameState, {
    numSliders,
    withMathBlock = false,
    func, ddx, tracerStart,
    targetSize = 20, sliderSize = 15,
    nextScenes, 
}){
    if (func == null && ddx == null)
        func = x => x*x/2
    
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const gridLeft = new Grid({canvasX:withMathBlock ? 150 : 300, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})
    const gridRight = new Grid({canvasX:withMathBlock ? 700 : 900, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})
    
    const spacing = gridLeft.gridWidth/numSliders
    var sliders = []
    for (let i = 0; i < numSliders; i++){
        sliders.push(new Slider({grid:gridRight, gridPos:gridRight.gridXMin + i * spacing,
            increment: withMathBlock ? 0.05 : 0.1,circleRadius:sliderSize}))
    }
    
    var targets = []
    if (func != null)
        tracerStart = func(gridLeft.gridXMin)
    var y = tracerStart
    for (let i = 0; i < numSliders; i++) {
        const x = gridLeft.gridXMin+(i+1)*spacing
        if (func != null)
            y = func(x)
        else 
            y += ddx(gridLeft.gridXMin+i*spacing)*spacing
        targets.push(new Target({grid: gridLeft, gridX:x, gridY:y, size:targetSize}))
    }
    
    
    const tracer = new IntegralTracer({grid: gridLeft, input: {type:'sliders', sliders:sliders}, targets:targets, originGridY:tracerStart})
    
    const blocks = [
        new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
    ]
    for (let b of gss.mathBlocksUnlocked){
        blocks.push(new MathBlock({type: b.type, token: b.token}))
    }

    gameState.objects = [gridLeft, gridRight, tracer, backButton, nextButton].concat(targets).concat(sliders)


    if (withMathBlock){

        const sySlider = new Slider({canvasX: 1200, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
        const tySlider = new Slider({canvasX: 1300, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})
        const mbField = new MathBlockField({minX:700, minY:100, maxX:1100, maxY:300, outputSliders:sliders})
        const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:150, outputType:"sliders",
            scaleYSlider: sySlider, translateYSlider:tySlider,
            blockFields: [ mbField ],

        })
        gameState.objects = gameState.objects.concat([mbm, sySlider, tySlider])
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
    }

    Planet.addWinCon(gameState, ()=>tracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

function applePuzzle(gameState, {solutionFun, ...options}){
    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT, token:'0'}),
        new MathBlock({type:MathBlock.VARIABLE, token:'t'}),
        new MathBlock({type:MathBlock.POWER, token:'2'})
    ]
    const turtle = {
        maxDist:500,
        originX:1100,
        originY:800,
        time:0,
        update: function(ctx){
            // Turtle
            const y = this.originY - (Math.max(0,solutionFun(this.time)) * this.maxDist / 10)
            ctx.font = "50px monospace"
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText("🍎", this.originX+50, y)

            // Number line
            const numTicks = 10
            const lineWidth = 5
            const tickLength = 10
            Color.setColor(ctx, Color.white)
            Shapes.RoundedLine(ctx, this.originX, this.originY, this.originX, this.originY - this.maxDist, lineWidth)

            ctx.font = '24px monospace'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText('p(t) = ' + Math.max(0,solutionFun(this.time)).toFixed(1), 1250, 220)
            ctx.fillText('t = ' + this.time.toFixed(1), 1050, 220)
            
            ctx.font = '20px monospace'
            for (let i = 0; i < numTicks + 1; i++) {
                const tickY = this.originY - this.maxDist / numTicks * i
                ctx.textBaseline = 'middle'
                ctx.textAlign = 'right'
                ctx.fillText(i, this.originX-30, tickY)
                Shapes.RoundedLine(ctx, this.originX - tickLength, tickY, this.originX + tickLength, tickY, lineWidth)
            }

            
        }
    }

    measurementPuzzle(gameState, {measureObject:turtle,
        blocks:blocks,solutionFun:solutionFun, ...options})
}


function quadMathBlockTutorial(gameState, {
    targetVals, tracerStart = 0,
    targetSize = 20, sliderSize = 15,
    nextScenes,
}) {
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const grid = new Grid({canvasX:600, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})

    const spacing = grid.gridWidth/targetVals.length

    var targets = []
    for (let i = 0; i < targetVals.length; i++) {
        targets.push(new Target({grid: grid, gridX:grid.gridXMin+(i+1)*spacing, gridY:targetVals[i], size:targetSize}))
    }
     
    const functionTracer = new FunctionTracer({grid: grid, targets: targets, solvable:true})

    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT}),
        new MathBlock({type: MathBlock.VARIABLE, token:'x'}),
        new MathBlock({type: MathBlock.POWER, token:'2'})
    ]
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
    Planet.addWinCon(gameState, ()=>functionTracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

