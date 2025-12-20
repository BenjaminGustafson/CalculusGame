import {Color, Shapes} from '../util/index.js'
import {Grid, FunctionTracer, Button, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import * as GameObjects from '../GameObjects/index.js'
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

function expMBSliderSetup(gameState, {
    gridGroup, sliderGroup, sliderOpts,
}){
    const gridRight = gridGroup.objects[1]
    const mb = MathBlock.parse('[0^[x]]')
    mb.x = gridRight.originX
    mb.y = gridRight.originY - 100
    mb.isHighlighted = true
    mb.insert(gameState.objects)
    // TODO add slider
    const nSlider = new Slider({
        canvasX: gridRight.originX+gridRight.canvasWidth+100,
        canvasY: gridRight.originY,
        canvasLength: gridRight.canvasHeight,
        minValue: 0, maxValue: 5,
        circleColor: Color.green,
        circleRadius: 15,
        increment: 0.5,
        ...sliderOpts,
    })
    nSlider.insert(gameState.objects)
    Puzzles.addToUpdate(gameState, () => {
        mb.token = nSlider.value.toFixed(1)
        Puzzles.setSlidersToMathBlock({sliders: sliderGroup.objects, mathBlock: mb})
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
         * Section 1: Slider puzzles linked to targets
         * 
         * These are normal 2 graph slider puzzles with a twist:
         * the targets move along with the sliders. 
         * This leads the player to consider a functions that is its own derivative.
         * 
         * As we add more targets, the function approaches 2.7^x.
         */

        /**
         * A 2 slider puzzle. Introduces the slider-target link.
         * Solution: 1, 2
         */
        case '1a':{     
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
                        increment:0.5,
                    },
                },
                nextScenes,
            })
            expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
        }
        break
        
        /**
         * A 4 slider puzzle with x-increment 1. Results in powers of 2.
         * Solution: 1,2,4,8
         */
        case '1b':
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
        
        /**
         * 4 sliders with mathblock
         * Solution: 2^n 
         */
        case '1c': {
            const numSliders = 4
            const {sliderGroup, targetGroup, gridGroup} = Puzzles.sliderLevel(gameState, {
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
                        increment:0.2,
                    },
                },
                nextScenes,
            })
            expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
            expMBSliderSetup(gameState, {gridGroup, sliderGroup})
        }
        break

        /**
         * 8 slider exponential
         * Solution:
         */
        case '1d':
            {
                const numSliders = 8
                const {sliderGroup, targetGroup} = Puzzles.sliderLevel(gameState, {
                    gridSetupOpts: {
                        gridOpts:{
                            gridXMax:4,
                            gridYMax:30,
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
                            size:16
                        }, 
                        indexOffset: 0}
                    ),
                    sliderSetupOpts: {
                        numSliders,
                        sliderOpts: {
                            circleRadius:15,
                            increment:0.5,
                        },
                    },
                    nextScenes,
                })
                expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
            }

        break

        /**
         * 8 slider exponential with mathblock
         */
        case '1e':
            {
                const numSliders = 8
                const {sliderGroup, targetGroup, gridGroup} = Puzzles.sliderLevel(gameState, {
                    gridSetupOpts: {
                        gridOpts:{
                            gridXMax:4,
                            gridYMax:30,
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
                            size:16
                        }, 
                        indexOffset: 0}
                    ),
                    sliderSetupOpts: {
                        numSliders,
                        sliderOpts: {
                            circleRadius:15,
                            increment:0.5,
                        },
                    },
                    nextScenes,
                })
                expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
                expMBSliderSetup(gameState, {gridGroup, sliderGroup, sliderOpts:{increment: 0.1}})
            }

        break

        /**
         * 200 slider exponential with mathblock
         * Solution: 2.7^x
        */
        case '1f':{
            const numSliders = 200
            const {sliderGroup, targetGroup, gridGroup} = Puzzles.sliderLevel(gameState, {
                gridSetupOpts: {
                    gridOpts:{
                        gridXMax:4,
                        gridYMax:60,
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
                        size:7
                    }, 
                    indexOffset: 0}
                ),
                sliderSetupOpts: {
                    numSliders,
                    sliderOpts: {
                        circleRadius:7,
                        increment:0.5,
                    },
                },
                nextScenes,
            })
            expSliderTargets(gameState, {sliders:sliderGroup.objects, targets:targetGroup.objects})
            expMBSliderSetup(gameState, {gridGroup, sliderGroup, sliderOpts:{increment: 0.1}})
        }
        break

        /**
         * Section 2: Population puzzles
         * 
         */
        case '2a':
            populationLevel(gameState, {
                solutionGrowthRate: 2,
                initPos: 2,
                nextScenes: pathData.nodes[sceneName].next,
            })
        break

        case '2b':
            populationLevel(gameState, {
                nextScenes,
                targetX:5, targetY:400,
            })
        break

        case '2c':
            populationLevel(gameState, {
                nextScenes,
                targetX:1.7, targetY:1000,
            })
        break

        /**
         * Section 3: Mathblock tutorial
         * 
         * - The e block
         */

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

        /**
         * Section 5: exp rule
         * 
         * - e^x -> e^x 
         * 
         */
        
        /**
         * Section 6: e^x variations 
         * 
         * Setting f = -f' gives e^-x
         * Setting f = f'' gives e^x
         * 
         */


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


