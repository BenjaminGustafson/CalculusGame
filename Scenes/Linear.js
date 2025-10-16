import {Color, Shapes} from '../util/index.js'
import {TileMap, Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import { unlockScenes, planetScene, dialogueScene } from './Planet.js'
import * as Experiment from './Experiment.js'
import * as Planet from './Planet.js'

const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// SW 0,1 NW -1,0 NE 0,-1 SE 1,0
const nodes = {
    'planetMap':        [5,1, 0,-1],
    'linear.puzzle.1': [6,1, 0,-1],
    'linear.puzzle.2': [7,1, 0,-1],
    'linear.puzzle.3': [8,1, 0,-1],
    'linear.puzzle.4': [9,1, 0,-1],
    'linear.puzzle.5': [10,1, 0,-1],
    'linear.puzzle.6': [11,1, 0,-1],
    'linear.puzzle.7': [12,1, 0,-1],
    'linear.puzzle.8': [13,1, 0,-1],
    'linear.puzzle.9': [14,1, 0,-1],
    'linear.puzzle.10':[15,1, 0,-1],
    'linear.puzzle.11': [15, 3, 0,-1],
    'linear.puzzle.12': [14, 3, 0,-1],
    'linear.puzzle.13': [13, 3, 0,-1],
    'linear.puzzle.14': [12, 3, 0,-1],
    'linear.puzzle.15': [11,3, 0,-1],
    'linear.puzzle.16': [10,3, 0,-1],
    'linear.puzzle.17': [9,3, 0,-1],
    'linear.puzzle.18': [8,3, 0,-1],
    'linear.puzzle.19': [7,3, 0,-1],
    'linear.puzzle.20': [6,3, 0,-1],
}

const alienDialogue = [
    "⯘Ⳃⱙⰺⳡ ⰺⳝ⯨⯃⯎ ⱤⳆⰸ⯃ ⳙ⯹ⱡ ⯷ⳞⳤⱭⰶ.",
    "ⳏⳐⰷ⯁Ⱨⰴ ⯢ⱋⳒⰳⳙ ⯚⯜⯍ ⳙⰿⱆ ⳨⯟ⳑ⳪⳰ ⰴⱢⳈⳡ ⱍ⳧Ⳑⰿ.",
    "ⳟ⯔ ⳓ⯥ⱄⰳ ⳉⳂⳙ⯎ ⱤⳆⰸ⯃ Ɀⰳⱅⰸⳝ ⯢ⳔⳂⳚ ⱇⱏⰴⳂ ⰳⳤⱑ⯅ⰴ!"
]


const paths = 
[
    {start: 'planetMap', end: 'linear.puzzle.1'},
    {start: 'linear.puzzle.1', end: 'linear.puzzle.2', steps: [] },
    {start: 'linear.puzzle.2', end: 'linear.puzzle.3', steps: [] },
    {start: 'linear.puzzle.3', end: 'linear.puzzle.4', steps: [] },
    {start: 'linear.puzzle.4', end:  'linear.puzzle.5', steps: [] },
    {start: 'linear.puzzle.5', end: 'linear.puzzle.6', steps: [] },
    {start: 'linear.puzzle.6', end: 'linear.puzzle.7', steps: [] },
    {start: 'linear.puzzle.7', end: 'linear.puzzle.8', steps: [] },
    {start: 'linear.puzzle.8', end: 'linear.puzzle.9', steps: [] },
    {start: 'linear.puzzle.9', end: 'linear.puzzle.10', steps: [] },
    {start: 'linear.puzzle.10', end: 'linear.puzzle.11', steps: []},
    {start: 'linear.puzzle.11', end: 'linear.puzzle.12', steps: [] },
    {start: 'linear.puzzle.12', end: 'linear.puzzle.13', steps: [] },
    {start: 'linear.puzzle.13', end: 'linear.puzzle.14', steps: [] },
    {start: 'linear.puzzle.14', end: 'linear.puzzle.15', steps: [] },
    {start: 'linear.puzzle.15', end: 'linear.puzzle.16', steps: [] },
    {start: 'linear.puzzle.16', end: 'linear.puzzle.17', steps: [] },
    {start: 'linear.puzzle.17', end: 'linear.puzzle.18', steps: [] },
    {start: 'linear.puzzle.18', end: 'linear.puzzle.19', steps: [] },
    {start: 'linear.puzzle.19', end: 'linear.puzzle.20', steps: [] },
]


const experimentData =  {
    '1':{
        solutionFun: x=>0.5*x,
        solutionDdx:x=>0.5,
        solutionFunString:"0.5t",
        solutionDdxString:"0.5",
        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
        syDdxMax: 2,
        syDdxLen: 4,
        tyDdxMax: 2,
        tyDdxLen: 4,
        numMeasurement:5,
        ddxSliderSpacing:2,
    },
    '2': {
        solutionFun: x=>5-0.5*x,
        solutionDdx: x=>-0.5,
        solutionFunString:"-0.5t + 5",
        solutionDdxString:"-0.5",
        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
        syDdxMax: 2,
        syDdxLen: 4,
        tyDdxMax: 2,
        tyDdxLen: 4,
        numMeasurement:5,
        ddxSliderSpacing:2,
    },
    '3':{
        solutionFun: x=>1+1.5*x,
        solutionDdx: x=>1.5,
        solutionFunString:"1.5t + 1",
        solutionDdxString:"1.5",
        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
        syDdxMax: 2,
        syDdxLen: 4,
        tyDdxMax: 2,
        tyDdxLen: 4,
        numMeasurement:4,
        ddxSliderSpacing:2,
    },
    '4':{
        solutionFun: x=>2*x,
        solutionDdx: x=>2,
        solutionFunString:"2 t",
        solutionDdxString:"2",
        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
        syDdxMax: 2,
        syDdxLen: 4,
        tyDdxMax: 2,
        tyDdxLen: 4,
        numMeasurement:5,
        ddxSliderSpacing:1,
    },
    '5':{
        
    }
}

export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'linear'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        linearPlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1':
                    linearPuzzle1(gameState, {nextScenes:["linear.puzzle.2"]})
                    break
                case '2':
                    linearPuzzle2(gameState,  {nextScenes:["linear.puzzle.3"]})
                    break
                case '3':
                    simpleDiscLevel(gameState, {targetVals:[0, 1, 1, 2],  nextScenes:["linear.puzzle.4"]})
                    break
                case '4':
                    simpleDiscLevel(gameState, {targetVals:[1, 0, -1, 0], nextScenes:["linear.puzzle.5"]})
                    break
                case '5':
                    simpleDiscLevel(gameState, {targetVals:[0.5, 1, 0.5, 1.5], nextScenes:["linear.puzzle.6"]})
                    break
                case '6':
                    simpleDiscLevel(gameState, {targetVals:[2, 1.5, -0.5, -2], nextScenes:["linear.puzzle.7"]})
                    break
                case '7':
                    simpleDiscLevel(gameState, {targetVals:[1, 0.5, -0.1, -0.8, -0.4, 0.6, 0.2, 0.4], nextScenes:["linear.puzzle.8"]})
                    break
                case '8':
                    simpleDiscLevel(gameState, {targetVals:[0.25, 0.5, 0.75, 1, 1.25, 1, 0.75, 0.5,
                        0.25, 0, 0.5, 1, 0.5, 0, 0.5, 1],  targetSize:15,  sliderSize:12, nextScenes:["linear.puzzle.9"]})
                    break
                case '9':
                    mathBlockTutorials(gameState, {targetVals:[1,1,1,1,1,1,1,1], nextScenes:["linear.puzzle.10"]})
                    break
                case '10':
                    mathBlockTutorials(gameState, {targetVals:[-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5], nextScenes:["linear.puzzle.11"]})
                    break
                case '11':
                    mathBlockTutorials(gameState, {targetVals:[1.5,1,0.5,0,-0.5,-1,-1.5,-2], withLinear:true, nextScenes:["linear.puzzle.12"]})
                    break
                case '12':
                    mathBlockTutorials(gameState, {targetVals:[0.25,0.5,0.75,1,1.25,1.5,1.75,2], withLinear:true, nextScenes:["linear.puzzle.13"]})
                    break
                case '13':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.14"],
                        version:'sliders',
                        solutionFun: x=>0.5*x,
                        solutionDdx:x=>0.5,
                        solutionFunString:"0.5t",
                        solutionDdxString:"0.5",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:5,
                        ddxSliderSpacing:2,
                    })
                    break
                case '14':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.15"],
                        version:'sliders',
                        facingRight:false,
                        solutionFun: x=>5-0.5*x,
                        solutionDdx: x=>-0.5,
                        solutionFunString:"-0.5t + 5",
                        solutionDdxString:"-0.5",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:5,
                        ddxSliderSpacing:2,
                    })
                    break
                case '15':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.16"],
                        version:'fitF',
                        solutionFun: x=>0.5*x,
                        solutionDdx:x=>0.5,
                        solutionFunString:"0.5t",
                        solutionDdxString:"0.5",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:5,
                        ddxSliderSpacing:2,
                    })
                    break
                case '16':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.17"],
                        version:'fitF',
                        solutionFun: x=>1+1.5*x,
                        solutionDdx: x=>1.5,
                        solutionFunString:"1.5t + 1",
                        solutionDdxString:"1.5",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:4,
                        ddxSliderSpacing:2,
                        barMax: 8,
                    })
                    break
                case '17':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.18"],
                        version:'fitDdx',
                        solutionFun: x=>0.5*x,
                        solutionDdx:x=>0.5,
                        solutionFunString:"0.5t",
                        solutionDdxString:"0.5",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:5,
                        ddxSliderSpacing:2,
                    })
                    break
                case '18':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.19"],
                        version:'fitDdx',
                        solutionFun: x=>2*x,
                        solutionDdx: x=>2,
                        solutionFunString:"2 t",
                        solutionDdxString:"2",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:5,
                        ddxSliderSpacing:1,
                        barStep:1,
                        barMax:6,
                    })
                    break
                case '19':
                    turtlePuzzle(gameState, {
                        nextScenes:["linear.puzzle.20"],
                        version:'fitDdx',
                        solutionFun: x=>10-x,
                        solutionDdx: x=>-1,
                        solutionFunString:"-1t + 10",
                        solutionDdxString:"-1",
                        syFunMax: 2, syFunLen: 4, tyFunMax: 10, tyFunLen: 10,
                        syDdxMax: 2,
                        syDdxLen: 4,
                        tyDdxMax: 2,
                        tyDdxLen: 4,
                        numMeasurement:5,
                        ddxSliderSpacing:2,
                    })
                    break
                    case '20':{
                        const targetBlock = new MathBlock({type: MathBlock.BIN_OP, token:"+", originX: 200, originY: 200})
                        const multBlock = new MathBlock({type: MathBlock.BIN_OP, token:"*"})
                        multBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"a"})) 
                        multBlock.setChild(1, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
                        targetBlock.setChild(0, multBlock) 
                        targetBlock.setChild(1, new MathBlock({type: MathBlock.VARIABLE, token:"b"}))
                        const blocks = [
                            new MathBlock({type:MathBlock.CONSTANT}),
                            new MathBlock({type:MathBlock.VARIABLE, token:"a"}),
                            new MathBlock({type:MathBlock.VARIABLE, token:"b"}),
                            new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
                        ]
                        Experiment.ruleGuess(gameState, {planetUnlock:'quadratic', targetBlock:targetBlock, blocks: blocks,
                            correctDdx:(x,a,b) => a,
                        })
                    }
                        break
            }
        break

        case 'dialogue':
            linearPlanet(gameState)
            switch(sceneNameSplit[2]){
                case '1':
                    dialogueScene(gameState, {nextScenes:["linear.puzzle.5"], text: [
                        'Hi there.',    
                        'I\'m trying to figure out how these computers work.', 
                        'It seems like value of graph on the right becomes the slope of the graph on the left.',
                        'Or something like that.',
                    ]})
                break
                case '2':
                    dialogueScene(gameState, {exitTo:"linear", nextScenes:["linear.puzzle.9"], text: [
                        'These next puzzles are a little different.',
                        'You\'ll need one of these...',
                    ],
                    onComplete:(gameState)=>{
                        Planet.unlockPopup(gameState, {itemImage:'constantBlock', topText: 'You got a Number Block!', bottomText:''})
                    }})
                break
                case '3':
                    dialogueScene(gameState, {exitTo:"linear", nextScenes:["linear.puzzle.11"], text: [
                        'That building up ahead is the lab.',
                        'You\'ll need to go in there if you want to travel to the next planet.',
                        'But first, take this...'
                    ],
                    onComplete:(gameState)=>{
                        Planet.unlockPopup(gameState, {itemImage:'linearBlock', topText: 'You got a Variable Block!', bottomText:''})
                    }})
                break
                case '4':
                    dialogueScene(gameState, {exitTo:"linear", nextScenes:["linear.lab"], text: [  
                        'You should go into the lab and run a few trials.',
                        'When you think you\'ve found a pattern you can guess the rule.',
                    ]})
                break
            }
            break

        case "lab":
            Experiment.experimentMenu(gameState, {experimentData: experimentData, ruleFunString:'ax+b', ruleDdxString:'a'})
            break
        
        case "trial":
            if (sceneNameSplit[2] == 'rule') {
                const targetBlock = new MathBlock({type: MathBlock.BIN_OP, token:"+", originX: 200, originY: 200})
                const multBlock = new MathBlock({type: MathBlock.BIN_OP, token:"*"})
                multBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"a"})) 
                multBlock.setChild(1, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
                targetBlock.setChild(0, multBlock) 
                targetBlock.setChild(1, new MathBlock({type: MathBlock.VARIABLE, token:"b"}))
                const blocks = [
                    new MathBlock({type:MathBlock.CONSTANT}),
                    new MathBlock({type:MathBlock.VARIABLE, token:"a"}),
                    new MathBlock({type:MathBlock.VARIABLE, token:"b"}),
                    new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
                ]
                Experiment.ruleGuess(gameState, {planetUnlock:'quadratic', targetBlock:targetBlock, blocks: blocks,
                    correctDdx:(x,a,b) => a,
                })
            } else {
                Experiment.experimentTrial(gameState, experimentData[sceneNameSplit[2]])
            } 
            break
    }
}

