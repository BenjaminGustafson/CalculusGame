import {Color, Shapes} from '../util/index.js'
import {Grid, FunctionTracer, Button, ImageObject, IntegralTracer, MathBlock, MathBlockManager, MathBlockField, Slider, Target, TargetAdder, TextBox} from '../GameObjects/index.js'
import { loadScene } from '../Scene.js'
import * as Planet from './Planet.js'

export function ruleGuess(gameState, {planetUnlock, blocks, targetBlock, correctDdx}){
    const gss = gameState.stored
    var state = 'no attempt' // 'incorrect' 'correct' 'solved'
    const backButton = Planet.backButton(gameState)
    const nextButton = Planet.nextButton(gameState, ['planetMap'])
    
    const sySlider = new Slider({canvasX: 1200, canvasY: 200, maxValue:5, sliderLength:10, startValue: 1, showAxis:true})
    const tySlider = new Slider({canvasX: 1300, canvasY: 200, maxValue:5, sliderLength:10, showAxis:true})
    const mbField = new MathBlockField({minX:700, minY:200, maxX:1100, maxY:300})
    const mbm = new MathBlockManager({blocks : blocks, toolBarX: 1400, toolBarY:150, outputType:"none",
        scaleYSlider: sySlider, translateYSlider:tySlider,
        blockFields: [ mbField ],
    })

    
    const checkResult = new TextBox({originX: 100, originY: 550, font:'30px monospace', align:'left', baseline:'top'})
    const checkButton = new Button({originX: 100, originY:400, width: 200, height: 100, label:"Check",
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
        checkButton, checkResult
    ]

    gameState.update = (audio) => {
        if (state == 'correct'){
            Planet.unlockPopup(gameState, {itemImage:'shipSide', topText:`You solved the ${capFirst(gss.planet)} Rule!`, bottomText:`You can now travel to ${capFirst(planetUnlock)} Planet.`})
            state = 'solved'
        } 
    }

    Planet.winCon(gameState, ()=>state == 'solved', nextButton)
}

function capFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}
