import {Color, Shapes} from '../util/index.js'
import {TileMap, Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import * as Planet from './Planet.js'
import * as Experiment from './Experiment.js'

const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// SW 0,1 NW -1,0 NE 0,-1 SE 1,0
const nodes = {
    'planetMap':            [5,1, 0,-1],
    'product.puzzle.1': [6,1, 0,-1],
    'product.puzzle.2': [7,1, 0,-1],
    'product.puzzle.3': [8,1, 0,-1],
    'product.puzzle.4': [9,1, 0,-1],
    'product.dialogue.1':[9,3, 0,1],
    'product.puzzle.5': [10,1, 0,-1],
    'product.puzzle.6': [11,1, 0,-1],
    'product.puzzle.7': [12,1, 0,-1],
    'product.puzzle.8': [13,1, 0,-1],
    'product.puzzle.9': [14,1, 0,-1],
    'product.puzzle.10':[15,1, 0,-1],
    'product.puzzle.11': [6, 3, 0,-1],
    'product.puzzle.12': [7, 3, 0,-1],
    'product.puzzle.13': [8, 3, 0,-1],
    'product.puzzle.14': [9, 3, 0,-1],
    'product.puzzle.15': [10,3, 0,-1],
    'product.puzzle.16': [11,3, 0,-1],
    'product.puzzle.17': [12,3, 0,-1],
    'product.puzzle.18': [13,3, 0,-1],
    'product.puzzle.19': [14,3, 0,-1],
    'product.puzzle.20': [15,3, 0,-1],
}

const paths = 
[
    {start: 'planetMap', end: 'product.puzzle.1'},
    {start: 'product.puzzle.1', end: 'product.puzzle.2', steps: [] },
    {start: 'product.puzzle.2', end: 'product.puzzle.3', steps: [] },
    {start: 'product.puzzle.3', end: 'product.puzzle.4', steps: [] },
    {start: 'product.puzzle.4', end:  'product.puzzle.5', steps: [] },
    {start: 'product.puzzle.4', end:  'product.dialogue.1', steps: [] },
    {start: 'product.puzzle.5', end: 'product.puzzle.6', steps: [] },
    {start: 'product.puzzle.6', end: 'product.puzzle.7', steps: [] },
    {start: 'product.puzzle.7', end: 'product.puzzle.8', steps: [] },
    {start: 'product.puzzle.8', end: 'product.puzzle.9', steps: [] },
    {start: 'product.puzzle.9', end: 'product.puzzle.10', steps: [] },
    {start: 'product.puzzle.10', end: 'product.puzzle.11', steps: [] },
    {start: 'product.puzzle.11', end: 'product.puzzle.12', steps: [] },
    {start: 'product.puzzle.12', end: 'product.puzzle.13', steps: [] },
    {start: 'product.puzzle.13', end: 'product.puzzle.14', steps: [] },
    {start: 'product.puzzle.14', end: 'product.puzzle.15', steps: [] },
    {start: 'product.puzzle.15', end: 'product.puzzle.16', steps: [] },
    {start: 'product.puzzle.16', end: 'product.puzzle.17', steps: [] },
    {start: 'product.puzzle.17', end: 'product.puzzle.18', steps: [] },
    {start: 'product.puzzle.18', end: 'product.puzzle.19', steps: [] },
    {start: 'product.puzzle.19', end: 'product.puzzle.20', steps: [] },
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
}


export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'product'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        productPlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1':
                    productSliderLevel(gameState, {numSliders:1, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:1,
                        productTargetValues: [0.5], f1TargetValues : [-1],
                        f1TracerStart:-0.5, prodTracerStart:0, f2TracerStart:0.5,
                            nextScenes:["product.puzzle.2"]})
                break
                case '2':
                    productSliderLevel(gameState, {numSliders:1, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:1,
                        productTargetValues: [1], f1TargetValues : [2],
                        f1TracerStart:0, prodTracerStart:0, f2TracerStart:0,
                            nextScenes:["product.puzzle.3"]})
                break
                case '3':
                    productSliderLevel(gameState, {numSliders:1, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:1,
                        productTargetValues: [-2], f1TargetValues : [2],
                        f1TracerStart:0, prodTracerStart:0, f2TracerStart:0,
                            nextScenes:["product.puzzle.4"]})
                break
                case '4':
                    productSliderLevel(gameState, {numSliders:1, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:1,
                        productTargetValues: [0], f1TargetValues : [1],
                        f1TracerStart:0, prodTracerStart:0, f2TracerStart:0,
                            nextScenes:["product.puzzle.5"]})
                break
                case '5':
                    productSliderLevel(gameState, {numSliders:2, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:2,
                        productTargetValues: [-1,0], f1TargetValues : [1,1.5],
                        f1TracerStart:0, prodTracerStart:0, f2TracerStart:0,
                            nextScenes:["product.puzzle.6"]})
                break
                case '6':
                    productSliderLevel(gameState, {numSliders:2, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:2,
                        productTargetValues: [1,1], f1TargetValues : [2,0.5],
                        f1TracerStart:0, prodTracerStart:0, f2TracerStart:0,
                            nextScenes:["product.puzzle.7"]})
                break
                case '7':
                    productSliderLevel(gameState, {numSliders:4, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:4,
                        productTargetValues: [-0.25,0.5,-1.5,1.5], f1TargetValues : [0.5,1,1.5,2],
                        f1TracerStart:0, prodTracerStart:0, f2TracerStart:0,
                            nextScenes:["product.puzzle.8"]})
                break
                case '8':
                    productSliderLevel(gameState, {numSliders:4, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:4,
                        productTargetValues: [-0.25,0.5,-1.5,2], f1TargetValues : [0.5,1,1.5,2],
                        f1TracerStart:0, prodTracerStart:2, f2TracerStart:0,
                            nextScenes:["product.puzzle.9"]})
                break
                case '9':
                    productSliderLevel(gameState, {numSliders:4, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:0,gridXMax:1,
                        productTargetValues: [-0.25,0.5,-1.5,2], f1TargetValues : [0.5,1,1.5,2],
                        f1TracerStart:0, prodTracerStart:2, f2TracerStart:0,
                            nextScenes:["product.puzzle.10"]})
                break
                case '10':
                    productRectangleLevel(gameState, {
                        widthFun: x => 0.5*x*x, heightFun: x=>Math.sin(2*x),
                        nextScenes: ['product.puzzle.11']})
                    break
            }
        break

        case 'dialogue':
            productPlanet(gameState)
            case '1':
                Planet.dialogueScene(gameState, {nextScenes:["product.puzzle.5"], text: [
                    'Dialogue',
                ]})
            break

        case "lab":
            Experiment.experimentMenu(gameState, {experimentData: experimentData})
            break
        
        case "trial":
            if (sceneNameSplit[2] == 'rule') {
                Experiment.ruleGuess(gameState, {})
            } else {
                quadExperimentTrial(gameState, experimentData[sceneNameSplit[2]])
            } 
            break
    }
}