function linearPlanet(gameState, message = {}){
    planetScene(gameState, {
        planetName:'linear',
        shipX:20, shipY: 450,
        labX: 70, labY:-150,
        tileMap:tileMap,
        playerNodes:nodes,
        playerPaths:paths,
        bgImg: 'placeholderBg',
        fgImg: 'placeholderFg',
        message
    })
}


// A 1x1 puzzle
function linearPuzzle1 (gameState, {nextScenes}){
    const gss = gameState.stored
    const gridLeft = new Grid({
        canvasX:560, canvasY:430, canvasWidth:100, canvasHeight:100, 
        gridXMin:0, gridYMin:0, gridXMax:1, gridYMax:1, labels:false, arrows:false
    })

    const gridRight = new Grid({canvasX:900, canvasY:430, canvasWidth:100, canvasHeight:100,
        gridXMin:0, gridYMin:0, gridXMax:1, gridYMax:1, labels:false, arrows:false
    })
    
    const slider = new Slider({grid:gridRight, gridPos:0, valueLabel:false})

    const target = new Target({grid: gridLeft, gridX:1, gridY:1, size:20})
    const tracer = new IntegralTracer({grid: gridLeft, input: {type:'sliders', sliders:[slider]}, targets:[target], numLabel:false})

    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)
    
    Planet.unlockScenes(nextScenes, gss)

    // Objects and update
    gameState.objects = [gridLeft, gridRight, slider, target, tracer, backButton, nextButton]
    Planet.winCon(gameState, ()=>tracer.solved, nextButton)
}

