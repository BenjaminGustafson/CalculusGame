// import {Color, Shapes} from '../util/index.js'
// import { Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
// import * as Scene from '../Scene.js'
// import * as GameObjects from '../GameObjects/index.js'
// import { GameObject } from '../GameObjects/GameObject.js'
// import * as Planet from './Planet.js'
// import * as Experiment from './Experiment.js'
// import * as Puzzles from './Puzzles.js'


// const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// // [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// // SW 0,1 NW -1,0 NE 0,-1 SE 1,0
// const nodes = {
//     'planetMap':        [5,1, 0,-1],
//     'quadratic.puzzle.1a': [6,1, 0,-1],
//     'quadratic.puzzle.1b': [7,1, 0,-1],
//     'quadratic.puzzle.1c': [8,1, 0,-1],
//     'quadratic.puzzle.1d': [9,1, 0,-1],

//     'quadratic.puzzle.2a': [10,1, 0,-1],
//     'quadratic.puzzle.2b': [11,1, 0,-1],
//     'quadratic.puzzle.2c': [12,1, 0,-1],

//     'quadratic.puzzle.3a': [14,1, 0,-1],
//     'quadratic.puzzle.3b': [15,1, 0,-1],
//     'quadratic.puzzle.3c': [16,1, 0,-1],
//     'quadratic.puzzle.3d': [17,1, 0,-1],

//     'quadratic.puzzle.4a': [17,3, 0,-1],
//     'quadratic.puzzle.4b': [16,3, 0,-1],
//     'quadratic.puzzle.4c': [15,3, 0,-1],
//     'quadratic.puzzle.4d': [14,3, 0,-1],

//     'quadratic.puzzle.5a': [13,3, 0,-1],
//     'quadratic.puzzle.5b': [12,3, 0,-1],
//     'quadratic.puzzle.5c': [11,3, 0,-1],
//     'quadratic.puzzle.5d': [10,3, 0,-1],

//     'quadratic.puzzle.6a': [9,3, 0,-1],
//     'quadratic.puzzle.6b': [8,3, 0,-1],
//     'quadratic.puzzle.6c': [7,3, 0,-1],
//     'quadratic.puzzle.6d': [6,3, 0,-1],
// }

// const paths = 
// [
//     {start: 'planetMap', end: 'quadratic.puzzle.1a'},
    
//     { start: 'quadratic.puzzle.1a', end: 'quadratic.puzzle.1b', steps: [] },
//     { start: 'quadratic.puzzle.1b', end: 'quadratic.puzzle.1c', steps: [] },
//     { start: 'quadratic.puzzle.1c', end: 'quadratic.puzzle.1d', steps: [] },
//     { start: 'quadratic.puzzle.1d', end: 'quadratic.puzzle.2a', steps: [] },

//     { start: 'quadratic.puzzle.2a', end: 'quadratic.puzzle.2b', steps: [] },
//     { start: 'quadratic.puzzle.2b', end: 'quadratic.puzzle.2c', steps: [] },
//     { start: 'quadratic.puzzle.2c', end: 'quadratic.puzzle.3a', steps: [] },

//     { start: 'quadratic.puzzle.3a', end: 'quadratic.puzzle.3b', steps: [] },
//     { start: 'quadratic.puzzle.3b', end: 'quadratic.puzzle.3c', steps: [] },
//     { start: 'quadratic.puzzle.3c', end: 'quadratic.puzzle.3d', steps: [] },
//     { start: 'quadratic.puzzle.3d', end: 'quadratic.puzzle.4a', steps: [] },

//     { start: 'quadratic.puzzle.4a', end: 'quadratic.puzzle.4b', steps: [] },
//     { start: 'quadratic.puzzle.4b', end: 'quadratic.puzzle.4c', steps: [] },
//     { start: 'quadratic.puzzle.4c', end: 'quadratic.puzzle.4d', steps: [] },
//     { start: 'quadratic.puzzle.4d', end: 'quadratic.puzzle.5a', steps: [] },
    
//     { start: 'quadratic.puzzle.5a', end: 'quadratic.puzzle.5b', steps: [] },
//     { start: 'quadratic.puzzle.5b', end: 'quadratic.puzzle.5c', steps: [] },
//     { start: 'quadratic.puzzle.5c', end: 'quadratic.puzzle.5d', steps: [] },
//     { start: 'quadratic.puzzle.5d', end: 'quadratic.puzzle.6a', steps: [] },

