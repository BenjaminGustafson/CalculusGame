import * as GameObjects from '../GameObjects/index.js'
import * as Planet from './Planet.js'
import * as Puzzles from './Puzzles.js'


export function mblockTest(gameState){
    const grids = Puzzles.gridSetup(gameState, {
        numGrids: 2,
        rightMargin: 200,
        topMargin: 200,
    }).objects
    const gridLeft = grids[0]
    const gridRight = grids[1]

    const {sySlider, tySlider, mbField, funTracer} = Puzzles.mathBlockSetup(gameState, {
        sliderOpts:{},
        blocks: Planet.standardBlocks('sine'),
        mbFieldOpts: {},
        grid:gridRight,
    })
    
    const targets = Puzzles.targetsFromFun(gameState, {
        fun: x=>x,
        grid: gridLeft,
        numTargets: 10,
        targetOpts: {},
    }).objects

    const tracer = new GameObjects.IntegralTracer({
        grid: gridLeft,
        input:{type:'mathBlock', 
            blockField:mbField,
            },
        targets: targets,
    })
    tracer.insert(gameState.objects,1)
    
}