// A 2x2 puzzle
function linearPuzzle2 (gameState, {nextScenes}){
    const gss = gameState.stored
    const gridLeft = new Grid({canvasX:560, canvasY:430, canvasWidth:200, canvasHeight:200, 
        gridXMin:-1, gridYMin:0, gridXMax:1, gridYMax:2, labels:false, arrows:false})
    //const gridLeft = new Grid(560, 430, 200, 200, 2, 2, 5)
    const gridRight = new Grid({canvasX:900, canvasY:430, canvasWidth:200, canvasHeight:200, 
        gridXMin:-1, gridYMin:-1, gridXMax:1, gridYMax:1, labels:false, arrows:false})
    const sliders = [
        new Slider({grid:gridRight, gridPos:-1, valueLabel:false}),
        new Slider({grid:gridRight, gridPos:0, valueLabel:false}),
    ]
    const targets = [
        new Target({grid: gridLeft, gridX:0, gridY:1, size:20}),
        new Target({grid: gridLeft, gridX:1, gridY:2, size:20})
    ]
    const tracer =  new IntegralTracer({grid: gridLeft, input: {type:'sliders', sliders:sliders}, targets:targets, numLabel:false})

    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)
        
    gameState.objects = [gridLeft, gridRight, tracer, backButton, nextButton].concat(sliders).concat(targets)
    Planet.winCon(gameState, ()=>tracer.solved, nextButton)
    unlockScenes(nextScenes, gss)
}

