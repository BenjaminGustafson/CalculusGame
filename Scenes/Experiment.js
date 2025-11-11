import {Color, Shapes} from '../util/index.js'
import {Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox} from '../GameObjects/index.js'
import { loadScene } from '../Scene.js'
import * as Planet from './Planet.js'

export function ruleGuess(gameState, {planetUnlock, blocks, targetBlock, correctDdx}){
    const gss = gameState.stored
    var state = 'no attempt' // 'incorrect' 'correct' 'solved'
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, ['planetMap'])
    
    

    const gridLeft = new Grid({canvasX:80, canvasY:450, canvasWidth:350, canvasHeight:350, 
        gridXMin:-10, gridXMax:10, gridYMin:-10, gridYMax:10, labels:true, xAxisLabel:'x', yAxisLabel:'f(x)', autoCellSize:true})

    const gridRight = new Grid({canvasX: 700, canvasY:450, canvasWidth:350, canvasHeight:350, 
        gridXMin:-10, gridXMax:10, gridYMin:-10, gridYMax:10, labels:true, xAxisLabel:'x', yAxisLabel: 'f\'(x)', autoCellSize:true})

    const aSlider = new Slider({canvasX: 100, canvasY: 320, canvasLength:350, maxValue:5, sliderLength:10, startValue: 1, showAxis:true, vertical:false})
    const aLabel = new TextBox({content: 'a',originX: 80, originY: 320, font:'25px monospace', align:'right', baseline:'middle'})
    const bSlider = new Slider({canvasX: 100, canvasY: 380, canvasLength:350, maxValue:5, sliderLength:10, startValue: 0, showAxis:true, vertical:false})
    const bLabel = new TextBox({content: 'b',originX: 80, originY: 380, font:'25px monospace', align:'right', baseline:'middle'})

    const funTracer = new FunctionTracer({grid:gridLeft, unsolvedColor:Color.magenta})
    const ddxTracer = new FunctionTracer({grid:gridRight})
    
    const sySlider = new Slider({canvasX: 1250, canvasY: 150, maxValue:5, sliderLength:10, startValue: 1, showAxis:true})
    const tySlider = new Slider({canvasX: 1320, canvasY: 150, maxValue:5, sliderLength:10, showAxis:true})
    const mbField = new MathBlockField({minX:700, minY:200, maxX:1100, maxY:300})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:150, outputType:"none",
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
    })
    const intTracer = new IntegralTracer({grid:gridLeft, input:{
        inputFunction: (x) => {
            if (mbField.rootBlock){
                // Slight inneficiency here, since we build the function for every call. 
                const fun = mbField.rootBlock.toFunction({a:aSlider.value, b:bSlider.value})
                if (fun != null){
                    return fun(x)
                }
            }
                return 0
        },
        resetCondition : () => {
                    return mbField.newFunction
                },
        },
        animated:false
    })

    const checkResult = new TextBox({originX: 700, originY: 160, font:'25px monospace', align:'left', baseline:'top'})
    const checkButton = new Button({originX: 700, originY:50, width: 200, height: 100, label:"Check",
        onclick: () => {
            if (mbField.rootBlock == null || mbField.rootBlock.toFunction() == null){
                checkResult.content = 'No function set'
                return
            } 
                
            // What is an appropriate number of checks here? Somewhere from 100 to 10000
            var correct = true
            outerLoop: for(let a = -10; a <= 10; a += 5){
            for (let b = -10; b <= 10; b += 5){
                const fun = mbField.rootBlock.toFunction({'a':a, 'b':b})
            for (let x = -10; x <= 10; x++){
                const y1 = fun(x)
                const y2 = correctDdx(x,a,b)
                if (Math.abs(y1 - y2) > 0.00001){
                    correct = false
                    //break outerLoop
                }
            }
            }
            }
            if (correct){
                checkResult.content = 'Correct!'
                state = 'correct'
                gss.completedScenes[gss.sceneName] = 'complete'
                if (gss.planetProgress[planetUnlock] == null || gss.planetProgress[planetUnlock] == 'locked')
                    gss.planetProgress[[planetUnlock]] = 'unvisited'

                // Unlock TODO: have a popup the first time this happens
                if (gss.navPuzzleMastery[gss.planet] == null){
                    gss.navPuzzleMastery[gss.planet] = 0
                }
            }else{
                state = 'incorrect'
                checkResult.content = 'Incorrect'
            }
        }
     })

    gameState.objects = [
        new TextBox({originX: 50, originY:200, baseline:'top', content:'f(x) =', font:'40px monospace'}),
        new TextBox({originX: 500, originY:200, baseline:'top', content:'f\'(x) =', font:'40px monospace'}),
        nextButton,backButton,
        sySlider, tySlider, mbm, targetBlock,
        checkButton, checkResult,
        gridLeft, gridRight,
        aLabel, bLabel, aSlider, bSlider,
        funTracer, ddxTracer
    ]

    gameState.update = (audio) => {
        if (state == 'correct'){
            Planet.unlockPopup(gameState, {itemImage:'shipSide', topText:`You solved the ${capFirst(gss.planet)} Rule!`, bottomText:`You can now travel to ${capFirst(planetUnlock)} Planet.`})
            state = 'solved'
        }
        funTracer.setInputFunction(targetBlock.toFunction({a:aSlider.value, b:bSlider.value}))
        ddxTracer.setInputFunction(mbField.outputFunction({a:aSlider.value, b:bSlider.value}))
        //aLabel.content = 'a='+aSlider.value.toFixed(1)
    }

    Planet.winCon(gameState, ()=>state == 'solved', nextButton)
}

function capFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}
