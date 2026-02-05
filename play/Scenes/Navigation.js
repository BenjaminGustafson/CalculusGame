import {Color, Shapes} from '../util/index.js'
import {Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager,
     MathBlockField, Slider, Target, TargetAdder, TextBox,
    ShipViewer, ProgressBar} from '../GameObjects/index.js'
import { loadScene, CANVAS_HEIGHT } from '../Scene.js'
import * as Planet from './Planet.js'
import { GameObjectGroup } from '../GameObjects/GameObject.js'
import * as Header from './Header.js'
import * as Scene from '../Scene.js'

/**
 * NAVIGATION
 * 
 * When the player travels to a new planet, they must pass a series of navigation levels.
 * These levels are styled as navigating through asteroids.
 * 
 * The player gains mastery of a puzzle type by answering correctly and loses mastery
 * on an incorrect answer.

 * After a planet has been reached, the player can teleport to it at any time.
 * The player can also bring up practice puzzles from completed planets.
 * 
 * 
 */


/**
 * 
 * The randomly generated navigation levels
 * 
 */
export function navScene(gameState) {
    const gss = gameState.stored
    const planet = gss.planet

    // Header
    Header.header(gameState, {
        buttonOptsList: [
            {onclick: ()=> Scene.loadScene(gameState, 'planetMap'), label:"←"}
        ],
        title: ''
    })

    // Target function
    var mathBlockFun = newRNGPuzzle(gameState)
    var fun = mathBlockFun.toFunction()
    mathBlockFun.x = 100
    mathBlockFun.y = 300
    mathBlockFun.insert(gameState.objects)

    // Progress bar
    const progressBar = new ProgressBar({})
    progressBar.value = gss.practiceMastery[gss.currentPuzzleType]
    progressBar.insert(gameState.objects)
    
    const padLeft = 100
    const gridDim = 400
    const padBottom = 100
    const intDist = Math.floor(gameState.stored.totalDistance)
    const gridY = CANVAS_HEIGHT-padBottom-gridDim

    // Grids
    const gridLeft = new Grid({
        canvasX:100, canvasY:400,
        canvasWidth:400, canvasHeight:400, 
        gridXMin:-10, gridXMax:10, gridYMin:-10, gridYMax:10,
        labels:true, arrows:false, 
        autoCellSize:true,
        yAxisLabel : 'Position',
        xAxisLabel : 'Time'
    })
    gridLeft.insert(gameState.objects)
    const gridRight = new Grid({
        canvasX:600, canvasY:gridY,
        canvasWidth:400, canvasHeight:400, 
        gridXMin:-10, gridXMax:10, gridYMin:-10, gridYMax:10,
        labels:true, arrows:false, 
        autoCellSize:true,
        yAxisLabel : 'Velocity',
        xAxisLabel : 'Time'
    })
    gridRight.insert(gameState.objects)

    // Sliders
    const tySlider = new Slider({
        canvasX: 1150, canvasY:gridY, canvasLength:400,
        sliderLength: 10, maxValue: 5, showAxis: true, lineWidth:3
    })
    tySlider.insert(gameState.objects)
    const sySlider = new Slider({
        canvasX: 1100, canvasY: gridY, canvasLength: 400,
        sliderLength: 10, maxValue: 5, startValue: 1,showAxis: true, lineWidth:3
    })
    sySlider.insert(gameState.objects)

    // Function tracers
    const funRight = new FunctionTracer({grid:gridRight, lineWidth:5, xStep:0.1})
    funRight.insert(gameState.objects, 1)
    const funLeft = new FunctionTracer({grid:gridLeft, inputFunction:fun, lineWidth:5, xStep:0.1, unsolvedColor:Color.magenta})
    funLeft.insert(gameState.objects, 1)

    // Mathblocks
    const mathBlocks = Planet.standardBlocks(gss.practiceCategory == 'all' ? 'product' : gss.practiceCategory)

    const blockField = new MathBlockField({minX: 600, minY:150, maxX: 1000, maxY:350})
    const mngr = new MathBlockManager({
        blocks:mathBlocks, blockSize:26,
        translateYSlider:tySlider, scaleYSlider:sySlider, 
        blockFields: [blockField],
        funTracers: [funRight],
    })
    mngr.insert(gameState.objects, 10)
    
    // Targets
    const targets = []
    const numTargets = 400
    for (let i = 0; i < numTargets - 1; i++) {
        const x = gridLeft.gridXMin + (i + 1) / numTargets * gridLeft.gridWidth
        const y = fun(x)
        if (y <= gridLeft.gridYMax && y >= gridLeft.gridYMin){
            targets.push(new Target({grid: gridLeft, gridX: x, gridY: y, size:5}))
        }
    }
    const targetGroup = new GameObjectGroup(targets)
    targetGroup.insert(gameState.objects, 2)

    // Integral tracer
    const tracer = new IntegralTracer({grid: gridLeft, input:{type:'mathBlock',  blockField: blockField},
         targets:targets, originGridY: fun(gridLeft.gridXMin), pixelsPerSec:100, autoStart:false,
        precision:0.0001})
    tracer.insert(gameState.objects, 1)

    // Asteroids
    const shipViewer = new ShipViewer({
        fun: fun,
        tracer: tracer,
    })
    shipViewer.generateAsteroids()
    shipViewer.insert(gameState.objects)

    const startButton = new Button({originX: 1050, originY: 150, width: 100, height:60, label:"Start"})
    startButton.insert(gameState.objects)


    /**
     * States:
     * 
     * - Input: Wait while the user puts in input with mathblocks.
     * 
     * - Trace: The input function is traced and we see if it hits any asteroids. 
     *
     * - Result: The progress bar updates
     */
    //const mainObjs  = [gridLeft, gridRight, shipViewer, tySlider, sySlider, startButton, axisLabels, progressBar, backButton]
    
    var state = "Input"
    
    // DEBUG
    // progressBar.dist = 100
    // gss.navDistance = 100

    function changeToState(newState){
        switch (newState){
            case 'Input':
                mngr.frozen = false
                startButton.label = "Start"
                startButton.onclick = () => {changeToState('Trace')}
            break
            case 'Trace':
                tracer.frame = 0
                tracer.reset()
                tracer.start()
                startButton.active = false
                mngr.frozen = true

            break
            case 'Result':
                startButton.active = true
                startButton.label = "Next"
                startButton.onclick = () => {
                    loadScene(gameState, 'navigation')
                }
            break
        }
        state = newState
    }
    changeToState('Input')

    gameState.update = () => {
        console.log(state, tracer.state)
        switch (state) {
            case "Input":{
                if (blockField.rootBlock != null && blockField.rootBlock.toFunction() != null) {
                    startButton.active = true
                } else {
                    startButton.active = false
                }
            }
                break
            case "Trace":{
                if (tracer.state == 'STOPPED_AT_END') {
                    updateNavigationProgress(gameState, gss.currentPuzzleType, tracer.solved ? 1 : 0)
                    changeToState('Result')
                }
            }
                break
            case "Result":
                break
            default:
                break
        }
    }
}



