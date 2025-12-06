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


async function linearPlanet(gameState) {
    planetScene(gameState, {
        planetName: 'Linear',
        tileMap:  new TileMap({ yTileOffset: -3, xTileOffset: -8, xImgOffset: 0, yImgOffset: 0}),
        pathData: await FileLoading.loadJsonFile('/data/linearPlanet.json'),
        bgImg: 'linearPlanetBg',
        fgImg: 'linearPlanetFg',
    })
}

/**
 * Lookup table for scenes
 */
const sceneTable = {
    '1a' : () => {
        sliderLevel(gameState, {
            gridSetupOpts: {spacing:200, topMargin:50,
                gridOpts:{gridXMin:0, gridXMax:1, gridYMin:0, gridYMax:1, canvasWidth:100, canvasHeight:100, arrows:false}},
            sliderSetupOpts: {
                numSliders: 1,
                sliderOpts: { circleRadius: 15, increment: 0.1, valueLabel:false}
            },
            targetBuilder: buildTargetsFromYs({ targetYs:  [1], targetOpts: { size: 20 } }),
            tracerOpts: { numLabel: false, originGridY: 0 },
            nextScenes: ["linear.puzzle.1b"]
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
    },
}


export function loadScene(gameState, sceneName, message = {}) {
    gameState.stored.planet = 'linear'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        linearPlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch (sceneNameSplit[1]) {
        case "puzzle":
            switch (sceneNameSplit[2]) {
                case '1a':{
                    //linearPuzzle1(gameState, { nextScenes: ["linear.puzzle.1b"] })
                    sliderLevel(gameState, {
                        gridSetupOpts: {spacing:200, topMargin:50,
                            gridOpts:{gridXMin:0, gridXMax:1, gridYMin:0, gridYMax:1, canvasWidth:100, canvasHeight:100, arrows:false}},
                        sliderSetupOpts: {
                            numSliders: 1,
                            sliderOpts: { circleRadius: 15, increment: 0.1, valueLabel:false}
                        },
                        targetBuilder: buildTargetsFromYs({ targetYs:  [1], targetOpts: { size: 20 } }),
                        tracerOpts: { numLabel: false, originGridY: 0 },
                        nextScenes: ["linear.puzzle.1b"]
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
                            nextScenes: ["linear.puzzle.2a"]
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
                        nextScenes: ["linear.puzzle.2b", "linear.puzzle.2c", "linear.puzzle.2d", "linear.puzzle.3a"]
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
                        nextScenes: ["linear.puzzle.2c"]
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
                        nextScenes: ["linear.puzzle.2d"]
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
                        nextScenes: ["linear.puzzle.3a"]
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
                        nextScenes: ["linear.puzzle.3b", "linear.puzzle.4a"]
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
                        nextScenes: ["linear.puzzle.4a"],
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
                        nextScenes:  ["linear.puzzle.4b", "linear.puzzle.4c", "linear.puzzle.5a"],
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
                        nextScenes: ["linear.puzzle.4c"],
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
                        nextScenes: ["linear.puzzle.5a"],
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
                            nextScenes: ["linear.puzzle.5b","linear.puzzle.5c","linear.puzzle.5d","linear.puzzle.6a"],
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
                            nextScenes: ["linear.puzzle.5c"],
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
                                nextScenes: ["linear.puzzle.5d"],
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
                            nextScenes: ["linear.puzzle.6a"],
                            },
                        hidePositionTargets:true,
                    })
                    break
                case '6a':
                    mathBlockTutorials(gameState, { targetVals: [1, 1, 1, 1, 1, 1, 1, 1], 
                        nextScenes: ["linear.puzzle.6b", "linear.puzzle.7a"], withUITip: true })
                    Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/constantBlock.txt'})
                    break
                case '6b':
                    mathBlockTutorials(gameState, { targetVals: [-1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5], nextScenes: ["linear.puzzle.7a"] })
                    Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/constantBlock2.txt'})
                    break
                case '7a':
                    {
                        const targetBlock = new MathBlock({ type: MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                        targetBlock.insert(gameState.objects, 1)

                        const fLabel = new TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                        const ddxLabel = new TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 250, content: 'f\'(x)=' })
                        fLabel.insert(gameState.objects, 0)
                        ddxLabel.insert(gameState.objects, 0)

                        const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                            targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                            blocks: Planet.standardBlocks('linear'),
                            sliderOpts: { showAxis:true, increment: 0.5 },
                            //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                            tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                            nextScenes: ['linear.puzzle.7b', 'linear.puzzle.7c', 'linear.puzzle.7d'],
                        })
                        sySlider.hidden = true
                    }
                    Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative.txt'})
                    break
                case '7b':
                    {
                        const targetBlock = new MathBlock({ type: MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                        targetBlock.scaleY = 0.5
                        targetBlock.insert(gameState.objects, 1)

                        const fLabel = new TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                        const ddxLabel = new TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 100, content: 'f\'(x)=' })
                        fLabel.insert(gameState.objects, 0)
                        ddxLabel.insert(gameState.objects, 0)

                        const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                            targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                            blocks: Planet.standardBlocks('linear'),
                            sliderOpts: { showAxis:true, increment: 0.5 },
                            //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                            tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                            nextScenes: ['linear.puzzle.7c'],
                        })
                        sySlider.hidden = true
                    }
                    Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative2.txt'})
                    break
                case '7c':
                    {
                        const targetBlock = new MathBlock({ type: MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                        targetBlock.translateY = -3
                        targetBlock.scaleY = -2
                        targetBlock.insert(gameState.objects, 1)

                        const fLabel = new TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                        const ddxLabel = new TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 100, content: 'f\'(x)=' })
                        fLabel.insert(gameState.objects, 0)
                        ddxLabel.insert(gameState.objects, 0)

                        const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                            targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                            blocks: Planet.standardBlocks('linear'),
                            sliderOpts: { showAxis:true, increment: 0.5 },
                            //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                            tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                            nextScenes: ['linear.puzzle.7d'],
                        })
                        sySlider.hidden = true
                    }
                    Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative3.txt'})
                    break
                case '7d':
                    {
                        const targetBlock = new MathBlock({ type: MathBlock.VARIABLE, token: 'x', originX: 200, originY: 250, })
                        targetBlock.scaleY = 1.5
                        targetBlock.translateY = 2
                        targetBlock.insert(gameState.objects, 1)

                        const fLabel = new TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
                        const ddxLabel = new TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 100, content: 'f\'(x)=' })
                        fLabel.insert(gameState.objects, 0)
                        ddxLabel.insert(gameState.objects, 0)

                        const {sySlider} = Puzzles.mathBlockLevel(gameState, {
                            targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
                            blocks: Planet.standardBlocks('linear'),
                            sliderOpts: { showAxis:true, increment: 0.5 },
                            //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
                            tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
                            nextScenes: ['planetMap'],
                        })
                        sySlider.hidden = true
                    }
                    Puzzles.dialogueOnSolve(gameState, {filePath: './dialogue/linear/derivative4.txt'})
                    Puzzles.planetUnlockOnSolve(gameState, {planetUnlock: 'quadratic'})
                    break

            }
            break

        case 'dialogue':
            linearPlanet(gameState)
            switch (sceneNameSplit[2]) {
                case '1':
                    {
                        const gss = gameState.stored
                        const planetUnlock = 'quadratic'
                        // TODO make a planet unlock function
                        if (gss.planetProgress[planetUnlock] == null || gss.planetProgress[planetUnlock] == 'locked')
                            gss.planetProgress[[planetUnlock]] = 'unvisited'

                        if (gss.navPuzzleMastery[gss.planet] == null) {
                            gss.navPuzzleMastery[gss.planet] = 0
                        }
                        dialogueScene(gameState, { nextScenes: ["planetMap"], filePath: './dialogue/linear5.txt' })
                    }
                    break
            }
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

    const grid = new Grid({
        canvasX: 600, canvasY: 350, canvasWidth: 400, canvasHeight: 400,
        gridXMin: -2, gridYMin: -2, gridXMax: 2, gridYMax: 2, labels: false, arrows: true
    })

    const spacing = grid.gridWidth / targetVals.length

    var targets = []
    for (let i = 0; i < targetVals.length; i++) {
        targets.push(new Target({ grid: grid, gridX: grid.gridXMin + (i + 1) * spacing, gridY: targetVals[i], size: targetSize }))
    }

    const functionTracer = new FunctionTracer({ grid: grid, targets: targets, solvable: true, numLabel: false })

    const blocks = [
        new MathBlock({ type: MathBlock.CONSTANT }),
    ]
    if (withLinear) blocks.push(new MathBlock({ type: MathBlock.VARIABLE, token: 'x' }))
    const sySlider = new Slider({ canvasX: 1200, canvasY: 350, maxValue: 2, sliderLength: 4, startValue: 1, showAxis: true, valueLabel: false })
    const tySlider = new Slider({ canvasX: withLinear ? 1300 : 1200, canvasY: 350, maxValue: 2, sliderLength: 4, showAxis: true, valueLabel: false, increment:0.5, })

    const mbField = new MathBlockField({ minX: 600, minY: 100, maxX: 1000, maxY: 300 })
    const mbm = new MathBlockManager({
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


