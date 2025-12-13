import { Grid, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target,} from '../GameObjects/index.js'
import * as Planet from './Planet.js'
import * as Puzzles from './Puzzles.js'
import * as FileLoading from '../util/FileLoading.js'
import * as Scene from '../Scene.js'
import { TileMap } from '../util/TileMap.js'


function powerPlanet(gameState, pathData, goTo) {
    if (!gameState.stored.completedScenes['power.1a']){
        gameState.stored.completedScenes['power.1a'] = 'in progress'
    }
    Planet.planetScene(gameState, {
        planetName: 'power',
        tileMap:  new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0}),
        pathData: pathData,
        bgImg: 'placeholderBg',
        fgImg: 'placeholderFg',
        goTo:goTo,
    })
}


export async function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'power'

    const pathData = await FileLoading.loadJsonFile('./data/powerPlanet.json')
       
    Scene.sceneTitle(gameState, 'Power ' + (sceneName ? sceneName : 'Planet'))
    
    // Root scene
    if (!sceneName){
        powerPlanet(gameState, pathData, message.goTo)
        return
    }

    const nextScenes = pathData.nodes[sceneName].next

    // Sub-scenes
    switch(sceneName){
        case 'ship':{
                    Scene.loadScene(gameState, 'planetMap')
                }
                break
        case '1a':
            // 4 slider, triple graph, solution is all 1s.
            // Shows that x^2/2 -> x -> 1
            Puzzles.tripleGraphSliderLevel(gameState, {
                sliderSetupOpts:{
                    numSliders: 4,
                    sliderOpts:{circleRadius: 15, increment: 0.25},
                }, 
                targetBuilder: Puzzles.buildTargetsFromFun({
                    fun: x=>x*x/2,
                    numTargets: 4,
                    targetOpts: {size:20},
                }),
                tracerLeftOpts: {
                    originGridY: 2,
                },
                tracerMiddleOpts: {
                    originGridY: -2,
                }, 
                gridSetupOpts:{

                },
                nextScenes: nextScenes,
            })
            break
        case '1b':
            Puzzles.tripleGraphSliderLevel(gameState, {
                sliderSetupOpts:{
                    numSliders: 4,
                    sliderOpts:{circleRadius: 15, increment: 0.25},
                }, 
                targetBuilder: Puzzles.buildTargetsFromYs({
                    targetYs: [0.5,1,0,-1],
                    targetOpts: { size: 20 } }),
                tracerLeftOpts: {
                    originGridY: 0,
                },
                tracerMiddleOpts: {
                    originGridY: 0,
                }, 
                gridSetupOpts:{

                },
                nextScenes: nextScenes,
            })
            break
        case '1c':
            Puzzles.tripleGraphSliderLevel(gameState, {
                sliderSetupOpts:{
                    numSliders: 4,
                    sliderOpts:{circleRadius: 15, increment: 0.25},
                }, 
                targetBuilder: Puzzles.buildTargetsFromYs({
                    targetYs: [0,1,0,-1],
                    targetOpts: { size: 20 } }),
                tracerLeftOpts: {
                    originGridY: 0,
                },
                tracerMiddleOpts: {
                    originGridY: 2,
                }, 
                gridSetupOpts:{

                },
                nextScenes: nextScenes,
            })
            break
        case '2':
            powerLevel(gameState, {numSliders:20, sliderSize:10, targetSize:15,
                gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:-2,
                withMathBlock:true,
                nextScenes: pathData.nodes[sceneName].next})
            break
        case '2a':
            tripleGraphShipPositionLevel(gameState, {
                sliderLevelOpts: {
                    sliderSetupOpts: {
                        numSliders: 4,
                        sliderOpts: { circleRadius: 12, increment: 0.5}
                    },
                    targetBuilder: Puzzles.buildTargetsFromYs({
                        targetYs: [0.5,0,0.5,2],
                        targetOpts: { size: 15 } }),
                    nextScenes: nextScenes,
                    tracerLeftOpts: {
                        originGridY: 2,
                    },
                    tracerMiddleOpts: {
                        originGridY: -2,
                    }, 
                }
            })
            break
        case '2b':
            // Constant targets lead to oscillating solution: 1,-2,2,-2
            tripleGraphShipPositionLevel(gameState, {
                sliderLevelOpts: {
                    sliderSetupOpts: {
                        numSliders: 4,
                        sliderOpts: { circleRadius: 12, increment: 0.5}
                    },
                    targetBuilder: Puzzles.buildTargetsFromYs({
                        targetYs: [0.5,0.5,0.5,0.5],
                        targetOpts: { size: 15 } }),
                    nextScenes: nextScenes,
                    tracerLeftOpts: {
                        originGridY: 0,
                    },
                    tracerMiddleOpts: {
                        originGridY: 0,
                    }, 
                }
            })
            break
        case '3a':
            Puzzles.tripleGraphMathBlockLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({
                    fun: x=>x*x*x/6,
                    numTargets: 40,
                    targetOpts: {size:15},
                }),
                tracerLeftOpts: {
                    originGridY: -4/3,
                },
                tracerMiddleOpts: {
                    originGridY: 2,
                }, 
                gridSetupOpts:{

                },
                mbSetupOpts: {
                    blocks: Planet.standardBlocks('quadratic'),
                     
                },
                nextScenes: nextScenes,
            })
            break
        case '3':
            powerLevel(gameState, {numSliders:3, sliderSize:15, gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:2,
                targetFun: x => x*x*x/6, 
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '4':
            powerLevel(gameState, {numSliders:400, sliderSize:5, targetSize:10,gridYMin:-2, gridYMax:2,gridXMin:-2,gridXMax:2,tracerMiddleStart:2,
                withMathBlock:true,targetFun: x => x*x*x/6, increment:0.05,
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '5':
            Puzzles.mathBlockTutorial(gameState, {
                numTargets:20, targetFun: x=>x*x*x,blocks:blocks,
                nextScenes: pathData.nodes[sceneName].next
            })
            
            break
        case '6':
            Puzzles.mathBlockTutorial(gameState, {
                numTargets:20, targetFun: x=>-x*x*x,blocks:blocks,
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '7':
            Puzzles.mathBlockTutorial(gameState, {
                numTargets:20, targetFun: x=>-x*x*x*0.2+0.5,blocks:blocks,
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '8':
            const numSliders = 8
            const startY = -2
            Puzzles.sliderLevel(gameState, {
                numSliders: numSliders,
                targetBuilder: Puzzles.buildTargetsFromDdx({ddx: x=>x*x/2, numTargets:numSliders, targetOpts:{size:20}, startY:startY}),
                tracerOpts: {originGridY: startY},
                sliderOpts: {size:15},
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '9':
            Puzzles.drawFunctionLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>x*x*x/6, numTargets:8, targetOpts:{size:30}}),
                tracerStart: -8/6,
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '10':
            Puzzles.drawFunctionLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>-x*x*x/6, numTargets:8, targetOpts:{size:30}}),
                tracerStart: 8/6,
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '11':
            Puzzles.mathBlockLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>x*x*x/6, numTargets:8, targetOpts:{size:30}}),
                tracerOpts: {originGridY: -8/6},
                blocks: Planet.standardBlocks('power'),
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '12':{
            const numSliders = 8
            const startY = 2
            Puzzles.sliderLevel(gameState, {
                numSliders: numSliders,
                targetBuilder: Puzzles.buildTargetsFromDdx({ddx: x=>x*x*x/4, numTargets:numSliders, targetOpts:{size:20}, startY:startY}),
                tracerOpts: {originGridY: startY},
                sliderOpts: {size:15},
                nextScenes: pathData.nodes[sceneName].next
            })
        }
            break
        case '13':
            Puzzles.mathBlockLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>x*x*x*x/8, numTargets:100, targetOpts:{size:12}}),
                tracerOpts: {originGridY: 2},
                blocks: Planet.standardBlocks('power'),
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '14':
            Puzzles.mathBlockLevel(gameState, {
                targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>-x*x*x*x/4+2, numTargets:100, targetOpts:{size:12}}),
                tracerOpts: {originGridY: -2},
                blocks: Planet.standardBlocks('power'),
                nextScenes: pathData.nodes[sceneName].next
            })
            break
        case '15':
            {
                const targetBlock = new MathBlock({type:MathBlock.POWER, token:'4',originX: 100, originY: 250,})
                targetBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
                targetBlock.insert(gameState.objects, 1)

                Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({fun: targetBlock.toFunction(), numTargets:100, targetOpts:{size:12}}),
                    tracerOpts: {originGridY: targetBlock.toFunction()(-2)},
                    blocks: Planet.standardBlocks('power'),
                    sliderOpts: {maxValue:10, sliderLength:20, startValue: 1, showAxis:true, increment:1},
                    //gridOpts: {gridXMin:-4, gridYMin:-4,gridXMax:4, gridYMax:4,},
                    nextScenes: pathData.nodes[sceneName].next
                })
            }
            break
        case '16':
                {
                const targetBlock = new MathBlock({type:MathBlock.POWER, token:'5',originX: 100, originY: 250,})
                targetBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
                targetBlock.insert(gameState.objects, 1)

                Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({fun: targetBlock.toFunction(), numTargets:200, targetOpts:{size:12}}),
                    tracerOpts: {originGridY: targetBlock.toFunction()(-2)},
                    blocks: Planet.standardBlocks('power').concat([new MathBlock({type:MathBlock.POWER, token:'4'})]),
                    sliderOpts: {maxValue:10, sliderLength:20, startValue: 1, showAxis:true, increment:1},
                    //gridOpts: {gridXMin:-4 , gridYMin:-4,gridXMax:4, gridYMax:4,},
                    nextScenes: pathData.nodes[sceneName].next
                })
            }
                break
        case '17':
            {
                const targetBlock = new MathBlock({type:MathBlock.POWER, token:'6',originX: 100, originY: 250,})
                targetBlock.setChild(0, new MathBlock({type: MathBlock.VARIABLE, token:"x"})) 
                targetBlock.insert(gameState.objects, 1)

                Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({fun: targetBlock.toFunction(), numTargets:200, targetOpts:{size:12}}),
                    tracerOpts: {originGridY: 64.1},
                    blocks: Planet.standardBlocks('power').concat([
                        new MathBlock({type:MathBlock.POWER, token:'4'}),
                        new MathBlock({type:MathBlock.POWER, token:'5'})
                    ]),
                    sliderOpts: {maxValue:10, sliderLength:20, startValue: 1, showAxis:true, increment:1},
                    //gridOpts: {gridXMin:-4 , gridYMin:-4,gridXMax:4, gridYMax:4,},
                    nextScenes: pathData.nodes[sceneName].next
                })
            }
        break
    }
}


function tripleGraphShipPositionLevel (gameState, {
    sliderLevelOpts,
}){
    const {gridGroup, targetGroup, tracerLeft} =
     Puzzles.tripleGraphSliderLevel(gameState, {
        gridSetupOpts: {leftMargin: 500, topMargin: 50,
            gridOpts:{canvasWidth: 300, canvasHeight: 300, 
                gridXMin:0, gridXMax:4, xAxisLabel:'Time'},
            spacing:50},
        ...sliderLevelOpts,
    })
    const grids = gridGroup.objects
    Puzzles.setupShipPosition(gameState, {
        positionGrid: grids[0],
        velocityGrid: grids[1],
        accelerationGrid: grids[2],
        shipPositionOpts: {
            originX: 100,
            positionTracer: tracerLeft,
            positionTargetGroup: targetGroup,
        },
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

    Planet.addWinCon(gameState, ()=>tracerLeft.solved, nextButton)
    Planet.unlockScenes(nextScenes, gss)
}

