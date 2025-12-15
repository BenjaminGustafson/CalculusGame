import {Color, Shapes} from '../util/index.js'
import {Grid, FunctionTracer, Button, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import * as Planet from './Planet.js'
import * as Puzzles from './Puzzles.js'
import * as FileLoading from '../util/FileLoading.js'
import { TileMap } from '../util/TileMap.js'


function exponentialPlanet(gameState, pathData, goTo) {
    if (!gameState.stored.completedScenes['exponential.1a']){
        gameState.stored.completedScenes['exponential.1a'] = 'in progress'
    }
    Planet.planetScene(gameState, {
        planetName: 'exponential',
        tileMap:  new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0}),
        pathData: pathData,
        bgImg: 'placeholderBg',
        fgImg: 'placeholderFg',
        goTo:goTo,
    })
}

function expSliderTargets(gameState, {
    sliders, targets
}){
    Puzzles.addToUpdate(gameState, () => {
        for (let i = 0; i < sliders.length; i++) {
            targets[i].setGridYPosition(sliders[i].value)
        }
    })
}


export async function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'exponential'

    const pathData = await FileLoading.loadJsonFile('./data/exponentialPlanet.json')

    Scene.sceneTitle(gameState, 'Exponential ' + (sceneName ? sceneName : 'Planet'))

    // Root scene
    if (!sceneName){
        exponentialPlanet(gameState, pathData, message.goTo)
        console.log(gameState.objects)
        return
    }

    const nextScenes = pathData.nodes[sceneName].next

    const blocks = Planet.standardBlocks('exponential')

    // Sub-scenes
    switch(sceneName){
        case 'ship':{
            Scene.loadScene(gameState, 'planetMap')
        }
        break
        /**
         * Section 1: Exponential slider puzzles. The targets match the 
         * value of the sliders.
         */
        case '1a':{
            // TODO make grids smaller just for this level
            const numSliders = 2
            const {sliderGroup, targetGroup} = Puzzles.sliderLevel(gameState, {
                gridSetupOpts: {
                    gridOpts:{
                        gridXMax:2,
                        gridYMax:4,
                        gridXMin:0,
                        gridYMin:0,
                        canvasWidth: 200,
                        canvasHeight: 400,
                    },
                },
                tracerOpts: {originGridY: 1},
                targetBuilder: Puzzles.buildTargetsFromYs({
                    targetYs: new Array(numSliders).fill(0),
                    targetOpts:{
                        size:20
                    }, 
                    indexOffset: 0}
                ),
                sliderSetupOpts: {
                    numSliders,
                    sliderOpts: {
                        circleRadius:15,
                    },
                },
                nextScenes,
            })
            expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
        }
        break
        case '1b':
            // 4 sliders, ys are powers of 2 up to 16
            {
                const numSliders = 4
                const {sliderGroup, targetGroup} = Puzzles.sliderLevel(gameState, {
                    gridSetupOpts: {
                        gridOpts:{
                            gridXMax:4,
                            gridYMax:16,
                            gridXMin:0,
                            gridYMin:0,
                            autoCellSize: true,
                            minCellSize:20,
                            labels:true,
                        },
                    },
                    tracerOpts: {originGridY: 1},
                    targetBuilder: Puzzles.buildTargetsFromYs({
                        targetYs: new Array(numSliders).fill(0),
                        targetOpts:{
                            size:20
                        }, 
                        indexOffset: 0}
                    ),
                    sliderSetupOpts: {
                        numSliders,
                        sliderOpts: {
                            circleRadius:15,
                            increment:1,
                        },
                    },
                    nextScenes,
                })
                expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
            }
            break
        case '1c':
            /**
             * 4 sliders with mathblock
             * Solution: 2^n 
             */
            exponentialLevel(gameState, {numSliders:4,
                nextScenes,
                withMathBlock:true,
                gridXMax:4,gridYMax:16,
                lastTarget:16,
                increment: 0.2,
                oneSlider:true,
            })
            break
        case '1d':
            /**
             * 8 slider exponential
             */
            exponentialLevel(gameState, {numSliders:8,
                nextScenes,
                gridXMax:4,gridYMax:30,
                sliderSize: 15, targetSize:16, increment:1}
            )
            
            break
        case '5':
            /**
             * 8 slider exponential with mathblock
             */
            exponentialLevel(gameState, {numSliders:8,
                nextScenes,
                withMathBlock:true,
                gridXMax:4,gridYMax:30,
                lastTarget:27,
                sliderSize: 12, targetSize:16, increment: 0.2,
                oneSlider:true,
            })
            break
        case '6':
            /**
             * 400 slider exponential with mathblock
             * Solution: 2.7^x
             */
            exponentialLevel(gameState, {numSliders:400,
                nextScenes,
                withMathBlock:true,
                gridXMax:4,gridYMax:60,
                lastTarget:53,
                sliderSize: 5, targetSize:6, increment: 0.1,
                oneSlider:true,
            })
            break
        case '3a':
            /**
             * 
             */
            populationLevel(gameState, {
                nextScenes,
                targetX:3.5, targetY:1000,
            })
            break
        case '3b':
            populationLevel(gameState, {
                nextScenes,
                targetX:5, targetY:400,
            })
            break
        case '3c':
            populationLevel(gameState, {
                nextScenes,
                targetX:1.7, targetY:1000,
            })
            break
        case '4a':
            eBlockLevel(gameState, {

            })
            break
        case '4b':
            eBlockLevel(gameState, {
                scaleY:2,
            })
        break
        case '4c':
            eBlockLevel(gameState, {
                scaleY:0.5,
                sliderOpts :{maxValue:2, sliderLength:4, showAxis:true, increment:0.5}, 
            })
        break
        case '4d':
            eBlockLevel(gameState, {
                scaleY:-1,
                sliderOpts :{maxValue:2, sliderLength:4, showAxis:true, increment:0.5}, 
            })
        break
        case '20':{
            const targetBlock = new MathBlock({type:MathBlock.EXPONENT, token:'e',originX: 100, originY: 250,})

            targetBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
            targetBlock.insert(gameState.objects, 1)

            Puzzles.mathBlockLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({fun: targetBlock.toFunction(), numTargets:100, targetOpts:{size:12}}),
                blocks: Planet.standardBlocks('exponential'),
                sliderOpts: {maxValue:5, sliderLength:10, showAxis:true, increment:1},
                gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                tracerOpts: {originGridY: targetBlock.toFunction()(-5)},
                nextScenes,
            })
            Planet.dialogueScene(gameState, {filePath: './dialogue/expE.txt', noExit:true})
        }
        break   
    }
}