/**
 * Create a random mathblock
 */
function randSimpleBlock (composable = false) {
    const i = Math.floor(Math.random()*(composable ? 3 : 4)) 
    const block = new MathBlock({})
    const m = Math.floor((Math.random()*10-5)*10)/10
    switch (i){
        case 0:
            block.type = MathBlock.POWER
            const p = Math.floor(Math.random()*2)+2
            block.token = p.toString()
            block.scaleY = Math.floor((Math.random()*10-5)*10 / (p+0.2))/10
            block.setChild(0,new MathBlock({type:MathBlock.VARIABLE, token:'x'}))
            break
        case 1:
            block.type = MathBlock.EXPONENT
            block.token = 'e'
            block.scaleY = m
            block.setChild(0,new MathBlock({type:MathBlock.VARIABLE, token:'x'}))
            break
        case 2:
            block.type = MathBlock.FUNCTION
            block.token = 'sin'
            block.scaleY = m
            block.setChild(0,new MathBlock({type:MathBlock.VARIABLE, token:'x'}))
            break
        // Non-composable
        case 3:
            block.type = MathBlock.VARIABLE
            block.token = 'x'
            block.scaleY = m
            break
    }
    return block
}

/**
 * 
 * Assuming that there is one type of puzzle for each planet,
 * gameState.stored.puzzleMastery is indexed the same as other planet arrays.
 * 
 * @param {*} gameState 
 * @returns 
 */
