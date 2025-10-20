import {Color, Shapes} from '../util/index.js'
import {TileMap, Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import * as Planet from './Planet.js'
import * as Experiment from './Experiment.js'
import { sliderLevel, mathBlockTutorial, drawLevel} from './Shared.js'

const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// SW 0,1 NW -1,0 NE 0,-1 SE 1,0
const nodes = {
    'planetMap':            [5,1, 0,-1],
    'power.puzzle.1': [6,1, 0,-1],
    'power.puzzle.2': [7,1, 0,-1],
    'power.puzzle.3': [8,1, 0,-1],
    'power.puzzle.4': [9,1, 0,-1],
    'power.puzzle.5': [10,1, 0,-1],
    'power.puzzle.6': [11,1, 0,-1],
    'power.puzzle.7': [12,1, 0,-1],
    'power.puzzle.8': [13,1, 0,-1],
    'power.puzzle.9': [14,1, 0,-1],
    'power.puzzle.10':[15,1, 0,-1],
    'power.puzzle.11': [15, 3, 0,-1],
    'power.puzzle.12': [14, 3, 0,-1],
    'power.puzzle.13': [13, 3, 0,-1],
    'power.puzzle.14': [12, 3, 0,-1],
    'power.puzzle.15': [11,3, 0,-1],
    'power.puzzle.16': [10,3, 0,-1],
    'power.puzzle.17': [9,3, 0,-1],
    'power.puzzle.18': [8,3, 0,-1],
    'power.puzzle.19': [7,3, 0,-1],
    'power.puzzle.20': [6,3, 0,-1],
}

const paths = 
[
    {start: 'planetMap', end: 'power.puzzle.1'},
    {start: 'power.puzzle.1', end: 'power.puzzle.2', steps: [] },
    {start: 'power.puzzle.2', end: 'power.puzzle.3', steps: [] },
    {start: 'power.puzzle.3', end: 'power.puzzle.4', steps: [] },
    {start: 'power.puzzle.4', end:  'power.puzzle.5', steps: [] },
    {start: 'power.puzzle.5', end: 'power.puzzle.6', steps: [] },
    {start: 'power.puzzle.6', end: 'power.puzzle.7', steps: [] },
    {start: 'power.puzzle.7', end: 'power.puzzle.8', steps: [] },
    {start: 'power.puzzle.8', end: 'power.puzzle.9', steps: [] },
    {start: 'power.puzzle.9', end: 'power.puzzle.10', steps: [] },
    {start: 'power.puzzle.10', end: 'power.puzzle.11', steps: []},
    {start: 'power.puzzle.11', end: 'power.puzzle.12', steps: [] },
    {start: 'power.puzzle.12', end: 'power.puzzle.13', steps: [] },
    {start: 'power.puzzle.13', end: 'power.puzzle.14', steps: [] },
    {start: 'power.puzzle.14', end: 'power.puzzle.15', steps: [] },
    {start: 'power.puzzle.15', end: 'power.puzzle.16', steps: [] },
    {start: 'power.puzzle.16', end: 'power.puzzle.17', steps: [] },
    {start: 'power.puzzle.17', end: 'power.puzzle.18', steps: [] },
    {start: 'power.puzzle.18', end: 'power.puzzle.19', steps: [] },
    {start: 'power.puzzle.19', end: 'power.puzzle.20', steps: [] },
]



export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'power'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        powerPlanet(gameState, message)
        return
    }

    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT}),
        new MathBlock({type: MathBlock.VARIABLE, token:'x'}),
        new MathBlock({type: MathBlock.POWER, token:'2'}),
        new MathBlock({type: MathBlock.POWER, token:'3'})
    ]
    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1':
                    powerLevel(gameState, {numSliders:4, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:-2,
                         nextScenes:["power.puzzle.2"]})
                    break
                case '2':
                    powerLevel(gameState, {numSliders:20, sliderSize:10, targetSize:15,gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:-2,
                        withMathBlock:true,
                        nextScenes:["power.puzzle.3"]})
                    break
                case '3':
                    powerLevel(gameState, {numSliders:4, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:2,
                        targetFun: x => x*x*x/6, nextScenes:["power.puzzle.4"]})
                    break
                case '4':
                    powerLevel(gameState, {numSliders:400, sliderSize:5, targetSize:10,gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:2,
                        withMathBlock:true,targetFun: x => x*x*x/6, increment:0.05,
                        nextScenes:["power.puzzle.4"]})
                    break
                case '5':
                    
                    mathBlockTutorial(gameState, {
                        numTargets:20, targetFun: x=>x*x*x,blocks:blocks,
                        nextScenes:['power.puzzle.6']
                    })
                    
                    break
                case '6':
                    mathBlockTutorial(gameState, {
                        numTargets:20, targetFun: x=>-x*x*x,blocks:blocks,
                        nextScenes:['power.puzzle.7']
                    })
                    break
                case '7':
                    mathBlockTutorial(gameState, {
                        numTargets:20, targetFun: x=>-x*x*x*0.2+0.5,blocks:blocks,
                        nextScenes:['power.puzzle.8']
                    })
                    break
                case '8':
                    sliderLevel(gameState, {
                        numSliders: 8,
                        targetFun: x => x*x*x/6,
                        tracerStart: -8/6,
                        targetSize:20,
                        sliderSize:15,
                        nextScenes: ['power.puzzle.9'],
                    })
                    break
                case '9':
                    drawLevel(gameState, {
                        targetFun: x => x*x*x/6,
                        numTargets: 8,
                        tracerStart: -8/6,
                        targetSize: 20,
                        nextScenes:  ['power.puzzle.10'],
                    })
                    break
                case '10':
                    drawLevel(gameState, {
                        targetFun: x => -x*x*x/6,
                        numTargets: 8,
                        tracerStart: 8/6,
                        targetSize: 20,
                        nextScenes:  ['power.puzzle.10'],
                    })
                    break
                case '11':
                    break
                case '12':
                    break
                case '13':
                    break
                case '14':
                    break
                case '15':
                    break
                case '16':
                    break
                case '17':
                    break
                case '18':
                    break
                case '19':
                    break
                case '20':
                    break

            }
        break

        case 'dialogue':
            powerPlanet(gameState)
            switch(sceneNameSplit[2]){
                case '1':
                    dialogueScene(gameState, {exitTo:"power", nextScenes:["power.puzzle.5"], text: [    
                        "⯘Ⳃⱙⰺⳡ ⰺⳝ⯨⯃⯎ ⱤⳆⰸ⯃ ⳙ⯹ⱡ ⯷ⳞⳤⱭⰶ.",
                        "ⳏⳐⰷ⯁Ⱨⰴ ⯢ⱋⳒⰳⳙ ⯚⯜⯍ ⳙⰿⱆ ⳨⯟ⳑ⳪⳰ ⰴⱢⳈⳡ ⱍ⳧Ⳑⰿ.",
                        "ⳟ⯔ ⳓ⯥ⱄⰳ ⳉⳂⳙ⯎ ⱤⳆⰸ⯃ Ɀⰳⱅⰸⳝ ⯢ⳔⳂⳚ ⱇⱏⰴⳂ ⰳⳤⱑ⯅ⰴ!"
                    ]})
                break
            }
            break

        case "lab":
            Experiment.experimentMenu(gameState, {experimentData: experimentData})
            break
        
        case "trial":
            if (sceneNameSplit[2] == 'rule') {
                Experiment.ruleGuess(gameState, {})
            } else {
                Experiment.experimentTrial(gameState, experimentData[sceneNameSplit[2]])
            } 
            break
    }
}