/**
 * A 4x4 discrete level with given targets.
 * 
 * @param {*} gameState 
 * @param {*} targetVals The y-values of the targets
 * @param {*} tracerStart y-intercept where the tracer starts from
 * @param {number} targetSize The size of the targets and sliders
 */
function simpleDiscLevel(gameState, {
    targetVals, tracerStart = 0,
    targetSize = 20, sliderSize = 15,
    exitTo = 'linear',
    nextScenes
}) {
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const gridLeft = new Grid({canvasX:300, canvasY:250, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})
    const gridRight = new Grid({canvasX:900, canvasY:250, canvasWidth:400, canvasHeight:400, 
        gridXMin:-2, gridYMin:-2, gridXMax:2, gridYMax:2, labels:false, arrows:true})
    
    const spacing = gridLeft.gridWidth/targetVals.length
    var sliders = []
    for (let i = gridRight.gridXMin; i < gridRight.gridXMax; i+=spacing) {
        sliders.push(new Slider({grid:gridRight, gridPos:i,increment:0.1,circleRadius:sliderSize, valueLabel:false}))
    }
    
    var targets = []
    for (let i = 0; i < targetVals.length; i++) {
        targets.push(new Target({grid: gridLeft, gridX:gridLeft.gridXMin+(i+1)*spacing, gridY:targetVals[i], size:targetSize}))
    }
    
    const tracer = new IntegralTracer({grid: gridLeft, input: {type:'sliders', sliders:sliders}, targets:targets, gridY:tracerStart, numLabel:false})
    
    gameState.objects = [gridLeft, gridRight, tracer, backButton, nextButton].concat(targets).concat(sliders)
    Planet.winCon(gameState, ()=>tracer.solved, nextButton)
    unlockScenes(nextScenes, gss)
}