//     { start: 'quadratic.puzzle.6a', end: 'quadratic.puzzle.6b', steps: [] },
//     { start: 'quadratic.puzzle.6b', end: 'quadratic.puzzle.6c', steps: [] },
//     { start: 'quadratic.puzzle.6c', end: 'quadratic.puzzle.6d', steps: [] },
//     { start: 'quadratic.puzzle.6d', end: 'quadratic.puzzle.1a', steps: [] },
    
// ]


// export function loadScene(gameState, sceneName, message = {}){
//     gameState.stored.planet = 'quadratic'

//     const sceneNameSplit = sceneName.toLowerCase().split('.')

//     // Main scene
//     if (sceneNameSplit.length == 1) {
//         quadraticPlanet(gameState, message)
//         return
//     }

//     // Sub-scenes
//     switch(sceneNameSplit[1]){
//         case "puzzle": 
//             switch(sceneNameSplit[2]){
//                 case '1a':{
//                     Puzzles.drawFunctionLevel(gameState, {
//                         targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[1], targetOpts:{size:50}}),
//                         nextScenes: ['quadratic.puzzle.1b', 'quadratic.puzzle.1c', 'quadratic.puzzle.1d', 'quadratic.puzzle.2a',]
                        
//                     })
//                     const uiTip = {
//                         update: function(ctx){
//                             Color.setColor(ctx, Color.lightGray)
//                             ctx.font = '20px monospace'
//                             ctx.textAlign = 'left'
//                             ctx.textBaseline = 'bottom'
//                             ctx.fillText('Click and drag to draw.',900,320)
//                         }
//                     }
//                     gameState.objects.push(uiTip)
//                 }
//                     break
//                 case '1b':
//                     Puzzles.drawFunctionLevel(gameState, {
//                         targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[-1,0], targetOpts:{size:50}}),
//                         nextScenes: ['quadratic.puzzle.1c']
//                     })
//                     break
//                 case '1c':
//                     Puzzles.drawFunctionLevel(gameState, {
//                         targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[0.5,1,1.5,2], targetOpts:{size:40}}),
//                         nextScenes: ['quadratic.puzzle.1d']
//                     })
//                     break
//                 case '1d':
//                     Puzzles.drawFunctionLevel(gameState, {
//                         tracerStart: 1,
//                         targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[-0.5,-1,-0.5,1], targetOpts:{size:40}}),
//                         nextScenes: ['quadratic.puzzle.2a']
//                     })
//                     break
//                 case '2a': 
//                 {
//                     Puzzles.mathBlockTutorial(gameState, {
//                         targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>0.5*x, numTargets: 10, targetOpts: {}}),
//                         mathBlockSetupOpts: {
//                             blocks: Planet.standardBlocks('quadratic'),
//                         },
//                         nextScenes: ['quadratic.puzzle.2b', 'quadratic.puzzle.2c', 'quadratic.puzzle.3a'],
//                     })
//                 }
//                 break
//                 case '2b':
//                 {
//                     Puzzles.mathBlockTutorial(gameState, {
//                         targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>0.5*x+1, numTargets: 10, targetOpts: {}}),
//                         mathBlockSetupOpts: {
//                             blocks: Planet.standardBlocks('quadratic'),
//                         },
//                         nextScenes: ['quadratic.puzzle.2c'],
//                     })
//                 }
//                 break
//                 case '2c':
//                 {
//                     Puzzles.mathBlockTutorial(gameState, {
//                         targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>-x-1, numTargets: 10, targetOpts: {}}),
//                         mathBlockSetupOpts: {
//                             blocks: Planet.standardBlocks('quadratic'),
//                         },
//                         nextScenes: ['quadratic.puzzle.3a'],
//                     })
//                 }
//                 break
//                 case '3a':
//                     {
//                         const numSliders = 4
//                         const tracerStart = 2
//                         Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 100},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.25},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: [ 'quadratic.puzzle.3b','quadratic.puzzle.3c','quadratic.puzzle.3d','quadratic.puzzle.4a',],
//                         })
//                     }
//                     break
//                 case '3b':
//                     {
//                         const numSliders = 8
//                         const tracerStart = 2
//                         Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 100},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.25},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.3c', ],
//                         })
//                     }
//                     break
//                 case '3c':
//                     {
//                         const numSliders = 16
//                         const tracerStart = 2
//                         const {sliderGroup} = Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 200, rightMargin:300},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.25},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.3d', ],
//                         })
//                         Puzzles.addMathBlocksToSliderLevel(gameState, {
//                             mbSliderOpts: {},
//                             sliders: sliderGroup.objects,
//                             blocks : Planet.standardBlocks('quadratic'),
//                         })
//                     }
//                     //quadDiscLevel(gameState, {numSliders:20, withMathBlock:true, nextScenes:["quadratic.puzzle.8"], ddx: x=>x, tracerStart:2})
//                     break
//                 case '3d':
//                     {
//                         const numSliders = 40
//                         const tracerStart = 2
//                         const {sliderGroup} = Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 200, rightMargin:300},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.1, circleRadius: 5},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, 
//                                 targetOpts:{size:10}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.4a', 'quadratic.puzzle.4b','quadratic.puzzle.4c','quadratic.puzzle.4d',],
//                         })
//                         Puzzles.addMathBlocksToSliderLevel(gameState, {
//                             mbSliderOpts: {},
//                             sliders: sliderGroup.objects,
//                             blocks : Planet.standardBlocks('quadratic'),
//                         })
//                     }
//                     //quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10, withMathBlock:true, nextScenes:["quadratic.puzzle.9"]})
//                     break
//                 case '4a':
//                     {
//                         const numSliders = 8
//                         const tracerStart = -1
//                         Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 100},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.25},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>-x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.4b',],
//                         })
//                     }
//                     //quadDiscLevel(gameState, {numSliders:8, nextScenes:["quadratic.puzzle.10"], ddx: x=> -x, tracerStart:-1})
//                     break
//                 case '4b':
//                     {
//                         const numSliders = 40
//                         const tracerStart = -1
//                         const {sliderGroup} = Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 200, rightMargin:300},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.1, circleRadius: 5, clickable:true},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({
//                                 ddx:x=>-x, numTargets: numSliders, startY:tracerStart, 
//                                 targetOpts:{size:10}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.4c', ],
//                         })
//                         Puzzles.addMathBlocksToSliderLevel(gameState, {
//                             mbSliderOpts: {},
//                             sliders: sliderGroup.objects,
//                             blocks : Planet.standardBlocks('quadratic'),
//                         })
//                     } 
//                 //quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
//                     //    withMathBlock:true, nextScenes:["quadratic.puzzle.11"], ddx: x=> -x, tracerStart:-1})
//                     break
//                 case '4c': 
//                     {
//                         const numSliders = 40
//                         const tracerStart = 0
//                         const {sliderGroup} = Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 200, rightMargin:300},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.1, circleRadius: 5, clickable:true},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({
//                                 ddx:x=>-0.5*x,
//                                 numTargets: numSliders,
//                                 startY:tracerStart, 
//                                 targetOpts:{size:10}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.4d'],
//                         })
//                         Puzzles.addMathBlocksToSliderLevel(gameState, {
//                             mbSliderOpts: {},
//                             sliders: sliderGroup.objects,
//                             blocks : Planet.standardBlocks('quadratic'),
//                         })
//                     } 
//                     // quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
//                     //     withMathBlock:true, nextScenes:["quadratic.puzzle.12"], ddx: x=> -0.5*x, tracerStart:0})
//                     break
//                 case '4d':
//                     {
//                         const numSliders = 40
//                         const tracerStart = 0.4
//                         const {sliderGroup} = Puzzles.sliderLevel(gameState, {
//                             gridSetupOpts: {topMargin: 200, rightMargin:300},
//                             sliderSetupOpts:{
//                                 numSliders:numSliders,
//                                 sliderOpts: {increment: 0.1, circleRadius: 5, clickable:true},
//                             },
//                             targetBuilder:Puzzles.buildTargetsFromDdx({
//                                 ddx:x=>0.2*x,
//                                 numTargets: numSliders,
//                                 startY:tracerStart, 
//                                 targetOpts:{size:10}}),
//                             tracerOpts: {originGridY:tracerStart},
//                             nextScenes: ['quadratic.puzzle.5a', ],
//                         })
//                         Puzzles.addMathBlocksToSliderLevel(gameState, {
//                             mbSliderOpts: {},
//                             sliders: sliderGroup.objects,
//                             blocks : Planet.standardBlocks('quadratic'),
//                         })
//                     } 
//                     break
//                 case '5a':{
//                     gravityPuzzle(gameState, {
//                         gravity: 2,
//                         initPos: 2,
//                         nextScenes: ["quadratic.puzzle.5b","quadratic.puzzle.5c","quadratic.puzzle.5c","quadratic.puzzle.6a"],
//                     })
//                 }
//                     break
//                 case '5b':{
//                     gravityPuzzle(gameState, {
//                         gravity: 0.5,
//                         initPos: 2,
//                         nextScenes: ["quadratic.puzzle.5c"],
//                     })
//                 }
//                     break
//                 case '5c':{
//                     gravityPuzzle(gameState, {
//                         gravity: 3,
//                         initPos: 1.5,
//                         nextScenes: ["quadratic.puzzle.5d"],
//                     })
//                 }
//                     break
//                 case '5d':{
//                     gravityPuzzle(gameState, {
//                         gravity: 1.5,
//                         initPos: 1,
//                         nextScenes: ["quadratic.puzzle.6a"],
//                     })
//                 }
//                     break
//                 case '6a':
//                     quadMathBlockLevel(gameState, {
//                         scaleY: 1,
//                         translateY : -2,
//                         nextScenes: ['quadratic.puzzle.6b', 'quadratic.puzzle.6c', 'quadratic.puzzle.6d'],
//                     })
//                 break
//                 case '6b':
//                     quadMathBlockLevel(gameState, {
//                         scaleY: 0.75,
//                         translateY : -1,
//                         nextScenes: ['quadratic.puzzle.6c',],
//                     })
//                 break
//                 case '6c':
//                     quadMathBlockLevel(gameState, {
//                         scaleY: -0.5,
//                         translateY : 1.5,
//                         nextScenes: ['quadratic.puzzle.6d',],
//                     })
//                 break
//                 case '6d':
//                     quadMathBlockLevel(gameState, {
//                         scaleY: 0.25,
//                         translateY : 0,
//                         nextScenes: ['planetMap',],
//                     })
//                 break

