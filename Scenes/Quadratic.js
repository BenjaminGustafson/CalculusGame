import {Color, Shapes} from '../util/index.js'
import {TileMap, Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox, DialogueBox, DrawFunction} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { GameObject } from '../GameObjects/GameObject.js'
import * as Planet from './Planet.js'
import * as Experiment from './Experiment.js'
import * as Puzzles from './Puzzles.js'

/**
 * 
 * Dialogue
 * 
 * 
 */



const tileMap = new TileMap({yTileOffset:-3,xTileOffset:-7, xImgOffset:0, yImgOffset:0})

// [x,y,  dx,dy] where dx dy is the direction to face when stopped at node
// SW 0,1 NW -1,0 NE 0,-1 SE 1,0
const nodes = {
    'planetMap':        [5,1, 0,-1],
    'quadratic.puzzle.1a': [6,1, 0,-1],
    'quadratic.puzzle.1b': [7,1, 0,-1],
    'quadratic.puzzle.1c': [8,1, 0,-1],
    'quadratic.puzzle.1d': [9,1, 0,-1],

    'quadratic.puzzle.2a': [10,1, 0,-1],
    'quadratic.puzzle.2b': [11,1, 0,-1],
    'quadratic.puzzle.2c': [12,1, 0,-1],

    'quadratic.puzzle.3a': [14,1, 0,-1],
    'quadratic.puzzle.3b': [15,1, 0,-1],
    'quadratic.puzzle.3c': [16,1, 0,-1],
    'quadratic.puzzle.3d': [17,1, 0,-1],

    'quadratic.puzzle.4a': [17,3, 0,-1],
    'quadratic.puzzle.4b': [16,3, 0,-1],
    'quadratic.puzzle.4c': [15,3, 0,-1],
    'quadratic.puzzle.4d': [14,3, 0,-1],

    'quadratic.puzzle.5a': [13,3, 0,-1],
    'quadratic.puzzle.5b': [12,3, 0,-1],
    'quadratic.puzzle.5c': [11,3, 0,-1],
    'quadratic.puzzle.5d': [10,3, 0,-1],
}

const paths = 
[
    {start: 'planetMap', end: 'quadratic.puzzle.1a'},
    
    { start: 'quadratic.puzzle.1a', end: 'quadratic.puzzle.1b', steps: [] },
    { start: 'quadratic.puzzle.1b', end:  'quadratic.puzzle.1c', steps: [] },
    { start: 'quadratic.puzzle.1c', end: 'quadratic.puzzle.1d', steps: [] },
    { start: 'quadratic.puzzle.1d', end: 'quadratic.puzzle.2a', steps: [] },

    { start: 'quadratic.puzzle.2a', end: 'quadratic.puzzle.2b', steps: [] },
    { start: 'quadratic.puzzle.2b', end:  'quadratic.puzzle.2c', steps: [] },
    { start: 'quadratic.puzzle.2c', end: 'quadratic.puzzle.3a', steps: [] },

    { start: 'quadratic.puzzle.3a', end: 'quadratic.puzzle.3b', steps: [] },
    { start: 'quadratic.puzzle.3b', end: 'quadratic.puzzle.3c', steps: [] },
    { start: 'quadratic.puzzle.3c', end: 'quadratic.puzzle.3d', steps: [] },
    { start: 'quadratic.puzzle.3d', end: 'quadratic.puzzle.4a', steps: [] },

    { start: 'quadratic.puzzle.4a', end: 'quadratic.puzzle.4b', steps: [] },
    { start: 'quadratic.puzzle.4b', end: 'quadratic.puzzle.4c', steps: [] },
    { start: 'quadratic.puzzle.4c', end: 'quadratic.puzzle.4d', steps: [] },
    { start: 'quadratic.puzzle.4d', end: 'quadratic.puzzle.5a', steps: [] },
    
    { start: 'quadratic.puzzle.5a', end: 'quadratic.puzzle.5b', steps: [] },
    { start: 'quadratic.puzzle.5b', end: 'quadratic.puzzle.5c', steps: [] },
    { start: 'quadratic.puzzle.5c', end: 'quadratic.puzzle.5d', steps: [] },
    { start: 'quadratic.puzzle.5d', end: 'quadratic.puzzle.6a', steps: [] },
    
]


