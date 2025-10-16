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
    'exponential.puzzle.1': [6,1, 0,-1],
    'exponential.puzzle.2': [7,1, 0,-1],
    'exponential.puzzle.3': [8,1, 0,-1],
    'exponential.puzzle.4': [9,1, 0,-1],
    'exponential.puzzle.5': [10,1, 0,-1],
    'exponential.puzzle.6': [11,1, 0,-1],
    'exponential.puzzle.7': [12,1, 0,-1],
    'exponential.puzzle.8': [13,1, 0,-1],
    'exponential.puzzle.9': [14,1, 0,-1],
    'exponential.puzzle.10':[15,1, 0,-1],
    'exponential.lab':      [16,1, 0,-1],
    'exponential.puzzle.11': [6, 3, 0,-1],
    'exponential.puzzle.12': [7, 3, 0,-1],
    'exponential.puzzle.13': [8, 3, 0,-1],
    'exponential.puzzle.14': [9, 3, 0,-1],
    'exponential.puzzle.15': [10,3, 0,-1],
    'exponential.puzzle.16': [11,3, 0,-1],
    'exponential.puzzle.17': [12,3, 0,-1],
    'exponential.puzzle.18': [13,3, 0,-1],
    'exponential.puzzle.19': [14,3, 0,-1],
    'exponential.puzzle.20': [15,3, 0,-1],
    'exponential.puzzle.∞': [15,5, 0,-1],
}

const paths = 
[
    {start: 'planetMap', end: 'exponential.puzzle.1'},
    {start: 'exponential.puzzle.1', end: 'exponential.puzzle.2', steps: [] },
    {start: 'exponential.puzzle.2', end: 'exponential.puzzle.3', steps: [] },
    {start: 'exponential.puzzle.3', end: 'exponential.puzzle.4', steps: [] },
    {start: 'exponential.puzzle.4', end:  'exponential.puzzle.5', steps: [] },
    {start: 'exponential.puzzle.5', end: 'exponential.puzzle.6', steps: [] },
    {start: 'exponential.puzzle.6', end: 'exponential.puzzle.7', steps: [] },
    {start: 'exponential.puzzle.7', end: 'exponential.puzzle.8', steps: [] },
    {start: 'exponential.puzzle.8', end: 'exponential.puzzle.9', steps: [] },
    {start: 'exponential.puzzle.9', end: 'exponential.puzzle.10', steps: [] },
    {start: 'exponential.puzzle.10', end: 'exponential.puzzle.11', steps: []},
    {start: 'exponential.puzzle.11', end: 'exponential.puzzle.12', steps: [] },
    {start: 'exponential.puzzle.12', end: 'exponential.puzzle.13', steps: [] },
    {start: 'exponential.puzzle.13', end: 'exponential.puzzle.14', steps: [] },
    {start: 'exponential.puzzle.14', end: 'exponential.puzzle.15', steps: [] },
    {start: 'exponential.puzzle.15', end: 'exponential.puzzle.16', steps: [] },
    {start: 'exponential.puzzle.16', end: 'exponential.puzzle.17', steps: [] },
    {start: 'exponential.puzzle.17', end: 'exponential.puzzle.18', steps: [] },
    {start: 'exponential.puzzle.18', end: 'exponential.puzzle.19', steps: [] },
    {start: 'exponential.puzzle.19', end: 'exponential.puzzle.20', steps: [] },
]