//             }
//         break
//     }
// }

// function quadMathBlockLevel(gameState, {
//     scaleY,
//     translateY,
//     nextScenes,
// }){
//     const targetBlock = new MathBlock({ type: MathBlock.POWER, token: '2', originX: 200, originY: 250, }) 
//     const xBlock = new MathBlock({ type: MathBlock.VARIABLE, token: 'x'})
//     targetBlock.scaleY = scaleY
//     targetBlock.translateY = translateY
//     targetBlock.setChild(0, xBlock)
//     targetBlock.insert(gameState.objects, 1)

//     const fLabel = new TextBox({ font: '30px monospace', baseline: 'top', originX: 100, originY: 250, content: 'f(x)=' })
//     const ddxLabel = new TextBox({ font: '30px monospace', align: 'right', baseline: 'top', originX: 680, originY: 200, content: 'f\'(x)=' })
//     fLabel.insert(gameState.objects, 0)
//     ddxLabel.insert(gameState.objects, 0)

//     const {sySlider} = Puzzles.mathBlockLevel(gameState, {
//         targetBuilder: Puzzles.buildTargetsFromFun({ fun: targetBlock.toFunction(), numTargets: 100, targetOpts: { size: 12 } }),
//         blocks: Planet.standardBlocks('quadratic'),
//         sliderOpts: { showAxis:true, increment: 0.5 },
//         //gridOpts: {gridXMin:-5 , gridYMin:-5,gridXMax:5, gridYMax:5,},
//         tracerOpts: { originGridY: targetBlock.toFunction()(-2) },
//         nextScenes: nextScenes,
//     })
// }