export function loadScene(gameState, sceneName, message = {}){
    gameState.stored.planet = 'quadratic'

    const sceneNameSplit = sceneName.toLowerCase().split('.')

    // Main scene
    if (sceneNameSplit.length == 1) {
        quadraticPlanet(gameState, message)
        return
    }

    // Sub-scenes
    switch(sceneNameSplit[1]){
        case "puzzle": 
            switch(sceneNameSplit[2]){
                case '1a':{
                    Puzzles.drawFunctionLevel(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[1], targetOpts:{size:50}}),
                        nextScenes: ['quadratic.puzzle.1b', 'quadratic.puzzle.1c', 'quadratic.puzzle.1d', 'quadratic.puzzle.2a',]
                        
                    })
                    const uiTip = {
                        update: function(ctx){
                            Color.setColor(ctx, Color.lightGray)
                            ctx.font = '20px monospace'
                            ctx.textAlign = 'left'
                            ctx.textBaseline = 'bottom'
                            ctx.fillText('Click and drag to draw.',900,320)
                        }
                    }
                    gameState.objects.push(uiTip)
                }
                    break
                case '1b':
                    Puzzles.drawFunctionLevel(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[-1,0], targetOpts:{size:50}}),
                        nextScenes: ['quadratic.puzzle.1c']
                    })
                    break
                case '1c':
                    Puzzles.drawFunctionLevel(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[0.5,1,1.5,2], targetOpts:{size:40}}),
                        nextScenes: ['quadratic.puzzle.1d']
                    })
                    break
                case '1d':
                    Puzzles.drawFunctionLevel(gameState, {
                        tracerStart: 1,
                        targetBuilder: Puzzles.buildTargetsFromYs({targetYs:[-0.5,-1,-0.5,1], targetOpts:{size:40}}),
                        nextScenes: ['quadratic.puzzle.2a']
                    })
                    break
                case '2a': 
                {
                    Puzzles.mathBlockTutorial(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>0.5*x, numTargets: 10, targetOpts: {}}),
                        mathBlockSetupOpts: {
                            blocks: Planet.standardBlocks('quadratic'),
                        },
                        nextScenes: ['quadratic.puzzle.2b', 'quadratic.puzzle.2c', 'quadratic.puzzle.3a'],
                    })
                }
                break
                case '2b':
                {
                    Puzzles.mathBlockTutorial(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>0.5*x+1, numTargets: 10, targetOpts: {}}),
                        mathBlockSetupOpts: {
                            blocks: Planet.standardBlocks('quadratic'),
                        },
                        nextScenes: ['quadratic.puzzle.2c'],
                    })
                }
                break
                case '2c':
                {
                    Puzzles.mathBlockTutorial(gameState, {
                        targetBuilder: Puzzles.buildTargetsFromFun({fun: x=>-x-1, numTargets: 10, targetOpts: {}}),
                        mathBlockSetupOpts: {
                            blocks: Planet.standardBlocks('quadratic'),
                        },
                        nextScenes: ['quadratic.puzzle.3a'],
                    })
                }
                break
                case '3a':
                    {
                        const numSliders = 4
                        const tracerStart = 2
                        Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 100},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.25},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: [ 'quadratic.puzzle.3b','quadratic.puzzle.3c','quadratic.puzzle.3d','quadratic.puzzle.4a',],
                        })
                    }
                    break
                case '3b':
                    {
                        const numSliders = 8
                        const tracerStart = 2
                        Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 100},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.25},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.3c', ],
                        })
                    }
                    break
                case '3c':
                    {
                        const numSliders = 16
                        const tracerStart = 2
                        const {sliderGroup} = Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 200, rightMargin:300},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.25},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.3d', ],
                        })
                        Puzzles.addMathBlocksToSliderLevel(gameState, {
                            mbSliderOpts: {},
                            sliders: sliderGroup.objects,
                            blocks : Planet.standardBlocks('quadratic'),
                        })
                    }
                    //quadDiscLevel(gameState, {numSliders:20, withMathBlock:true, nextScenes:["quadratic.puzzle.8"], ddx: x=>x, tracerStart:2})
                    break
                case '3d':
                    {
                        const numSliders = 40
                        const tracerStart = 2
                        const {sliderGroup} = Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 200, rightMargin:300},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.1, circleRadius: 5},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>x, numTargets: numSliders, startY:tracerStart, 
                                targetOpts:{size:10}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.4a', 'quadratic.puzzle.4b','quadratic.puzzle.4c','quadratic.puzzle.4d',],
                        })
                        Puzzles.addMathBlocksToSliderLevel(gameState, {
                            mbSliderOpts: {},
                            sliders: sliderGroup.objects,
                            blocks : Planet.standardBlocks('quadratic'),
                        })
                    }
                    //quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10, withMathBlock:true, nextScenes:["quadratic.puzzle.9"]})
                    break
                case '4a':
                    {
                        const numSliders = 8
                        const tracerStart = -1
                        Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 100},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.25},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({ddx:x=>-x, numTargets: numSliders, startY:tracerStart, targetOpts:{size:20}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.4b', ],
                        })
                    }
                    //quadDiscLevel(gameState, {numSliders:8, nextScenes:["quadratic.puzzle.10"], ddx: x=> -x, tracerStart:-1})
                    break
                case '4b':
                    {
                        const numSliders = 40
                        const tracerStart = -1
                        const {sliderGroup} = Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 200, rightMargin:300},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.1, circleRadius: 5, clickable:true},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({
                                ddx:x=>-x, numTargets: numSliders, startY:tracerStart, 
                                targetOpts:{size:10}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.4c', ],
                        })
                        Puzzles.addMathBlocksToSliderLevel(gameState, {
                            mbSliderOpts: {},
                            sliders: sliderGroup.objects,
                            blocks : Planet.standardBlocks('quadratic'),
                        })
                    } 
                //quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
                    //    withMathBlock:true, nextScenes:["quadratic.puzzle.11"], ddx: x=> -x, tracerStart:-1})
                    break
                case '4c': 
                    {
                        const numSliders = 40
                        const tracerStart = 0
                        const {sliderGroup} = Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 200, rightMargin:300},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.1, circleRadius: 5, clickable:true},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({
                                ddx:x=>-0.5*x,
                                numTargets: numSliders,
                                startY:tracerStart, 
                                targetOpts:{size:10}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.4d'],
                        })
                        Puzzles.addMathBlocksToSliderLevel(gameState, {
                            mbSliderOpts: {},
                            sliders: sliderGroup.objects,
                            blocks : Planet.standardBlocks('quadratic'),
                        })
                    } 
                    // quadDiscLevel(gameState, {numSliders:200, sliderSize:10, targetSize:10,
                    //     withMathBlock:true, nextScenes:["quadratic.puzzle.12"], ddx: x=> -0.5*x, tracerStart:0})
                    break
                case '4d':
                    {
                        const numSliders = 40
                        const tracerStart = 0.4
                        const {sliderGroup} = Puzzles.sliderLevel(gameState, {
                            gridSetupOpts: {topMargin: 200, rightMargin:300},
                            sliderSetupOpts:{
                                numSliders:numSliders,
                                sliderOpts: {increment: 0.1, circleRadius: 5, clickable:true},
                            },
                            targetBuilder:Puzzles.buildTargetsFromDdx({
                                ddx:x=>0.2*x,
                                numTargets: numSliders,
                                startY:tracerStart, 
                                targetOpts:{size:10}}),
                            tracerOpts: {originGridY:tracerStart},
                            nextScenes: ['quadratic.puzzle.5a', ],
                        })
                        Puzzles.addMathBlocksToSliderLevel(gameState, {
                            mbSliderOpts: {},
                            sliders: sliderGroup.objects,
                            blocks : Planet.standardBlocks('quadratic'),
                        })
                    } 
                    break
                case '5a':{
                    
                }
                    break

            }
        break
    }
}


function quadraticPlanet(gameState,message={}){
    Planet.planetScene(gameState, {
        planetName:'quadratic',
        shipX:10, shipY: -200,
        tileMap:tileMap,
        playerNodes:nodes,
        playerPaths:paths,
        bgImg: 'quadPlanetBg',
        fgImg: 'placeholderFg',
        firstScene: 'quadratic.puzzle.1a',
        message
    })
}