function mathBlockTutorials(gameState, {
    targetVals, tracerStart = 0,
    targetSize = 20, sliderSize = 15,
    nextScenes, withLinear = false,
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
     
    const functionTracer = new FunctionTracer({grid: grid, targets: targets, solvable:true, numLabel:false})

    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT}),
    ]
    if (withLinear) blocks.push(new MathBlock({type: MathBlock.VARIABLE, token:'x'}))
    const sySlider = new Slider({canvasX: 1200, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true, valueLabel:false})
    const tySlider = new Slider({canvasX: withLinear ? 1300 : 1200, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true, valueLabel:false})

    const mbField = new MathBlockField({minX:600, minY:100, maxX:1000, maxY:300})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1150, toolBarY:150, outputType:"sliders",
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
        funTracers: [functionTracer],
    })

    if (!withLinear){
        sySlider.hidden = true
        mbm.scaleIcon.hidden = true
    }


    gameState.update = ()=>{
        functionTracer.solvable = !sySlider.grabbed && !tySlider.grabbed
    }

    gameState.objects = [grid, functionTracer, backButton, nextButton, mbm, sySlider, tySlider].concat(targets)
    Planet.winCon(gameState, ()=>functionTracer.solved, nextButton)
    unlockScenes(nextScenes, gss)
}