// function quadraticPlanet(gameState,message={}){
//     Planet.planetScene(gameState, {
//         planetName:'quadratic',
//         shipX:10, shipY: -200,
//         tileMap:tileMap,
//         playerNodes:nodes,
//         playerPaths:paths,
//         bgImg: 'quadPlanetBg',
//         fgImg: 'placeholderFg',
//         firstScene: 'quadratic.puzzle.1a',
//         message
//     })
// }

// function gravityPuzzle(gameState, {
//     gridSetupOpts,
//     nextScenes,
//     initPos=2, gravity=1,
// }){
//     const gridGroup = Puzzles.gridSetup(gameState, {
//         numGrids: 2,
//         leftMargin: 450, topMargin: 200, 
//         gridOpts:{gridXMin:0, gridXMax:4, xAxisLabel:'Time t'},
//         spacing:50,
//         ...gridSetupOpts,
//     })
//     const grids = gridGroup.objects
//     grids[0].gridTitle = 'Position'
//     grids[1].gridTitle = 'Velocity'

//     const targets = Puzzles.targetsFromFun(gameState, {
//         fun: x => initPos - gravity * x*x / 2,
//         grid: grids[0],
//         numTargets: 50,
//         targetOpts: {size: 20},
//     }).objects

//     const positionTracer = new FunctionTracer({
//         grid: grids[0], animated:true, 
//         autoStart:false,
//         targets:targets
//     })
//     positionTracer.insert(gameState.objects, 1)