function newRNGPuzzle (gameState){

    const gss = gameState.stored
    gss.strikes = 0
    var puzzleMastery = gss.practiceMastery

    const DEBUG = false
    if (DEBUG){
        puzzleMastery = {
            'linear':0,
            'quadratic':0,
            'power':0,
            'exponential':0,
            'sine':0,
            'sum':0,
            'product':0,
            'chain':0,
        }
    }
    
    var puzzleType = ''
    if (gss.practiceCategory == 'all'){
        // Pick puzzle type so that probability of each type is proportional to (1-mastery)
        var sum = 0
        for (const key in puzzleMastery){
            sum += 1 - puzzleMastery[key]
        }
        const randNum = Math.random()*sum
        var sum2 = 0
        for (const key in puzzleMastery){
            sum2 += 1 - puzzleMastery[key]
            if (randNum < sum2){
                puzzleType = key
                break
            }
        }
    }else {
        puzzleType = gss.practiceCategory
    }
    gss.currentPuzzleType = puzzleType
    

    var mathBlockFun = null
    switch (puzzleType.toLowerCase()){
        case "chain":{ 
            mathBlockFun = randSimpleBlock(true)
            mathBlockFun.setChild(0, randSimpleBlock())
        }
            break
        case "product":{ 
            mathBlockFun = new MathBlock({type:MathBlock.BIN_OP , token:'*'})
            mathBlockFun.setChild(0, randSimpleBlock())
            mathBlockFun.setChild(1, randSimpleBlock())
        }
            break
        case "sum":{ 
            mathBlockFun = new MathBlock({type:MathBlock.BIN_OP , token:'+'})
            mathBlockFun.setChild(0, randSimpleBlock())
            mathBlockFun.setChild(1, randSimpleBlock())
        }
            break
        case "exponential":{
            // m e^x + b -> m e^x
            const m = Math.floor((Math.random()*10-5)*10)/10
            const b = Math.floor((Math.random()*10-5)*10)/10
            mathBlockFun = new MathBlock({type: MathBlock.EXPONENT, token:'e'})
            mathBlockFun.translateY = b
            mathBlockFun.scaleY = m
            mathBlockFun.children[0] = new MathBlock({type:MathBlock.VARIABLE,token: 'x'})
            break
        }
        case "sine":{
            // m sine(x) + b -> m cos (x)
            const m = Math.floor((Math.random()*10-5)*10)/10
            const b = Math.floor((Math.random()*10-5)*10)/10
            mathBlockFun = new MathBlock({type: MathBlock.FUNCTION, token:'sin'})
            mathBlockFun.translateY = b
            mathBlockFun.scaleY = m
            mathBlockFun.children[0] = new MathBlock({type:MathBlock.VARIABLE,token: 'x'})
            break
        }
        case "power":{
            // m x^3 + b -> 3 m x^2
            // m x^4 + b -> 4 m x^3
            const n = Math.round(Math.random()+3)
            const m = Math.floor((Math.random()*10-5)*10/n)/10
            const b = Math.floor((Math.random()*10-5)*10)/10
            mathBlockFun = new MathBlock({type: MathBlock.POWER, token:n.toString()})
            mathBlockFun.translateY = b
            mathBlockFun.scaleY = m
            mathBlockFun.children[0] = new MathBlock({type:MathBlock.VARIABLE,token: 'x'})
            break
        }
        case "quadratic":{
            // m x^2 + b -> 2 m x
            const m = Math.floor((Math.random()*5-2.5)*10)/10
            const b = Math.floor((Math.random()*10-5)*10)/10
            mathBlockFun = new MathBlock({type: MathBlock.POWER, token:'2'})
            mathBlockFun.translateY = b
            mathBlockFun.scaleY = m
            mathBlockFun.children[0] = new MathBlock({type:MathBlock.VARIABLE,token: 'x'})
            break
        }
        default:
        case "linear":{
            // Random slope and intercept in [-5,5]
            const m = Math.floor((Math.random()*10-5)*10)/10
            const b = Math.floor((Math.random()*10-5)*10)/10
            mathBlockFun = new MathBlock({type:MathBlock.VARIABLE, token:'x'})
            mathBlockFun.translateY = b
            mathBlockFun.scaleY = m
        }
        break
    }
    
    const fun = mathBlockFun.toFunction()
    var maxOnInterval = fun(-10)
    var minOnInterval = fun(-10)
    for (let x = -10; x <= 10; x+= 0.1){
        const y = fun(x)
        if (maxOnInterval < y) maxOnInterval = y
        if (minOnInterval > y) minOnInterval = y
    }
    // Extra space below
    if (maxOnInterval >= 10 && minOnInterval >= -10){
        mathBlockFun.translateY += -10 - Math.floor(minOnInterval)
    }
    // Extra space above
    else if (maxOnInterval <= 10 && minOnInterval <= -10){
        mathBlockFun.translateY += 10 - Math.ceil(maxOnInterval)
    }

    
    gss.currentNavFunction = MathBlock.dehydrate(mathBlockFun)
    return mathBlockFun
}

/**
 * 
 * puzzleMastery is the exponential moving average of the .
 * It is a score from 0 to 1.
 * 
 * alpha is a parameter of how quickly the mastery changes 
 * 
 * @param {*} gameState
 * @param {number} puzzleType  
 * @param {number} wasCorrect 0 if incorrect, 1 if correct
 */
function updateNavigationProgress(gameState, puzzleType, wasCorrect){
    // if (gameState.stored.navPuzzleAttempts[puzzleType] == null)
    //     gameState.stored.navPuzzleAttempts[puzzleType] = 0
    //gameState.stored.navPuzzleAttempts[puzzleType] ++
    const alpha = 0.3
    gameState.stored.practiceMastery[puzzleType] = alpha * wasCorrect + (1-alpha) * gameState.stored.practiceMastery[puzzleType]
}


