import {Color, Shapes} from '../util/index.js'
import {TileMap, Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import * as Planet from './Planet.js'
import * as Experiment from './Experiment.js'
import * as Puzzles from './Puzzles.js'

const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// SW 0,1 NW -1,0 NE 0,-1 SE 1,0
const nodes = {
    'planetMap':            [5,1, 0,-1],
    'sine.puzzle.1': [6,1, 0,-1],
    'sine.puzzle.2': [7,1, 0,-1],
    'sine.puzzle.3': [8,1, 0,-1],
    'sine.puzzle.4': [9,1, 0,-1],
    'sine.puzzle.5': [10,1, 0,-1],
    'sine.puzzle.6': [11,1, 0,-1],
    'sine.puzzle.7': [12,1, 0,-1],
    'sine.puzzle.8': [13,1, 0,-1],
    'sine.puzzle.9': [14,1, 0,-1],
    'sine.puzzle.10':[15,1, 0,-1],
    'sine.puzzle.11': [15, 3, 0,-1],
    'sine.puzzle.12': [14, 3, 0,-1],
    'sine.puzzle.13': [13, 3, 0,-1],
    'sine.puzzle.14': [12, 3, 0,-1],
    'sine.puzzle.15': [11,3, 0,-1],
    'sine.puzzle.16': [10,3, 0,-1],
    'sine.puzzle.17': [9,3, 0,-1],
    'sine.puzzle.18': [8,3, 0,-1],
    'sine.puzzle.19': [7,3, 0,-1],
    'sine.puzzle.20': [6,3, 0,-1],
}

const paths = 
[
    {start: 'planetMap', end: 'sine.puzzle.1'},
    {start: 'sine.puzzle.1', end: 'sine.puzzle.2', steps: [] },
    {start: 'sine.puzzle.2', end: 'sine.puzzle.3', steps: [] },
    {start: 'sine.puzzle.3', end: 'sine.puzzle.4', steps: [] },
    {start: 'sine.puzzle.4', end:  'sine.puzzle.5', steps: [] },
    {start: 'sine.puzzle.5', end: 'sine.puzzle.6', steps: [] },
    {start: 'sine.puzzle.6', end: 'sine.puzzle.7', steps: [] },
    {start: 'sine.puzzle.7', end: 'sine.puzzle.8', steps: [] },
    {start: 'sine.puzzle.8', end: 'sine.puzzle.9', steps: [] },
    {start: 'sine.puzzle.9', end: 'sine.puzzle.10', steps: [] },
    {start: 'sine.puzzle.10', end: 'sine.puzzle.11', steps: []},
    {start: 'sine.puzzle.11', end: 'sine.puzzle.12', steps: [] },
    {start: 'sine.puzzle.12', end: 'sine.puzzle.13', steps: [] },
    {start: 'sine.puzzle.13', end: 'sine.puzzle.14', steps: [] },
    {start: 'sine.puzzle.14', end: 'sine.puzzle.15', steps: [] },
    {start: 'sine.puzzle.15', end: 'sine.puzzle.16', steps: [] },
    {start: 'sine.puzzle.16', end: 'sine.puzzle.17', steps: [] },
    {start: 'sine.puzzle.17', end: 'sine.puzzle.18', steps: [] },
    {start: 'sine.puzzle.18', end: 'sine.puzzle.19', steps: [] },
    {start: 'sine.puzzle.19', end: 'sine.puzzle.20', steps: [] },
]

function sineSliderLevel(gameState, {numSliders, tracerMiddleStart,
    tracerLeftStart,
    targetOpts = {size:20},
    sliderOpts = {size:15},
    gridOpts = {},
    withMathBlock = false,
}){
    var rightMargin = 0
    if (withMathBlock){
        rightMargin = 300
        gridOpts.canvasWidth = 300
        gridOpts.canvasHeight = 300
    }else{
        gridOpts.canvasWidth = 400
        gridOpts.canvasHeight = 400
    }
    const {sliderGroup, targetGroup} = Puzzles.tripleGraphSliderLevel(gameState, {
        gridSetupOpts: {rightMargin:rightMargin},
        numSliders: numSliders,
        gridOpts: gridOpts,
        tracerMiddleOpts: {originGridY: tracerMiddleStart},
        tracerLeftOpts: {originGridY: tracerLeftStart},
        targetBuilder: Puzzles.buildTargetsFromYs({
            targetYs: new Array(numSliders).fill(0),
            targetOpts: targetOpts, 
            indexOffset: 0}
        ),
        sliderOpts: sliderOpts,
    })
    Puzzles.addToUpdate(gameState, () => {
        for (let i = 0; i < numSliders; i++) {
            targetGroup.objects[i].setGridYPosition(-sliderGroup.objects[i].value)
        }
    })
    if (withMathBlock){
        sliderGroup.objects.forEach(s => s.clickable = false)
        Puzzles.addMathBlocksToSliderLevel(gameState, {
            sliders:sliderGroup.objects,
            mbSliderOpts: {},
            blocks: [
                new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
                new MathBlock({type:MathBlock.FUNCTION, token:'sin'}),
            ]
        })
    }
}




export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'sine'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        sinePlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1': {
                    const numSliders = 8
                    const {sliderGroup, targetGroup} = Puzzles.sliderLevel(gameState, {
                        gridSetupOpts: {gridOpts:{gridXMin:0, gridXMax: 4, gridYMin:-2, gridYMax:2}},
                        sliderSetupOpts: {numSliders: numSliders},
                        tracerOpts: {originGridY: 1},
                        targetBuilder: Puzzles.buildTargetsFromYs({
                            targetYs: new Array(numSliders).fill(0),
                            targetOpts: {size:20}, 
                            indexOffset: 0,
                        }),
                    })
                    Puzzles.addToUpdate(gameState, () => {
                        for (let i = 0; i < numSliders; i++) {
                            targetGroup.objects[i].setGridYPosition(-sliderGroup.objects[i].value)
                        }
                        if (gameState.temp.solved && !gameState.temp.shownDialogue){
                            gameState.temp.shownDialogue = true
                            Puzzles.dialogueOverlay(gameState, {filePath: './dialogue/sineENeg.txt'})
                        }
                    })
                }
                    break
                case '2':

                    // sineSliderLevel(gameState, {
                    //     numSliders: 4,
                    //     tracerLeftStart:0,
                    //     tracerMiddleStart:-1,
                    // })
                    // sineSliderLevel(gameState, {
                    //     numSliders: 4,
                    //     tracerLeftStart:0,
                    //     tracerMiddleStart:1,
                    // })
                    
                    break
                case '3':
                    sineSliderLevel(gameState, {
                        numSliders: 8,
                        tracerLeftStart:0,
                        tracerMiddleStart:-1,
                    })
                    
                    break
                case '4':
                    sineSliderLevel(gameState, {
                        numSliders: 12,
                        tracerLeftStart:0,
                        tracerMiddleStart:1,
                        gridOpts:{canvasWidth:400, canvasHeight:400,gridXMin:-3,gridXMax:3,gridYMin:-3,gridYMax:3},
                    })
                    // Solution: -sin(x)
                    // sineLevel(gameState, {numSliders:100, sliderSize:5, targetSize:10, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:6,
                    //         nextScenes:["sine.puzzle.7"], withMathBlock:true, increment:0.05, tracerLeftStart:0, tracerMiddleStart:1})
                    break
                case '5':
                    sineSliderLevel(gameState, {
                        numSliders: 50,
                        tracerLeftStart:0,
                        tracerMiddleStart:-1,
                        targetOpts: {size:15},
                        sliderOpts: {circleRadius:10, increment: 0.05},
                        gridOpts:{gridXMin:0,gridXMax:4,gridYMin:-2,gridYMax:2},
                        withMathBlock:true,
                    })
                    
                    // Puzzles.addToUpdate(gameState, () => {
                    //     for (let i = 0; i < numSliders; i++) {
                    //         targetGroup.objects[i].setGridYPosition(-sliderGroup.objects[i].value)
                    //     }
                    // })
                    // Solution: sin(x)
                    // sineLevel(gameState, {numSliders:40, sliderSize:10, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:4,
                    //         nextScenes:["sine.puzzle.4"], withMathBlock:true, tracerLeftStart:0, tracerMiddleStart:-1})
                    // Too hard
                    // sineLevel(gameState, {numSliders:100, sliderSize:5, targetSize:10, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:6,
                    //         nextScenes:["sine.puzzle.6"], withMathBlock:true, increment:0.05, tracerLeftStart:1, tracerMiddleStart:0})
                    break
                case '6':
                    Puzzles.tripleGraphMathBlockLevel(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromFun({fun: x => Math.sin(x), numTargets:200, targetOpts:{size:12}}),
                        tracerMiddleOpts: {originGridY: 1},
                        tracerLeftOpts: {originGridY: 0},
                        blocks: Planet.standardBlocks('sine'),
                        sliderOpts: {maxValue:10, sliderLength:20, startValue: 1, showAxis:true, increment:1},
                    })
                    break
                case '7':
                    sineLevel(gameState, {numSliders:200, sliderSize:5, targetSize:12, gridYMin:-3, gridYMax:3,gridXMin:0,gridXMax:6,
                            nextScenes:["sine.puzzle.8"], withMathBlock:true, increment:0.05, tracerLeftStart:0, tracerMiddleStart:-2})
                    break
                case '8':
                    sineLevel(gameState, {numSliders:100, sliderSize:5, targetSize:12, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:6,
                            nextScenes:["sine.puzzle.9"], withMathBlock:true, increment:0.05, tracerLeftStart:0, tracerMiddleStart:-0.5})
                    break
                case '9':
                    // I can't solve my own puzzle! Maybe I just put those starting numbers in by accident
                    sineLevel(gameState, {numSliders:100, sliderSize:5, targetSize:12, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:6,
                            nextScenes:["sine.puzzle.10"], withMathBlock:true, increment:0.05, tracerLeftStart:1, tracerMiddleStart:-1})
                    break
                case '10':
                    springLevel(gameState, {nextScenes:["sine.puzzle.10"],})
                    break
            }
        break

        case 'dialogue':
            sinePlanet(gameState)
            switch(sceneNameSplit[2]){
                case '1':
                    dialogueScene(gameState, {exitTo:"sine", nextScenes:["sine.puzzle.5"], text: [    
                        "⯘Ⳃⱙⰺⳡ ⰺⳝ⯨⯃⯎ ⱤⳆⰸ⯃ ⳙ⯹ⱡ ⯷ⳞⳤⱭⰶ.",
                        "ⳏⳐⰷ⯁Ⱨⰴ ⯢ⱋⳒⰳⳙ ⯚⯜⯍ ⳙⰿⱆ ⳨⯟ⳑ⳪⳰ ⰴⱢⳈⳡ ⱍ⳧Ⳑⰿ.",
                        "ⳟ⯔ ⳓ⯥ⱄⰳ ⳉⳂⳙ⯎ ⱤⳆⰸ⯃ Ɀⰳⱅⰸⳝ ⯢ⳔⳂⳚ ⱇⱏⰴⳂ ⰳⳤⱑ⯅ⰴ!"
                    ]})
                break
            }
            break
    }
}