function productPlanet(gameState,message){
    Planet.planetScene(gameState, {
        planetName:'product',
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



function productSliderLevel (gameState, {
    numSliders,
    prodTracerStart=0,
    f1TracerStart=0,
    f2TracerStart=0,
    targetSize = 20, sliderSize = 15,
    nextScenes, 
    gridXMax=2,
    gridYMax=2,
    gridYMin=-2,
    gridXMin=-2,
    increment=0.1,
    productTargetValues, 
    f1TargetValues,
}){
    const f1Color = Color.yellow
    const f2Color = Color.magenta
    const productColor = Color.red
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const gridLeft = new Grid({canvasX:100, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    const gridMiddle = new Grid({canvasX:600, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true
    })
    const gridRight = new Grid({canvasX:1100, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:gridXMin, gridYMin:gridYMin, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    
    const spacing = gridLeft.gridWidth/numSliders
    var f1Sliders = []
    var f2Sliders = []
    for (let i = 0; i < numSliders; i++){
        f1Sliders.push(new Slider({grid:gridMiddle, gridPos:gridMiddle.gridXMin + i * spacing,
            increment: increment,circleRadius:sliderSize,circleColor:f1Color,
        }))
        f2Sliders.push(new Slider({grid:gridRight, gridPos:gridRight.gridXMin + i * spacing,
            increment: increment,circleRadius:sliderSize,circleColor:f2Color}))
    }
    
    var productTargets = []
    var f1Targets = []
    for (let i = 0; i < numSliders; i++) {
        const x = gridLeft.gridXMin+(i+1)*spacing
        f1Targets.push(new Target({grid: gridLeft, gridX:x, gridY:f1TargetValues[i], size:targetSize,unhitColor:f1Color}))
        productTargets.push(new Target({grid: gridLeft, gridX:x, gridY:productTargetValues[i], size:targetSize, unhitColor:productColor}))
    }
    
    const f2Tracer = new IntegralTracer({grid: gridLeft, input:{type:'sliders', sliders: f2Sliders}, originGridY:f2TracerStart, 
        unsolvedColor:f2Color,
    })
    const f1Tracer = new IntegralTracer({grid: gridLeft, input:{type:'sliders', sliders: f1Sliders}, targets:f1Targets, originGridY:f1TracerStart,
        unsolvedColor:f1Color,
    })
    const prodTracer = new FunctionTracer({grid: gridLeft, 
        inputFunction: x => {
            return f1Tracer.outputY(x)*f2Tracer.outputY(x)
        },
        targets:productTargets, originGridY:0, animated:true, autoStart:true,
        resetCondition: ()=> f1Tracer.state == FunctionTracer.STOPPED_AT_BEGINNING || f2Tracer.state == FunctionTracer.STOPPED_AT_BEGINNING
    })

    gameState.objects = [gridLeft, gridMiddle, gridRight, f1Tracer, f2Tracer, prodTracer,
         backButton, nextButton].concat(f1Targets).concat(productTargets).concat(f1Sliders).concat(f2Sliders)
    gameState.update = ()=> {
    }

    Planet.winCon(gameState, ()=>prodTracer.solved&&f1Tracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

function productRectangleLevel(gameState, {
    nextScenes,
    widthFun, heightFun,
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const rectangle = new Rectangle({originX:50, originY:450, widthFun:widthFun, heightFun:heightFun})

    const grid = new Grid({canvasX: 750, canvasY:250, canvasWidth: 400, canvasHeight: 400, gridXMin:-2, gridXMax:2, gridYMin:-2, gridYMax:2,
        autoCellSize:true, labels:true})
    const xSlider = new Slider({canvasX: 750, canvasY: 750, canvasLength:400, sliderMax: 2, sliderLength:4, vertical:false, name:'x', startValue:-2})
    const dxSlider = new Slider({canvasX: 750, canvasY: 800, canvasLength:100, sliderMax: 0.1, sliderLength:1, vertical:false, name:'dx', startValue:0.1, increment:0.01})

    const prodLabel = new TextBox({originX:100, originY:250, color:Color.red,
        updateContent: () => 'w*h = ' + (widthFun(xSlider.value) * heightFun(xSlider.value)).toFixed(2), 
    })

    const wLabel = new TextBox({originX:100, originY:200, color:Color.white,
        updateContent: () => 'w = x^2', 
    })
    const hLabel = new TextBox({originX:100, originY:225, color:Color.white,
        updateContent: () => 'h = sin(x)', 
    })


    const targets = []
    const numTargets = 40
    for (let i = 0; i <= numTargets; i++) {
        const x = grid.gridXMin + i / numTargets * grid.gridWidth
        const y = widthFun(x) * heightFun(x)
        if (y <= grid.gridYMax && y >= grid.gridYMin){
            targets.push(new Target({grid: grid, gridX: x, gridY: y, size:10, unhitColor:Color.red}))
        }
    }

    const functionTracer = new FunctionTracer({grid:grid, targets:targets})

    const blocks = [
        new MathBlock({type:MathBlock.CONSTANT}),
        new MathBlock({type:MathBlock.VARIABLE, token:'x'}),
        new MathBlock({type:MathBlock.POWER, token:'2'}),
        new MathBlock({type:MathBlock.POWER, token:'3'}),
        new MathBlock({type:MathBlock.EXPONENT, token:'e'}),
        new MathBlock({type:MathBlock.FUNCTION, token:'sin'}),
        new MathBlock({type:MathBlock.FUNCTION, token:'cos'}),
        new MathBlock({type:MathBlock.BIN_OP, token:'+'}),
        new MathBlock({type:MathBlock.BIN_OP, token:'*'}),
    ]
    const sySlider = new Slider({canvasX: 1250, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
    const tySlider = new Slider({canvasX: 1300, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})

    const mbField = new MathBlockField({minX:750, minY:50, maxX:1150, maxY:200})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:100, blockSize:30,
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
        funTracers: [functionTracer],
    })




    gameState.objects = [backButton, nextButton, rectangle, grid,
        prodLabel,wLabel, hLabel,
        xSlider,dxSlider, sySlider, tySlider,functionTracer,...targets, mbm]
    var highlightedTarget = 20
    gameState.update = ()=> {
        if (targets[highlightedTarget])
            targets[highlightedTarget].setSize(10)
        highlightedTarget = Math.round((xSlider.value-xSlider.minValue)*10)
        if (targets[highlightedTarget])
            targets[highlightedTarget].setSize(20)

        rectangle.t = xSlider.value
        rectangle.dt = dxSlider.value
    }

   Planet.winCon(gameState, ()=>false, nextButton)
   Planet.unlockScenes(nextScenes, gss)
}

class Rectangle extends GameObject{
    constructor({
        originX, originY, 
        canvasScale = 200,
        widthFun, heightFun,
    }){
        super()
        Object.assign(this, {originX, originY, canvasScale, widthFun, heightFun})
        this.t = 1
        this.dt = 0.1
        this.width = widthFun(this.t)
        this.height = heightFun(this.t)
    }



    update(ctx, audio, mouse){
        this.width = this.widthFun(this.t)
        this.height = this.heightFun(this.t)
        const dw = this.widthFun(this.t + this.dt) - this.width
        const dh = this.heightFun(this.t + this.dt) - this.height

        function drawHelper(x,y,w,h){
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.globalAlpha = 0.5; 
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.stroke()
        }

        Color.setColor(ctx, Color.red)
        const drawW =  Math.abs(this.width*this.canvasScale)
        const drawH = Math.abs(this.height*this.canvasScale)
        const drawDW = Math.abs(dw*this.canvasScale)
        const drawDH = Math.abs(dh*this.canvasScale)
        drawHelper(this.originX, this.originY, drawW, drawH);
        Color.setColor(ctx, Color.magenta)
        drawHelper(this.originX + drawW,this.originY, drawDW, drawH);
        Color.setColor(ctx, Color.yellow)
        drawHelper(this.originX,this.originY + drawH, drawW, drawDH);
        ctx.globalAlpha = 1; 

        Color.setColor(ctx, Color.white)
        ctx.font = '20px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (drawW > 20) ctx.fillText('w', this.originX + drawW/2, this.originY-20)
        if (drawH > 20) ctx.fillText('h', this.originX - 20, this.originY+drawH/2)
        if (drawDW > 10) ctx.fillText('dw', this.originX + drawW + drawDW/2, this.originY-20)
        if (drawDH > 10) ctx.fillText('dh', this.originX - 20, this.originY+drawH+drawDH/2)
    }
}