//     const velocityTracer = new FunctionTracer({
//         grid: grids[1], animated:true, 
//         autoStart:false,
//     })
//     velocityTracer.insert(gameState.objects, 1)

//     const ship = new GravityShip({
//         originX: 125,
//         originY: grids[0].canvasY,
//         positionGrid: grids[0],
//         positionTracer: positionTracer,
//         velocityTracer: velocityTracer,
//     })
//     ship.insert(gameState.objects,1)

//     Planet.levelNavigation(gameState, {
//         winCon: () => positionTracer.solved,
//         nextScenes: nextScenes,
//     })
// }

// class GravityShip extends GameObject {
//     constructor({
//         originX,
//         originY,
//         positionGrid,
//         positionTracer,
//         velocityTracer,
//     }){
//         super()
//         Object.assign(this, { originX, originY, positionGrid, positionTracer, velocityTracer})
        
//         const shipScale = 0.6
//         this.shipImage = new GameObjects.ImageObject({
//             originX: this.originX + 20,
//             originY: this.originY,
//             height:55*shipScale,
//             width:200*shipScale, 
//             id : 'shipSide',
//         })
//         // Ground image

//         this.gravitySlider = new GameObjects.Slider({
//             canvasX: originX,
//             canvasY: originY - positionGrid.canvasHeight * 0.2, 
//             vertical: false,
//             minValue: 0,
//             maxValue: 3,
//             startValue:1,
//             increment:0.1,
//             name: 'Gravity'
//         })

//         const pSliderIncrement = 0.1
//         this.positionSlider = new GameObjects.Slider({
//             canvasX: originX,
//             canvasY: originY, 
//             minValue: positionGrid.gridYMin,
//             maxValue: positionGrid.gridYMax,
//             increment: pSliderIncrement,
//         })

//         this.initPos = 0

//         this.playPauseButton = new GameObjects.Button({
//             originX: this.originX + this.positionGrid.canvasWidth/2 - 30, 
//             originY: this.originY - positionGrid.canvasHeight * 0.4,
//             width: 50,
//             height: 50,
//             onclick: () => {
//                 // Play
//                 if (this.positionTracer.state == GameObjects.FunctionTracer.STOPPED_AT_BEGINNING) {
//                     this.positionSlider.clickable = false
//                     this.gravitySlider.clickable = false

//                     this.initPos = this.positionSlider.value
//                     this.positionSlider.increment = 0.001

//                     this.positionTracer.setInputFunction(x => this.initPos - this.gravitySlider.value * x*x / 2)
//                     this.velocityTracer.setInputFunction(x => - this.gravitySlider.value * x)

//                     this.positionTracer.start()
//                     this.velocityTracer.start()
//                 } else {
//                     this.positionSlider.clickable = true
//                     this.gravitySlider.clickable = true

//                     this.positionSlider.setValue(this.initPos)
//                     this.positionSlider.increment = pSliderIncrement

//                     this.positionTracer.reset()
//                     this.velocityTracer.reset()
//                 } 
//             },
//             label: "⏵", lineWidth: 5
//         })
//     }

//     update(ctx, audio, mouse) {
//         // Ship position
//         this.shipImage.originY = this.positionSlider.circlePos - this.shipImage.height/2

//         // Play button
//         if (this.positionTracer.state == GameObjects.FunctionTracer.STOPPED_AT_END) {
//             this.playPauseButton.label = '⏮'
//         }else if (this.positionTracer.state == GameObjects.FunctionTracer.STOPPED_AT_BEGINNING){
//             this.playPauseButton.label = '⏵'
//         } else {
//             this.positionSlider.setValue(this.positionTracer.currentY)
//             this.playPauseButton.label = '⏮'
//         }


//         this.gravitySlider.update(ctx, audio, mouse)
//         this.positionSlider.update(ctx, audio, mouse)
//         this.shipImage.update(ctx, audio, mouse)
//         this.playPauseButton.update(ctx,audio,mouse)
//     }


// }