function powerPlanet(gameState,message){
    console.log('Quadratic function')
    Planet.planetScene(gameState, {
        planetName:'power',
        shipX:20, shipY: 450,
        labX: 1150, labY:-150, labDir:'SW',
        tileMap:tileMap,
        playerNodes:nodes,
        playerPaths:paths,
        bgImg: 'placeholderBg',
        fgImg: 'placeholderFg',
        message,
        
    })
}

// TODO: re-organize this to be part of the standard level
function powerLevel (gameState, {
    numSliders,
    withMathBlock = false,
    tracerLeftStart,
    tracerMiddleStart=1,
    targetSize = 20, sliderSize = 15,
    nextScenes, 
    gridXMax=5,
    gridYMax=2,
    gridYMin=-2,
    gridXMin=-5,
    increment=0.1,
    oneSlider = false,
    nSliderMin=0,nSliderMax=5,nSliderIncrement=1,
    withCube = false,
    targetFun = x => x*x/2
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    // Grids
    const gridLeft = new Grid({canvasX:50, canvasY:400, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    const gridMiddle = new Grid({canvasX: 500, canvasY:400, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    const gridRight = new Grid({canvasX:950, canvasY:400, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    

    // Sliders
    const spacing = gridLeft.gridWidth/numSliders
    var sliders = []
    for (let i = 0; i < numSliders; i++){
        sliders.push(new Slider({grid:gridRight, gridPos:gridRight.gridXMin + i * spacing,
            increment: increment,circleRadius:sliderSize}))
    }

    // Targets
    var targets = []
    for (let i = 0; i < numSliders; i++) {
        const x = gridLeft.gridXMin+(i+1)*spacing
        const y = targetFun(x)
        if (gridLeft.isInBoundsGridY(y))
            targets.push(new Target({grid: gridLeft, gridX:x, gridY:targetFun(x), size:targetSize}))
    }
    
    // Tracers
    const tracerMiddle = new IntegralTracer({grid: gridMiddle, input:{type:'sliders', sliders: sliders}, originGridY:tracerMiddleStart, 
        spacing: gridLeft.gridWidth / (numSliders)
    })
    if (tracerLeftStart == null){
        tracerLeftStart = targetFun(gridXMin)
    }
    const tracerLeft = new IntegralTracer({grid: gridLeft, input:{type:'tracer', tracer: tracerMiddle}, targets:targets, originGridY:tracerLeftStart, 
    })
    
    
    // Mathblocks
    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT, token:"0"}),
        new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
        new MathBlock({type:MathBlock.POWER, token:"2"}),
    ]
    if (withCube) blocks.push(new MathBlock({type:MathBlock.POWER, token:'3'}))

    gameState.objects = [gridLeft, gridMiddle, gridRight, tracerLeft,
        tracerMiddle, backButton, nextButton].concat(targets).concat(sliders)
    gameState.update = ()=> {
    }

    if (withMathBlock){

        sliders.forEach(s => s.clickable = false)

        const sySlider = new Slider({canvasX: 1400, canvasY: 400, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
        const tySlider = new Slider({canvasX: 1480, canvasY: 400, maxValue:2, sliderLength:4, showAxis:true})
        const nSlider = new Slider({canvasX: 1560, canvasY: 400, maxValue:nSliderMax, sliderLength:nSliderMax-nSliderMin,
             increment:nSliderIncrement, showAxis:true})
        const mbField = new MathBlockField({minX:950, minY:100, maxX:1350, maxY:300, outputSliders:sliders})
        if (oneSlider){
            sySlider.hidden = true
            tySlider.hidden = true
            nSlider.canvasX = 1450
        }
        const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:100, outputType:"sliders",
            scaleYSlider: sySlider, translateYSlider:tySlider, blockSize:30,
            blockFields: [ mbField ],

        })
        gameState.objects = gameState.objects.concat([mbm, sySlider, tySlider])
        
        const update = gameState.update
        gameState.update = ()=>{
            update()
            if (mbField.rootBlock != null){
                const fun = mbField.rootBlock.toFunction()
                if (fun != null){
                    for (let i = 0; i < numSliders; i++){
                        sliders[i].moveToValue(fun(sliders[i].gridPos))
                        //sliders[i].setValue(fun(sliders[i].gridPos))
                    }
                }
            }
        }
    }

    Planet.winCon(gameState, ()=>tracerLeft.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

