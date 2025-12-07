import { Color, Shapes } from '../util/index.js'
import * as GameObjects from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import { unlockScenes, planetScene, dialogueScene } from './Planet.js'
import * as Experiment from './Experiment.js'
import * as Planet from './Planet.js'
import * as Puzzles from './Puzzles.js'
import { buildTargetsFromYs, sliderLevel } from './Puzzles.js'
import * as FileLoading from '../util/FileLoading.js'
import { TileMap } from '../util/TileMap.js'


function linearPlanet(gameState, pathData, goTo) {
    if (!gameState.stored.completedScenes['linear.1a']){
        gameState.stored.completedScenes['linear.1a'] = 'in progress'
    }
    planetScene(gameState, {
        planetName: 'linear',
        tileMap:  new TileMap({ yTileOffset: -3, xTileOffset: -8, xImgOffset: 0, yImgOffset: 0}),
        pathData: pathData,
        bgImg: 'linearPlanetBg',
        fgImg: 'linearPlanetFg',
        goTo:goTo,
    })
}

export async function loadScene(gameState, sceneName, message={}) {
    gameState.stored.planet = 'linear'

    const pathData = await FileLoading.loadJsonFile('/data/linearPlanet.json')
    
    // Root scene
    if (!sceneName){
        linearPlanet(gameState, pathData, message.goTo)
    }

    Scene.sceneTitle(gameState, 'Linear'+' ' + (sceneName ? sceneName : 'Planet'))

    // Sub-scenes
    switch (sceneName) {
        case 'ship':{
            Scene.loadScene(gameState, 'planetMap')
        }
        break
        case '1a':{
            sliderLevel(gameState, {
                gridSetupOpts: {spacing:200, topMargin:50,
                    gridOpts:{gridXMin:0, gridXMax:1, gridYMin:0, gridYMax:1, canvasWidth:100, canvasHeight:100, arrows:false}},
                sliderSetupOpts: {
                    numSliders: 1,
                    sliderOpts: { circleRadius: 15, increment: 0.1, valueLabel:false}
                },
                targetBuilder: buildTargetsFromYs({ targetYs:  [1], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            const uiTip = {
                update: function (ctx) {
                    Color.setColor(ctx, Color.lightGray)
                    ctx.font = '20px monospace'
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'bottom'
                    Shapes.Line(ctx, 850, 520, 850, 430, 5, 'arrow', 10, true)
                    ctx.fillText('Click and drag', 820, 590)
                }
            }
            gameState.objects.push(uiTip)
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/first.txt'})
        }
            break
        case '1b':{
            sliderLevel(gameState, {
                gridSetupOpts: {spacing:400, topMargin:150,
                    gridOpts:{gridXMin:0, gridXMax:2, gridYMin:-1, gridYMax:1, canvasWidth:200, canvasHeight:200, arrows:false}},
                    sliderSetupOpts: {
                        numSliders: 2,
                        sliderOpts: { circleRadius: 15, increment: 0.1, valueLabel:false}
                    },
                    targetBuilder: buildTargetsFromYs({ targetYs:  [1,0], targetOpts: { size: 20 } }),
                    tracerOpts: { numLabel: false, originGridY: 0 },
                    nextScenes: pathData.nodes[sceneName].next
                })
            const uiTip = {
                update: function (ctx) {
                    Color.setColor(ctx, Color.lightGray)
                    ctx.font = '20px monospace'
                    ctx.textAlign = 'right'
                    ctx.textBaseline = 'middle'
                    Shapes.Line(ctx, 950, 510, 950, 440, 5, 'arrow', 10, true)
                    Shapes.Line(ctx, 950, 550, 950, 620, 5, 'arrow', 10, true)
                    ctx.fillText('Click and drag', 930, 530)
                }
            }
            gameState.objects.push(uiTip)
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/upDown.txt'})
        }
            break
        case '2a':
            sliderLevel(gameState, {
                sliderSetupOpts: {
                    numSliders: 4,
                    sliderOpts: { circleRadius: 15, increment: 1}
                },
                targetBuilder: buildTargetsFromYs({ targetYs:  [0, 1, 1, 2], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/zero.txt'})
            break
        case '2b':
            sliderLevel(gameState, {
                sliderSetupOpts: {
                    numSliders: 4,
                    sliderOpts: { circleRadius: 15, increment: 1}
                },
                targetBuilder: buildTargetsFromYs({ targetYs:  [2, 0, 1, -1], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/two.txt'})
            break
        case '2c':
            sliderLevel(gameState, {
                sliderSetupOpts: {
                    numSliders: 4,
                    sliderOpts: { circleRadius: 15, increment: 0.5}
                },
                targetBuilder: buildTargetsFromYs({ targetYs:  [0.5, 1, 0.5, 1.5], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/fraction.txt'})
            break
        case '2d':
            sliderLevel(gameState, {
                sliderSetupOpts: {
                    numSliders: 4,
                    sliderOpts: { circleRadius: 15, increment: 0.5}
                },
                targetBuilder: buildTargetsFromYs({ targetYs:  [0.5, 1, 0.5, 1.5], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 1 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/nice.txt'})
            break
        case '3a':
            sliderLevel(gameState, {
                gridSetupOpts: {gridOpts:{gridXMin:0, gridXMax: 2, gridYMin:0, gridYMax:3, canvasWidth:200,canvasHeight:300, labels:true}, spacing: 200},
                sliderSetupOpts: {
                    numSliders: 2,
                    sliderOpts: { circleRadius: 15, increment: 0.5}
                },
                targetBuilder: buildTargetsFromYs({ targetYs: [1.5,3], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/slope.txt'})
            break
        case '3b':
            sliderLevel(gameState, {
                gridSetupOpts: {gridOpts:{gridXMin:0, gridXMax: 5, gridYMin:-3, gridYMax:0, canvasWidth:500,canvasHeight:300, labels:true}, spacing: 200},
                sliderSetupOpts: {
                    numSliders: 5,
                    sliderOpts: { circleRadius: 15, increment: 0.2}
                },
                targetBuilder: buildTargetsFromYs({ targetYs: [-0.6,-1.2,-1.8,-2.4,-3], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/slope4.txt'})
            break
        case '4a':
            sliderLevel(gameState, {
                sliderSetupOpts: {
                    numSliders: 8,
                    sliderOpts: { circleRadius: 12, increment: 1}
                },
                targetBuilder: buildTargetsFromYs({ targetYs: [1, 0.5, 1, 0, -0.5, -1, -0.5, 0],
                    targetOpts: { size: 18 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/double.txt'})
            break
        case '4b':
            sliderLevel(gameState, {
                gridSetupOpts: {gridOpts:{gridXMin:-1, gridXMax: 1, gridYMin:-2,gridYMax:2, canvasWidth:200}, spacing: 200},
                sliderSetupOpts: {
                    numSliders: 6,
                    sliderOpts: { circleRadius: 12, increment: 1}
                },
                targetBuilder: buildTargetsFromYs({ targetYs: [1/3,2/3,0, 1/3,2/3,0],
                    targetOpts: { size: 18 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/triple.txt'})
            break
        case '4c':
            sliderLevel(gameState, {
                gridSetupOpts: {gridOpts:{gridXMin:-1, gridXMax: 1, gridYMin:-1, gridYMax:1}},
                sliderSetupOpts: {
                    numSliders: 8,
                    sliderOpts: { circleRadius: 15, increment: 0.5}
                },
                targetBuilder: buildTargetsFromYs({ targetYs: [0.125, 0.25, 0.375, 0.5, 0.25, 0, -0.25, -0.5], targetOpts: { size: 20 } }),
                tracerOpts: { numLabel: false, originGridY: 0 },
                nextScenes: pathData.nodes[sceneName].next
            })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/quadruple.txt'})
            break
        case '5a':
            Puzzles.shipPositionLevel(gameState, {
                sliderLevelOpts: {
                    sliderSetupOpts: {
                        numSliders: 4,
                        sliderOpts: { circleRadius: 15, increment: 0.5}
                    },
                    targetBuilder: buildTargetsFromYs({ targetYs: [0.5,1,1.5,2],
                        targetOpts: { size: 20 } }),
                    nextScenes: pathData.nodes[sceneName].next
                }
            })
            const uiTip = {
                update: function (ctx) {
                    Color.setColor(ctx, Color.lightGray)
                    ctx.font = '20px monospace'
                    ctx.textAlign = 'right'
                    ctx.textBaseline = 'middle'
                    ctx.fillText('Push to start', 275, 225)
                }
            }
            gameState.objects.push(uiTip)
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/ship.txt'})
            break
        case '5b':
            Puzzles.shipPositionLevel(gameState, {
                sliderLevelOpts: {
                    sliderSetupOpts: {
                        numSliders: 4,
                        sliderOpts: { circleRadius: 15, increment: 0.5}
                    },
                    targetBuilder: buildTargetsFromYs({ targetYs: [-1,-2,0,2],
                        targetOpts: { size: 20 } }),
                    nextScenes: pathData.nodes[sceneName].next
                }
            })
            break
        case '5c':
            Puzzles.shipPositionLevel(gameState, {
                sliderLevelOpts: {
                    sliderSetupOpts: {
                        numSliders: 4,
                        sliderOpts: { circleRadius: 15, increment: 0.5}
                    },
                    targetBuilder: buildTargetsFromYs({ targetYs: [1,2,0,-2],
                        targetOpts: { size: 20 } }),
                        nextScenes: pathData.nodes[sceneName].next
                    },
                hidePositionTargets:true,
            })
            break
        case '5d':
            Puzzles.shipPositionLevel(gameState, {
                sliderLevelOpts: {
                    // sliderSetupOpts: {
                    //     numSliders: 4,
                    //     sliderOpts: { circleRadius: 15, increment: 0.5}
                    // },
                    // targetBuilder: buildTargetsFromYs({ targetYs: [2,1.5,1,1],
                    //     targetOpts: { size: 20 } }),
                    //
                    // },
                    sliderSetupOpts: {
                        numSliders: 8,
                        sliderOpts: { circleRadius: 12, increment: 0.5}
                    },
                    targetBuilder: buildTargetsFromYs({ targetYs: [0.25, 0.5, 0.75, 1, 0.5, 0, 0.5, 1],
                        targetOpts: { size: 20 } }),
                    nextScenes: pathData.nodes[sceneName].next
                    },
                hidePositionTargets:true,
            })
            break
        case '6a':
            mathBlockTutorials(gameState, { targetVals: [1, 1, 1, 1, 1, 1, 1, 1], 
                nextScenes: pathData.nodes[sceneName].next,
                withUITip: true })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/constantBlock.txt'})
            break
        case '6b':
            mathBlockTutorials(gameState, { targetVals: [-1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5], nextScenes: ["linear.7a"] })
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/constantBlock2.txt'})
            break
        case '7a':
            {
                const targetBlock = new GameObjects.MathBlock({ type: GameObjects.MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                targetBlock.insert(gameState.objects, 1)

                const fLabel = new GameObjects.TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                const ddxLabel = new GameObjects.TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 250, content: 'f\'(x)=' })
                fLabel.insert(gameState.objects, 0)
                ddxLabel.insert(gameState.objects, 0)

                const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                    blocks: Planet.standardBlocks('linear'),
                    sliderOpts: { showAxis:true, increment: 0.5 },
                    //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                    tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                    nextScenes: pathData.nodes[sceneName].next
                })
                sySlider.hidden = true
            }
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative.txt'})
            break
        case '7b':
            {
                const targetBlock = new GameObjects.MathBlock({ type: GameObjects.MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                targetBlock.scaleY = 0.5
                targetBlock.insert(gameState.objects, 1)

                const fLabel = new GameObjects.TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                const ddxLabel = new GameObjects.TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 100, content: 'f\'(x)=' })
                fLabel.insert(gameState.objects, 0)
                ddxLabel.insert(gameState.objects, 0)

                const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                    blocks: Planet.standardBlocks('linear'),
                    sliderOpts: { showAxis:true, increment: 0.5 },
                    //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                    tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                    nextScenes: pathData.nodes[sceneName].next
                })
                sySlider.hidden = true
            }
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative2.txt'})
            break
        case '7c':
            {
                const targetBlock = new GameObjects.MathBlock({ type: GameObjects.MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                targetBlock.translateY = -3
                targetBlock.scaleY = -2
                targetBlock.insert(gameState.objects, 1)

                const fLabel = new GameObjects.TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                const ddxLabel = new GameObjects.TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 100, content: 'f\'(x)=' })
                fLabel.insert(gameState.objects, 0)
                ddxLabel.insert(gameState.objects, 0)

                const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                    blocks: Planet.standardBlocks('linear'),
                    sliderOpts: { showAxis:true, increment: 0.5 },
                    //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                    tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                    nextScenes: pathData.nodes[sceneName].next
                })
                sySlider.hidden = true
            }
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative3.txt'})
            break
        case '7d':
            {
                const targetBlock = new GameObjects.MathBlock({ type: GameObjects.MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                targetBlock.scaleY = 1.5
                targetBlock.translateY = 2
                targetBlock.insert(gameState.objects, 1)

                const fLabel = new GameObjects.TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                const ddxLabel = new GameObjects.TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 100, content: 'f\'(x)=' })
                fLabel.insert(gameState.objects, 0)
                ddxLabel.insert(gameState.objects, 0)

                const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                    targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                    blocks: Planet.standardBlocks('linear'),
                    sliderOpts: { showAxis:true, increment: 0.5 },
                    //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                    tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                    nextScenes: pathData.nodes[sceneName].next
                })
                sySlider.hidden = true
            }
            Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative4.txt'})
            Puzzles.planetUnlockOnSolve(gameState, {planetUnlock: 'quadratic'})
            break
    }
}


function mathBlockTutorials(gameState, {
    targetVals, tracerStart = 0,
    targetSize = 20, sliderSize = 15,
    nextScenes, withLinear = false,
    withUITip = false,
}) {
    const gss = gameState.stored
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, nextScenes)

    const grid = new GameObjects.Grid({
        canvasX: 600, canvasY: 350, canvasWidth: 400, canvasHeight: 400,
        gridXMin: -2, gridYMin: -2, gridXMax: 2, gridYMax: 2, labels: false, arrows: true
    })

    const spacing = grid.gridWidth / targetVals.length

    var targets = []
    for (let i = 0; i < targetVals.length; i++) {
        targets.push(new GameObjects.Target({ grid: grid, gridX: grid.gridXMin + (i + 1) * spacing, gridY: targetVals[i], size: targetSize }))
    }

    const functionTracer = new GameObjects.FunctionTracer({ grid: grid, targets: targets, solvable: true, numLabel: false })

    const blocks = [
        new GameObjects.MathBlock({ type: GameObjects.MathBlock.CONSTANT }),
    ]
    if (withLinear) blocks.push(new GameObjects.MathBlock({ type: GameObjects.MathBlock.VARIABLE, token: 'x' }))
    const sySlider = new GameObjects.Slider({ canvasX: 1200, canvasY: 350, maxValue: 2, sliderLength: 4, startValue: 1, showAxis: true, valueLabel: false })
    const tySlider = new GameObjects.Slider({ canvasX: withLinear ? 1300 : 1200, canvasY: 350, maxValue: 2, sliderLength: 4, showAxis: true, valueLabel: false, increment:0.5, })

    const mbField = new GameObjects.MathBlockField({ minX: 600, minY: 100, maxX: 1000, maxY: 300 })
    const mbm = new GameObjects.MathBlockManager({
        blocks: blocks, toolBarX: 1150, toolBarY: 150, outputType: "sliders",
        scaleYSlider: sySlider, translateYSlider: tySlider,
        blockFields: [mbField],
        funTracers: [functionTracer],
    })

    const uiTip = {
        update: function (ctx) {
            if (!withUITip) return
            Color.setColor(ctx, Color.lightGray)
            Shapes.Line(ctx, 1130, 180, 1030, 180, 5, 'arrow', 10, true)
            ctx.font = '20px monospace'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'bottom'
            ctx.fillText('drag and drop', 1030, 120)

            if (mbField.rootBlock != null) {
                Shapes.Line(ctx, 1250, 550, 1250, 450, 5, 'arrow', 10, true)
                ctx.font = '20px monospace'
                ctx.textAlign = 'left'
                ctx.textBaseline = 'bottom'
                ctx.fillText('click and drag', 1270, 500)
            }
        }
    }

    if (!withLinear) {
        sySlider.hidden = true
        mbm.scaleIcon.hidden = true
    }


    gameState.update = () => {
        functionTracer.solvable = !sySlider.grabbed && !tySlider.grabbed
    }

    gameState.objects = [grid, functionTracer, backButton, nextButton, mbm, sySlider, tySlider, uiTip].concat(targets)
    Planet.addWinCon(gameState, () => functionTracer.solved, nextButton, nextScenes)
}