export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'exponential'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        exponentialPlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1':
                    exponentialLevel(gameState, {numSliders:4, nextScenes:["exponential.puzzle.2"], gridXMax:4,gridYMax:16})
                    break
                case '2':
                    exponentialLevel(gameState, {numSliders:8, nextScenes:["exponential.puzzle.3"],  gridXMax:4,gridYMax:30,
                        sliderSize: 15, targetSize:16, increment:1}
                    )
                    break
                case '3':
                    exponentialLevel(gameState, {numSliders:4, nextScenes:["exponential.puzzle.4"], withMathBlock:true,
                        gridXMax:4,gridYMax:16,
                        lastTarget:16,
                        increment: 0.2,
                        oneSlider:true,
                    })
                    break
                case '4':
                    exponentialLevel(gameState, {numSliders:8, nextScenes:["exponential.puzzle.5"], withMathBlock:true,
                        gridXMax:4,gridYMax:30,
                        lastTarget:27,
                        sliderSize: 12, targetSize:16, increment: 0.2,
                        oneSlider:true,
                    })
                    break
                case '5':
                    exponentialLevel(gameState, {numSliders:16, nextScenes:["exponential.puzzle.6"], withMathBlock:true,
                        gridXMax:4,gridYMax:40,
                        lastTarget:38,
                        sliderSize: 10, targetSize:15, increment: 0.2,
                        oneSlider:true,
                    })
                    break
                case '6':
                    exponentialLevel(gameState, {numSliders:200, nextScenes:["exponential.puzzle.7"], withMathBlock:true,
                        gridXMax:4,gridYMax:60,
                        lastTarget:53,
                        sliderSize: 5, targetSize:10, increment: 0.1,
                        oneSlider:true,
                    })
                    break
                case '7':
                    populationLevel(gameState, {nextScenes:["exponential.puzzle.8"]
                    })
                    break
               
            }
        break

        case 'dialogue':
            exponentialPlanet(gameState)
            switch(sceneNameSplit[2]){
                case '1':
                    dialogueScene(gameState, {exitTo:"exponential", nextScenes:["exponential.puzzle.5"], text: [    
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

function exponentialPlanet(gameState,message){
    console.log('Quadratic function')
    Planet.planetScene(gameState, {
        planetName:'exponential',
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


function drawFunctionLevel (gameState, {
     tracerStart=1,
    targetSize = 20, sliderSize = 15,
    nextScenes = [], 
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    console.log('DRAW FUNCTION LEVEL')

    const gridLeft = new Grid({canvasX: 300, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-5, gridYMin:-5, gridXMax:5, gridYMax:5, labels:false, arrows:true})
    const gridRight = new Grid({canvasX: 900, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:-5, gridYMin:-5, gridXMax:5, gridYMax:5, labels:false, arrows:true})
    
    const drawFunction = new DrawFunction ({grid: gridRight})


    const numTargets = 10
    const spacing = gridLeft.gridWidth / numTargets
    var targets = []
    for (let i = 0; i < numTargets; i++) {
        const x = gridLeft.gridXMin+(i)*spacing
        targets.push(new Target({grid: gridLeft, gridX:x, gridY:0, size:targetSize}))
    }
    
    
    const tracer = new IntegralTracer({grid: gridLeft, drawFunction:drawFunction, targets:targets,
    })
    

    gameState.objects = [gridLeft, gridRight, backButton, nextButton, drawFunction, tracer].concat(targets)    

    //Planet.winCon(gameState, ()=>tracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

function exponentialLevel (gameState, {
    numSliders,
    withMathBlock = false,
     tracerStart=1,
    targetSize = 20, sliderSize = 15,
    nextScenes, 
    gridXMax=4,gridYMax=16, increment=1,
    //lastTarget,
    oneSlider = false,
    nSliderMin=0,nSliderMax=5,nSliderIncrement=0.1,
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const gridLeft = new Grid({canvasX:withMathBlock ? 150 : 300, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:0, gridYMin:0, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    const gridRight = new Grid({canvasX:withMathBlock ? 700 : 900, canvasY:350, canvasWidth:400, canvasHeight:400, 
        gridXMin:0, gridYMin:0, gridXMax:gridXMax, gridYMax:gridYMax, labels:true, arrows:false, autoCellSize: true})
    
    const spacing = gridLeft.gridWidth/numSliders
    var sliders = []
    for (let i = 0; i <= numSliders; i++){
        sliders.push(new Slider({grid:gridRight, gridPos:gridRight.gridXMin + i * spacing,
            increment: increment,circleRadius:sliderSize}))
    }
    
    // var targets = []
    // for (let i = 0; i < numSliders; i++) {
    //     const x = gridLeft.gridXMin+(i+1)*spacing
    //     targets.push(new Target({grid: gridLeft, gridX:x, gridY:func(x), size:targetSize}))
    // }

    var targets = []
    for (let i = 0; i <= numSliders; i++) {
        const x = gridLeft.gridXMin+(i)*spacing
        targets.push(new Target({grid: gridLeft, gridX:x, gridY:0, size:targetSize}))
    }
    // if (lastTarget != null)
    //     targets.push(new Target({grid: gridLeft, gridX:gridLeft.gridXMax, gridY:lastTarget, size:targetSize}))
    
    
    const tracer = new IntegralTracer({grid: gridLeft, input:{type:'sliders', sliders: sliders, spacing: gridLeft.gridWidth / (numSliders)}, targets:targets, originGridY:tracerStart, 
        
    })
    
    const blocks = [
        new MathBlock({type:MathBlock.VARIABLE, token:"x"}),
        new MathBlock({type:MathBlock.EXPONENT, token:'n'}),
    ]
    // for (let b of gss.mathBlocksUnlocked){
    //     blocks.push(new MathBlock({type: b.type, token: b.token}))
    // }

    gameState.objects = [gridLeft, gridRight, tracer, backButton, nextButton].concat(targets).concat(sliders)
    gameState.update = ()=> {
        for (let i = 0; i <= numSliders; i++) {
            targets[i].setGridYPosition(sliders[i].value)
        }
    }

    if (withMathBlock){

        sliders.forEach(s => s.clickable = false)

        const sySlider = new Slider({canvasX: 1180, canvasY: 350, maxValue:2, sliderLength:4, startValue: 1, showAxis:true})
        const tySlider = new Slider({canvasX: 1260, canvasY: 350, maxValue:2, sliderLength:4, showAxis:true})
        const nSlider = new Slider({canvasX: 1340, canvasY: 350, maxValue:nSliderMax, sliderLength:nSliderMax-nSliderMin, increment:nSliderIncrement, showAxis:true})
        const mbField = new MathBlockField({minX:700, minY:100, maxX:1100, maxY:300, outputSliders:sliders})
        if (oneSlider){
            sySlider.hidden = true
            tySlider.hidden = true
            nSlider.canvasX = 1200
        }
        const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:150, outputType:"sliders",
            scaleYSlider: sySlider, translateYSlider:tySlider, numSlider:nSlider,
            blockFields: [ mbField ],

        })
        gameState.objects = gameState.objects.concat([mbm, sySlider, tySlider, nSlider])
        
        const update = gameState.update
        gameState.update = ()=>{
            update()
            if (mbField.rootBlock != null){
                const fun = mbField.rootBlock.toFunction()
                if (fun != null){
                    for (let i = 0; i <= numSliders; i++){
                        sliders[i].moveToValue(fun(sliders[i].gridPos))
                        //sliders[i].setValue(fun(sliders[i].gridPos))
                    }
                }
            }
        }
    }

    Planet.winCon(gameState, ()=>tracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

function populationLevel (gameState, {
    nextScenes, tMax=10
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)



    var initialPop = 1
    const petri = new PetriDish ({originX: 300, originY:450})
    const birthSlider = new Slider({canvasX:1100,canvasY:200,canvasLength:200,
        sliderLength:4, maxValue:4, vertical:false, increment:0.1, startValue:2})

    function popFunction (t) {
        return initialPop * Math.pow(1+birthSlider.value, t)
    }
    const grid = new Grid({canvasX: 850, canvasY: 350, gridXMin:0, gridXMax:tMax, gridYMin:0, gridYMax:1000,
        autoCellSize:true, labels:true, arrows:false})

    const tracer = new FunctionTracer({grid:grid, inputFunction: x => popFunction(x), 
        resetCondition: ()=> birthSlider.grabbed})

    var time = 0
    var playing = true
    var startTime = Date.now()
    var startValue = 0
    const tSlider = new Slider({canvasX:1100,canvasY:150,canvasLength:450,
        sliderLength:tMax, maxValue:tMax, vertical:false, increment:0.1})
    const timeLabel = new TextBox({originX:1000,originY:80, font:'26px monospace'})
    const playPauseButton = new Button({originX:1000,originY:120,width:50,height:50,
        onclick: function(){
            if (time >= tMax){
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



    gameState.update = () => {
        petri.population = Math.min(1000,popFunction(time))
        tracer.pixelIndex = Math.floor(time/tMax * grid.canvasWidth)

        tSlider.active = !playing
        if (playing){
            time = (Date.now() - startTime)/1000 + startValue // time in secs to 1 decimal
            tSlider.setValue(time)
            playPauseButton.label =  '⏸'
        }else{
            playPauseButton.label =  '⏵'
            time = tSlider.value
        }
        if (time >= tMax){
            time = tMax
            playing = false
            playPauseButton.label = '⏮'
        }
        timeLabel.content = "t = " + time.toFixed(1)
    }


    gameState.objects = [backButton, nextButton, petri, playPauseButton, tSlider, timeLabel,  birthSlider,
         grid, tracer]
    Planet.winCon(gameState, ()=>false, nextButton)
    Planet.unlockScenes(nextScenes, gss)
    
}

class PetriDish extends GameObject{
    constructor({
        originX, originY,
        cellRadius = 10,
        dishRadius = 200,
    }){
        super()
        Object.assign(this, {originX, originY,
            cellRadius,
            dishRadius,})
        this.population = 100
    }

    hash01(i){
        let n = (i|0) >>> 0;                     // coerce to 32-bit unsigned
        n = ((n >>> 16) ^ n) * 0x45d9f3b;       // mix
        n = ((n >>> 16) ^ n) * 0x45d9f3b;       // mix again
        n = (n >>> 16) ^ n;
        return (n >>> 0) / 4294967296;          // normalize to [0,1)
    }


    update(ctx, audio,mouse){

        Color.setColor(ctx,Color.white)
        Shapes.Circle({ctx:ctx, centerX:this.originX, centerY:this.originY, radius:this.dishRadius, shadow:true})

        ctx.globalAlpha = 0.8
        Color.setColor(ctx, Color.green)
        for (let i = 0; i< this.population; i++ ){
            const r =  this.hash01(i*2)*(this.dishRadius-this.cellRadius)
            const theta = this.hash01(i*2+1)*Math.PI*2
            Shapes.Circle({ctx:ctx,centerX: this.originX + Math.cos(theta)*r,
                centerY: this.originY + Math.sin(theta)*r, 
                radius:this.cellRadius})
        }
        ctx.globalAlpha = 1


        // var layer = 1
        // var side = 1
        // var j = 0
        // var x = 1
        // const sqrt3 = Math.sqrt(3)
        // var y = -sqrt3
       
        // Color.setColor(ctx, Color.green)
        // Shapes.Circle({ctx:ctx,
        //     centerX: this.originX,
        //     centerY: this.originY, radius:this.cellRadius})
        // for (let i = 0; i < 100; i++){
        //     // draw circle at rx, ry
        //     Shapes.Circle({ctx:ctx,
        //         centerX: this.originX + this.cellRadius * x,
        //         centerY: this.originY + this.cellRadius * y, radius:this.cellRadius})
            
        //     switch(side){
        //         case 0:
        //             x -= 1
        //             y -= sqrt3
        //         break
        //         case 1:
        //             x-=2
        //         break
        //         case 2:
        //             x -= 1
        //             y += sqrt3
        //         break
        //         case 3:
        //             x += 1
        //             y += sqrt3
        //         break
        //         case 4:
        //             x += 2
        //         break
        //         case 5:
        //             x += 1
        //             y -= sqrt3
        //         break
                
        //     }
        //     j++
        //     if (j >= layer){
        //         side++
        //         j = 0
        //         if (side == 5) j = -1
        //         if (side == 6) {
        //             j = 1
        //             layer++
        //             side = 0
        //         }
        //     }
            
        // }
        
    }
}


function placeHolderLevel(gameState){

}