function sinePlanet(gameState,message){
    console.log('Quadratic function')
    Planet.planetScene(gameState, {
        planetName:'sine',
        shipX:10, shipY: -200,
        tileMap:tileMap,
        playerNodes:nodes,
        playerPaths:paths,
        bgImg: 'placeholderBg',
        fgImg: 'placeholderFg',
        message
    })
    const capFirst = str => str[0].toUpperCase() + str.slice(1)
    const planetName = new TextBox({originX: 400, originY: 50, font: '40px monospace', content:capFirst(gameState.stored.planet) + ' Planet'})
    planetName.insert(gameState.objects,1)
}


function sineLevel (gameState, {
    numSliders,
    withMathBlock = false,
    tracerLeftStart=0,
    tracerMiddleStart=1,
    targetSize = 20, sliderSize = 15,
    nextScenes, 
    gridXMax=5,
    gridYMax=2,
    gridYMin=-2,
    gridXMin=-5,
    increment=0.1,
    firstTarget,
    oneSlider = false,
    nSliderMin=0,nSliderMax=5,nSliderIncrement=0.1,
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const gridLeft = new Grid({canvasX:50, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    const gridMiddle = new Grid({canvasX: 500, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    const gridRight = new Grid({canvasX:950, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    
    const spacing = gridLeft.gridWidth/numSliders
    var sliders = []
    for (let i = 0; i < numSliders; i++){
        sliders.push(new Slider({grid:gridRight, gridPos:gridRight.gridXMin + i * spacing,
            increment: increment,circleRadius:sliderSize}))
    }
    
    // var targets = []
    // for (let i = 0; i < numSliders; i++) {
    //     const x = gridLeft.gridXMin+(i+1)*spacing
    //     targets.push(new Target({grid: gridLeft, gridX:x, gridY:func(x), size:targetSize}))
    // }

    var targets = []
    if (firstTarget != null)
        targets.push(new Target({grid: gridLeft, gridX:gridLeft.gridXMin, gridY:firstTarget, size:targetSize}))
    
    for (let i = 0; i < numSliders; i++) {
        const x = gridLeft.gridXMin+(i)*spacing
        targets.push(new Target({grid: gridLeft, gridX:x, gridY:0, size:targetSize}))
    }
    
    const tracerMiddle = new IntegralTracer({grid: gridMiddle, input:{type:'sliders', sliders: sliders}, originGridY:tracerMiddleStart, 
        spacing: gridLeft.gridWidth / (numSliders)
    })
    const tracerLeft = new IntegralTracer({grid: gridLeft, input:{type:'tracer', tracer: tracerMiddle}, targets:targets, originGridY:tracerLeftStart, 
    })
    
    
    const blocks = [
        new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
        new MathBlock({type:MathBlock.FUNCTION, token:'sin'}),
    ]
    // for (let b of gss.mathBlocksUnlocked){
    //     blocks.push(new MathBlock({type: b.type, token: b.token}))
    // }

    gameState.objects = [gridLeft, gridMiddle, gridRight, tracerLeft,
        tracerMiddle, backButton, nextButton].concat(targets).concat(sliders)
    gameState.update = ()=> {
        for (let i = 0; i < numSliders; i++) {
            targets[i].setGridYPosition(-sliders[i].value)
        }
    }

    if (withMathBlock){

        sliders.forEach(s => s.clickable = false)

        const sySlider = new Slider({canvasX: 1420, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
        const tySlider = new Slider({canvasX: 1520, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})
        const nSlider = new Slider({canvasX: 1550, canvasY: 350, maxValue:nSliderMax, sliderLength:nSliderMax-nSliderMin,
             increment:nSliderIncrement, showAxis:true})
        nSlider.hidden = true
        const mbField = new MathBlockField({minX:950, minY:100, maxX:1350, maxY:300, outputSliders:sliders})
        if (oneSlider){
            sySlider.hidden = true
            tySlider.hidden = true
            nSlider.canvasX = 1450
        }
        const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:150, outputType:"sliders",
            scaleYSlider: sySlider, translateYSlider:tySlider,
            blockFields: [ mbField ],

        })
        gameState.objects = gameState.objects.concat([mbm, sySlider, tySlider, nSlider])
        
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

    Planet.addWinCon(gameState, ()=>tracerLeft.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

function springLevel(gameState, {
    nextScenes,
    targetFun= x => Math.cos(2*x),
    numTargets = 100
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const targetGrid = new Grid({canvasX: 825, canvasY: 350, gridXMin:0, gridXMax:4})

    const targets = []
    for (let i = 0; i < numTargets; i++){
        const x = targetGrid.gridXMin+i*targetGrid.gridWidth/numTargets
        targets.push(new Target({grid: targetGrid, gridX:x, gridY:targetFun(x), size:15}))
    }

    const spring = new SpringMass({originX:700, originY:350})
    const massSlider = new Slider({canvasX: 350,  canvasY: 250, canvasLength: 400, vertical: false, minValue:1, maxValue:16, increment:1, startValue:4})
    const tracer = new FunctionTracer({grid: targetGrid, animated:true, 
        resetCondition: ()=> spring.grabbed || massSlider.grabbed,
        inputFunction: x => spring.positionFunction(x), autoStart:true,
        pixelsPerSec: targetGrid.canvasWidth / targetGrid.gridWidth,
        targets:targets
    })


    gameState.objects = [backButton, nextButton, spring, targetGrid, tracer, ...targets]
    // Taking mass slider out for now, spring equilibrium length changes as mass increases... and period decreases
    //
    gameState.update = () =>{
        if (massSlider.grabbed){
            spring.time = 0
            spring.frequency = Math.sqrt(massSlider.value)
            spring.massSize = 100 / spring.frequency
        }
    }
    Planet.addWinCon(gameState, ()=>tracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}



class SpringMass extends GameObject {
    constructor({
        originX, originY,
        canvasLength=400,
        maxExtension=2,
        massSize=50,
    }){
        super()
        Object.assign(this, { originX, originY, length, massSize, canvasLength, maxExtension})
        this.canvasY = originY + length
        this.massCanvasY = originY
        this.time = 0
        this.position = 0
        this.amplitude = 0
        this.frequency = 2
        this.grabbed = false
        this.grabOffset = 0

        this.prevDateTime = Date.now()
        this.positionFunction = t => 0
    }
    
    mouseInput(mouse){
        if (mouse.x >= this.originX-this.massSize/2 && mouse.x <= this.originX+this.massSize/2
            && mouse.y >= this.massCanvasY-this.massSize/2 &&  mouse.y <= this.massCanvasY+this.massSize/2
        ){
            if (mouse.down){
                this.grabbed = true
                this.grabOffset = mouse.y - this.massCanvasY
                mouse.cursor = 'grabbing'
            }else{
                mouse.cursor = 'grab'
            }
        }
        if (this.grabbed && mouse.up){
            this.grabbed = false
            this.amplitude = this.position
            this.prevDateTime = Date.now()
            this.time = 0
        }
    }

    canvasToLocal(y){
        return this.maxExtension - (y - this.originY) / this.canvasLength * (this.maxExtension*2)
    }

    localToCanvas(y){
        return this.originY - (y - this.maxExtension) * this.canvasLength / (this.maxExtension*2)
    }


    update(ctx, audio, mouse){
        this.mouseInput(mouse)

        if (this.grabbed){
            this.position = this.canvasToLocal(mouse.y - this.grabOffset) 
        }else{
            const dateTime = Date.now()
            this.time += (dateTime - this.prevDateTime)/1000
            if (this.time > Math.PI*2){
                this.time = 0
            }
            this.positionFunction = t => Math.cos(t*this.frequency)*this.amplitude
            this.position = this.positionFunction(this.time)
            this.prevDateTime = dateTime
        }
        if (this.position < -this.maxExtension) this.position = - this.maxExtension
        if (this.position > this.maxExtension) this.position = this.maxExtension

        this.massCanvasY = this.localToCanvas(this.position)
        Color.setColor(ctx, Color.white)
        const spirals = Math.PI*10
        const springWidth = 20
        ctx.lineWidth = 5
        ctx.lineJoin = 'round'
        ctx.beginPath()
        const n = 100
        var x = this.originX
        var y = this.originY
        for (let i = 0; i < n; i++){
            const nx = this.originX + Math.sin(i*spirals/n)*springWidth
            const ny = this.originY + i/n*(this.massCanvasY - this.originY) + Math.cos(i*spirals/n)*springWidth*0.2
            ctx.lineTo(x,y)
            x = nx
            y = ny
        }
        ctx.stroke()
        Color.setColor(ctx, Color.red)
        Shapes.Rectangle({ctx:ctx, originX: this.originX-this.massSize/2, originY:this.massCanvasY-this.massSize/2, width:this.massSize, height:this.massSize,
            shadow : 4, inset : true})

    }
}


class Pendulum extends GameObject{
    constructor({
        originX, originY,
        length = 100,
        startTheta = 0,
    }){
        super()
        Object.assign(this, {})
    }

    update(ctx, audio, mouse){

    }
}


class Orbit extends GameObject {
    constructor({
        originX, originY,
        radius = 100,
        startTheta = 0,
    }){
        super()
        Object.assign(this, { originX, originY, radius, startTheta,})
        this.x = originX + Math.cos(startTheta)*radius
        this.y = originY + Math.sin(startTheta)*radius
        this.theta = startTheta
    }
    
    update(ctx, audio, mouse){
        this.x = originX + Math.cos(theta)*radius
        this.y = originY + Math.sin(theta)*radius
        Shapes()

        '🪐☀️🌑🌒🌓🌔🌕'
    }
}