function eBlockLevel(gameState, {
    scaleY = 1,
    sliderOpts = {maxValue:5, sliderLength:10, showAxis:true, increment:1},
}){
    const targetBlock = new MathBlock({type:MathBlock.EXPONENT, token:'e',originX: 200, 
        originY: 250,})
    targetBlock.scaleY = scaleY
    targetBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"x"}))
    targetBlock.insert(gameState.objects, 1)

    const fLabel = new TextBox({font:'30px monospace',baseline: 'top', originX: 100,
         originY: 250, content: 'f(x)='})
    const ddxLabel = new TextBox({font:'30px monospace', align: 'right', baseline: 'top',
         originX: 680, originY: 250, content: 'f\'(x)='})
    fLabel.insert(gameState.objects, 0)
    ddxLabel.insert(gameState.objects, 0)

    Puzzles.mathBlockLevel(gameState, {
        targetBuilder: Puzzles.buildTargetsFromFun({fun: targetBlock.toFunction(), 
            numTargets:100, targetOpts:{size:12}}),
        blocks: Planet.standardBlocks('exponential'),
        sliderOpts: sliderOpts,
        gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
        tracerOpts: {originGridY: targetBlock.toFunction()(-5)},
    })
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
        new MathBlock({type:MathBlock.EXPONENT, token:'0'}),
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

    Planet.addWinCon(gameState, ()=>tracer.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

function populationLevel (gameState, {
    nextScenes, tMax=5, targetX, targetY,
}){
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    var initialPop = 1
    const petri = new PetriDish ({originX: 300, originY:450})
    const birthSlider = new Slider({canvasX:1100,canvasY:200,canvasLength:200,
        sliderLength:4, maxValue:4, vertical:false, increment:0.1, startValue:1})

    function popFunction (t) {
        return initialPop * Math.pow(Math.E, birthSlider.value*t)
    }
    const grid = new Grid({canvasX: 850, canvasY: 350, gridXMin:0, gridXMax:tMax, gridYMin:0, gridYMax:1000,
        autoCellSize:true, labels:true, arrows:false})

    const target = new Target({grid:grid, gridX:targetX, gridY:targetY, size:30})

    const tracer = new FunctionTracer({grid:grid, inputFunction: x => popFunction(x), 
        resetCondition: ()=> birthSlider.grabbed,
        targets: [target],
    })

    var time = 0
    var playing = false
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
        petri.population = Math.min(1000,Math.floor(popFunction(time)))
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
         grid, tracer, target]
    Planet.addWinCon(gameState, ()=>tracer.solved, nextButton)
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
        this.prevPop = this.population
    }

    hash01(i){
        let n = (i|0) >>> 0;                     // coerce to 32-bit unsigned
        n = ((n >>> 16) ^ n) * 0x45d9f3b;       // mix
        n = ((n >>> 16) ^ n) * 0x45d9f3b;       // mix again
        n = (n >>> 16) ^ n;
        return (n >>> 0) / 4294967296;          // normalize to [0,1)
    }


    update(ctx, audio, mouse){
        if (this.prevPop != this.population){
            if (this.prevPop < this.population){
                audio.play('drop_001',{pitch:Math.random()*2})
            }
            this.prevPop = this.population
        }
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