function populationLevel(gameState, {
    gridSetupOpts,
    initPop=1, solutionGrowthRate=1,
    nextScenes,
}){
    // GRIDS
    const gridGroup = Puzzles.gridSetup(gameState, {
        numGrids: 2,
        leftMargin: 450, topMargin: 200, 
        gridOpts:{gridXMin:0, gridXMax:4, gridYMin:0, gridYMax:1000,autoCellSize:true,
            labels:true, xAxisLabel:'Time t (minutes)'},
        spacing:100,
        ...gridSetupOpts,
    })
    const grids = gridGroup.objects
    grids[0].gridTitle = 'Population (number of cells)'
    grids[1].gridTitle = 'Rate of change (new cells per minute)'


    // TARGETS
    const targets = Puzzles.targetsFromFun(gameState, {
        fun: x => initPop * Math.pow(Math.E, solutionGrowthRate * x),
        grid: grids[0],
        numTargets: 10,
        targetOpts: {size: 15},
    }).objects

    // TRACERS
    const popTracer = new GameObjects.FunctionTracer({
        grid: grids[0], animated:true, 
        autoStart:false,
        targets:targets
    })
    popTracer.insert(gameState.objects, 1)

    const popDdxTracer = new GameObjects.FunctionTracer({
        grid: grids[1], animated:true, 
        autoStart:false,
    })
    popDdxTracer.insert(gameState.objects, 1)

    // PETRI DISH
    const petriDish = new PetriDish({
        originX: 100 + grids[0].canvasWidth/2,
        originY: grids[0].canvasY+ grids[0].canvasHeight/2,
        popTracer: popTracer,
        popDdxTracer: popDdxTracer,
    })
    petriDish.insert(gameState.objects,1)

    // GROWTH RATE    
    const growthRateSlider = new GameObjects.Slider({
        canvasX: 100 + grids[0].canvasWidth/2,
        canvasY: grids[0].canvasY - grids[0].canvasHeight * 0.2, 
        canvasLength: grids[0].canvasWidth/2,
        vertical: false,
        minValue: 0,
        maxValue: 3,
        startValue:1,
        increment:0.1,
        name: 'Growth Rate'
    })
    growthRateSlider.insert(gameState.objects, 0)


    // Could make an init pop slider
    // Issue with that is it has to be on the scale of 1000 to 
    // have much effect? Could try it but not necessary
    // const pSliderIncrement = 0.1
    // this.positionSlider = new GameObjects.Slider({
    //     canvasX: originX,
    //     canvasY: originY, 
    //     minValue: positionGrid.gridYMin,
    //     maxValue: positionGrid.gridYMax,
    //     increment: pSliderIncrement,
    // })

    const playPauseButton = new GameObjects.Button({
        originX: 100 + grids[0].canvasWidth/2 - 30, 
        originY: grids[0].originY - grids[0].canvasHeight * 0.4,
        width: 50,
        height: 50,
        onclick: () => {
            // Play
            if (popTracer.state == GameObjects.FunctionTracer.STOPPED_AT_BEGINNING) {
                growthRateSlider.clickable = false

                popTracer.setInputFunction(x => initPop * Math.pow(Math.E, growthRateSlider.value * x))
                popDdxTracer.setInputFunction(x => initPop * growthRateSlider.value * Math.pow(Math.E, growthRateSlider.value * x))

                popTracer.start()
                popDdxTracer.start()
            } else {
                growthRateSlider.clickable = true

                popTracer.reset()
                popDdxTracer.reset()
            } 
        },
        label: "⏵", lineWidth: 5
    })
    playPauseButton.insert(gameState.objects)

    Puzzles.addToUpdate(gameState, () => {
        // Play button
        if (popTracer.state == GameObjects.FunctionTracer.STOPPED_AT_END) {
            playPauseButton.label = '⏮'
        }else if (popTracer.state == GameObjects.FunctionTracer.STOPPED_AT_BEGINNING){
            playPauseButton.label = '⏵'
        } else {
            playPauseButton.label = '⏮'
        }
        petriDish.population = Math.min(1000,popTracer.currentY)
    })

    // NAVIGATION
    Planet.levelNavigation(gameState, {
        winCon: () => popTracer.solved,
        nextScenes: nextScenes,
    })
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

        /**
         * The puzzle should set this field in order to change the population
         */
        this.population = 1
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
        Shapes.Circle({ctx:ctx, centerX:this.originX, centerY:this.originY,
            radius:this.dishRadius})

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
    }
}