export function turtlePuzzle(gameState, {
    version,
    nextScenes = [], 
    solutionFun, solutionDdx,
    solutionFunString,
    solutionDdxString,
    syFunMax, syFunLen, tyFunMax, tyFunLen,
    syDdxMax, syDdxLen, tyDdxMax, tyDdxLen,
    numMeasurement,
    facingRight = true,
    ddxSliderSpacing,
    barMax=12,
    barStep=2,
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    // Grid
    const gridSize = version == 'fitDdx' ? 350 : 400
    const gridLeft = new Grid({canvasX:50, canvasY:400, canvasWidth:gridSize, canvasHeight:gridSize, 
        gridXMin:0, gridXMax:10, gridYMin:0, gridYMax:10, labels:true, xAxisLabel:'Time t', yAxisLabel:'Position p(t)'})

    const gridRight = new Grid({canvasX: version == 'fitDdx' ? 450 : 580, canvasY:400, canvasWidth:gridSize, canvasHeight:gridSize, 
        gridXMin:0, gridXMax:10, gridYMin:-2, gridYMax:2, labels:true, yAxisLabel: 'Velocity v(t)'})

    const sySlider = new Slider({canvasX: 580, canvasY:400, canvasLength:400, sliderLength:10, maxValue:5, showAxis: true})
    const tySlider = new Slider({canvasX: 650, canvasY:400, canvasLength:400, sliderLength:10, maxValue:5, showAxis: true})
    const adder = new TargetAdder({grid:gridLeft, solutionFun: solutionFun, coverBarPrecision:barStep, barMax:barMax})
    const funTracer = new FunctionTracer({grid:gridLeft})

    if (version == 'fitDdx'){
        sySlider.canvasX = 840
        tySlider.canvasX = 880
        sySlider.canvasLength = 350
        tySlider.canvasLength = 350
    }

    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT, token:'0'}),
        new MathBlock({type:MathBlock.VARIABLE, token:'t'})
    ]


    // Turtle background
    const bgImage = {
        update: function(ctx){
            //const image = document.getElementById("quad_img")
            Color.setColor(ctx,Color.darkBlack)
            const x = 1000
            const y = 200
            const w = 600
            const h = 700
            Shapes.Rectangle({ctx:ctx, originX:x, originY:y, width:w, height:h, inset:true})
            //ctx.drawImage(image, 0,0, 1600*600/900,900, x+10, y+10, w-20, h-20)
        }
    }

    // TURTLE
    const maxTime = 10
    var time = 0
    var playing = true
    var startTime = Date.now()
    var startValue = 0
    const maxDist = 400
    const turtle = {
        originX:1100,
        originY:700,
        update: function(ctx){
            const width = 100
            Color.setColor(ctx,Color.green)
            const x = this.originX - width + (solutionFun(time) * maxDist/maxTime)
            ctx.font = "100px monospace"
            ctx.translate(x,this.originY)
            if (facingRight) ctx.scale(-1,1)
            ctx.textAlign = facingRight ? 'right' : 'left'
            ctx.fillText("🐢", 0, 0)
            ctx.resetTransform()
        }
    }

    const fakeTurtle = {
        update: function (ctx){
            // const width = 80
            // var x = 0
            // if (step == 2){
            //     x = turtle.originX - width + (funTracer.fun(time) * maxDist/maxTime)
            // }else if (step >= 3){
            //     x = turtle.originX - width + (solutionFun(time) * maxDist/maxTime)
            //     Color.setColor(ctx, Color.red)
            //     const dx = funTracer.fun(time)* maxDist/maxTime
            //     if (dx != 0){
            //         Shapes.Line(ctx, x+width-5, 500+width/2, x+width-5+dx, 500+width/2, 5, "arrow", 5,true)
            //     }
            // }
            // Color.setColor(ctx,Color.green)
            // Shapes.Rectangle({ctx:ctx, originX:x, originY:500, width:width,height:width, inset:true})
        }
    }

    // TIME CONTROLS
    const tSlider = new Slider({canvasX:1100,canvasY:150,canvasLength:450,
        sliderLength:10, maxValue:10, vertical:false, increment:1})
    const timeLabel = new TextBox({originX:1100,originY:550, font:'26px monospace'})
    const playPauseButton = new Button({originX:1000,originY:120,width:50,height:50,
        onclick: function(){
            if (time >= maxTime){
                playing = true
                time = 0
                startTime = Date.now()
                startValue = 0
                tSlider.setValue(0)
            }else{
                if (playing){
                    playing = false
                }else{
                    startTime = Date.now()
                    startValue = time
                    playing = true
                }
            } 
        },
        label:"⏸", lineWidth:5
    }) 

    const numberLine = {
        update: function(ctx){
            const originX = turtle.originX 
            const originY = turtle.originY+20
            const length = maxDist
            const numTicks = 10
            const lineWidth = 5
            const tickLength = 10
            Color.setColor(ctx, Color.white)
            Shapes.RoundedLine(ctx, originX, originY, originX + length, originY, lineWidth)

            ctx.font = '26px monospace'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText('p(t) = ' + solutionFun(time).toFixed(1), turtle.originX, turtle.originY -120)
            
            ctx.font = '20px monospace'
            for (let i = 0; i < numTicks + 1; i++) {
                const tickX = originX + length / numTicks * i
                ctx.fillText(i, tickX, originY + tickLength + 5)
                Shapes.RoundedLine(ctx, tickX, originY - tickLength, tickX, originY + tickLength, lineWidth)
            }
        }
    }

    const sliders = []
    const spacing = ddxSliderSpacing
    for (let i = gridRight.gridXMin; i < gridRight.gridXMax; i+=spacing) {
        sliders.push(new Slider({grid:gridRight, gridPos:i,increment:0.1,circleRadius:15}))
    }
    const tracer = new IntegralTracer({grid: gridLeft, originGridY: solutionFun(0), 
        input: {type:'sliders', sliders:sliders}, targets:adder.targets})



    const errorText = new TextBox({originX:950, originY:160, align: 'right'})

    var step = 0

    const mainObjs = [backButton, nextButton, gridLeft, errorText, bgImage, tSlider, timeLabel, turtle, numberLine, playPauseButton,]
    const measureFObjs = [adder, ]
    const meaureDdxObjs = [ gridRight, tracer].concat(sliders)
    gameState.objects = mainObjs.concat(measureFObjs)
    gameState.update = () => {
        if (step == 0 && adder.solved){
            step = 1
            switch (version){
                case 'sliders':
                    gameState.objects = gameState.objects.concat(meaureDdxObjs)
                    Planet.winCon(gameState, ()=>tracer.solved, nextButton)
                break
                case 'fitF':{

                    
                    const field =  new MathBlockField({minX:version == 'fitDdx' ? 450 : 50, minY:200, maxX: version == 'fitDdx' ? 800 : 450, maxY:300})
                    
                    const mngr = new MathBlockManager({
                        blocks:blocks, toolBarX:750, toolBarY:400,
                        translateYSlider:tySlider, scaleYSlider:sySlider, blockSize:26,
                        blockFields: [field],
                        funTracers: [funTracer],
                    })
                    sySlider.setSize(syFunMax, syFunLen)
                    tySlider.setSize(tyFunMax, tyFunLen)
                    funTracer.targets = adder.targets
                    
                    gameState.objects = mainObjs.concat([sySlider, tySlider, funTracer, fakeTurtle, mngr]).concat(adder.targets)
                    Planet.winCon(gameState, ()=>funTracer.solved, nextButton)
                }
                break
                case 'fitDdx':{

                    const blockField =  new MathBlockField({minX:version == 'fitDdx' ? 450 : 50, minY:200, maxX: version == 'fitDdx' ? 800 : 450, maxY:300})
                    const ddxTracer = new FunctionTracer({grid:gridRight})
                    
                    const mngr = new MathBlockManager({
                        blocks:blocks, toolBarX:920, toolBarY:400,
                        translateYSlider:tySlider, scaleYSlider:sySlider, blockSize:26,
                        blockFields: [blockField],
                        funTracers: [ddxTracer],
                    })
                    
                    const blockTracer = new IntegralTracer({grid: gridLeft, originGridY: solutionFun(0), 
                        input: {type:'mathBlock', blockField:blockField}, targets:adder.targets, autoStart: true})
    
                    sySlider.setSize(syDdxMax, syDdxLen)
                    tySlider.setSize(tyDdxMax, tyDdxLen)
                    gameState.objects = mainObjs.concat([sySlider, tySlider, gridRight, blockTracer, fakeTurtle, mngr, ddxTracer]).concat(adder.targets)
                    Planet.winCon(gameState, ()=>blockTracer.solved, nextButton)
                }
                break
            }
        }
        tSlider.active = !playing
        if (playing){
            time = (Date.now() - startTime)/1000 + startValue // time in secs to 1 decimal
            tSlider.moveToValue(time)
            playPauseButton.label =  '⏸'
        }else{
            playPauseButton.label =  '⏵'
            time = tSlider.value
        }
        if (time >= maxTime){
            time = maxTime
            playing = false
            playPauseButton.label = '⏮'
        }
        timeLabel.content = "t = " + time.toFixed(1)
    }

    // Planet.winCon(gameState, ()=>{
    //     switch(version){
    //         case 'sliders':
    //             return tracer.solved
            
    //         case 'fitF':
    //             return funTracer.solved
    //         case 'fitDdx':
    //             return false
    //     }
    // }, nextButton)
    unlockScenes(nextScenes, gss)
}


function checkFunctionsEqual(fun1, fun2){
    for (let x = 0; x <= 10; x++){
        if (Math.abs(fun1(x) - fun2(x)) > 0.00001){
            return {res:false, x:x}
        }
    }

    /**
     * It should be hard to accidentally make a function that
     * is incorrect but hits integers [0,10].
     *  We check [0,10] by 0.1 as well just in case.
     * Integers are done first so that the error output is usually an int.
     * 
     * It is possible to fool the checker at any precision,
     * by doing something like (0.1)^n + correct function.
     * This is acceptable since it pretty much requires the
     * player to be fooling the checker on purpose, and so 
     * should not come up by accident.
     */
    for (let x = 0; x < 10; x+= 0.1){
        if (Math.abs(fun1(x) - fun2(x)) > 0.00001){
            return {res:false, x:x}
        }
    }
    return {res:true}
}
