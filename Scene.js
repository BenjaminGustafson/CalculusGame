import * as GameObjects from './GameObjects/index.js'
import {Shapes, Color} from './util/index.js'
import * as Menus from './Scenes/Menus.js'
import * as Linear from './Scenes/Linear.js'
import * as Quadratic from './Scenes/Quadratic.js'
import * as Exponential from './Scenes/Exponential.js'
import * as Navigation from './Scenes/Navigation.js'
import * as Sine from './Scenes/Sine.js'
import * as Power from './Scenes/Power.js'
import * as Sum from './Scenes/Sum.js'
import * as Product from './Scenes/Product.js'
import * as Chain from './Scenes/Chain.js'


export const CANVAS_WIDTH = 1600
export const CANVAS_HEIGHT = 900
export const PLANETS = ['linear', 'quadratic', 'power', 'exponential', 'sine', 'sum', 'product', 'chain']

export function loadSceneWithTransition(gameState, sceneName, {x = 800, y=450, out=false}, message = {}){
    const transitionTime = 1000
    const startTime = Date.now() 
    gameState.objects.forEach(o => o.noInput = true)

    const mask = {
        startTime: Date.now(),
        loaded: false,
        update: function(ctx) {
            const time = (Date.now() - startTime)/transitionTime
            var t = time
            // if (time >= 2){
            //     this.hidden = true
            //     return
            // }else
            if (time >= 1){
                if (!this.loaded){
                    loadScene(gameState, sceneName, message)
                    //gameState.objects.push(mask)
                    // this.loaded = true
                    // x = 800
                    // y = 450
                }
                //t = Math.max(0,Math.min(1,2-time))
            }
            ctx.save()
            ctx.beginPath()
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
            //t = t * t * t * (t * (6 * t - 15) + 10)
            t = 2 / ((t-1) * (t-1) * (t-1) * (t-1) + 1) - 1
            ctx.arc(x, y, 1600*(1-t), 0, Math.PI * 2)
            Color.setFill(ctx, Color.black)
            ctx.fill('evenodd')
            ctx.restore()
        }
    }

    gameState.objects.push(mask)
}

/**
 * 
 * The main function for serving up scenes.
 * 
 * The comments above each level describe the intended 
 * things that the level should teach.
 * 
 */
export function loadScene(gameState, sceneName, message = {}) {
    console.log('SCENE loadScene', sceneName)
    gtag("event", "load_scene", {
        sceneName: sceneName,
    });
    if (gameState.temp.startTime){
        gtag("event", "end_scene", {
            sceneName: gameState.stored.sceneName,
            timeSpent: Math.round((Date.now() -  gameState.temp.startTime)/1000),
            solved: gameState.temp.solved, 
        });
    }
    gameState.stored.prevScene = gameState.stored.sceneName
    gameState.stored.sceneName = sceneName
    
    gameState.temp = {}
    gameState.objects = []
    gameState.update = () => { }
    
    const sceneNameSplit = sceneName.toLowerCase().split('.', 2)
    gameState.temp.startTime = Date.now()

    var sceneTitle = ''

    switch (sceneNameSplit[0]) {
        //------------------------------------------------------------
        // Menus (see Menus.js)
        //------------------------------------------------------------
        default:
        case "startmenu": Menus.startMenu(gameState, message['nextScene'])
        break

        case "planetmap": Menus.planetMap(gameState)
        break

        case "navigation": Navigation.navScene(gameState, 'ship')
        break

        // Linear Planet (see Linear.js)
        case 'linear': 
            Linear.loadScene(gameState, sceneNameSplit[1], message)
            break

        // Quadratic Planet
        case "quadratic": Quadratic.loadScene(gameState, sceneNameSplit[1], message)
            sceneTitle = 'Quadratic Planet'
            break
        case "exponential": Exponential.loadScene(gameState, sceneName, message)
            sceneTitle = 'Exponential Planet'
            break
        case "sine": Sine.loadScene(gameState, sceneName, message)
            break
        case "power": Power.loadScene(gameState, sceneName, message)
            break
        case "sum": Sum.loadScene(gameState, sceneName, message)
            break
        case "product": Product.loadScene(gameState, sceneName, message)
            break
        case "chain": Chain.loadScene(gameState, sceneName, message)
            break
    }
    if (sceneName != 'mainMenu'){
        journal(gameState)
        if (sceneNameSplit.length == 2){
            sceneTitle = capFirst(sceneNameSplit[0]) + ' ' + sceneNameSplit[1].toUpperCase()
        }
    }
}

function capFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}

export function sceneTitle(gameState, title){
    const sceneTitleBox = new GameObjects.TextBox({
        originX: 800, originY: 50,
        font:'30px monospace',
        color:Color.white,
        align:'center', baseline: 'middle',
        content: title,
        bgColor: Color.black,
    })
    if (title !== ''){
        sceneTitleBox.insert(gameState.objects, 50)
    }
}

function journal(gameState){
    var tempObjs = []
    const journalPopup = {
        update: function(ctx, audio, mouse){
            Color.setColor(ctx, Color.white)
            ctx.font = "30px monospace"
            ctx.textBaseline = 'alphabetic'
            ctx.textAlign = 'left'

            
            if (gameState.stored.completedScenes['linear.dialogue.5'])
                ctx.fillText(`Linear: f(x) = ax+b ⟹ f'(x) = a`,200,100)
            else 
                ctx.fillText(`Rules learned will go here.`,200,100)
            if (gameState.stored.completedScenes['quadratic.puzzle.20'] == 'complete')
                ctx.fillText(`Quadratic: f(x) = x^2 ⟹ f'(x) = 2x`,200,150)
            if (gameState.stored.completedScenes['power.puzzle.20'] == 'complete')
                ctx.fillText(`Power: f(x) = x^n => f'(x) ⟹ n x^(n-1)`,200,200)
            if (gameState.stored.completedScenes['exponential.puzzle.20'] == 'complete')
                ctx.fillText(`Exponential: f(x) = e^x ⟹ f'(x) = e^x`,200,250)
            if (gameState.stored.completedScenes['sine.puzzle.20'] == 'complete')
                ctx.fillText(`Sine: f(x) = sine(x) ⟹ f'(x) = cos(x)`,200,250)
            if (gameState.stored.completedScenes['sine.puzzle.20'] == 'complete')
                ctx.fillText(`Cosine: f(x) = cos(x) ⟹ f'(x) = -sin(x)`,200,250)
            if (gameState.stored.completedScenes['sum.puzzle.20'] == 'complete')
                ctx.fillText(`Sum: h(x) = f(x) + g(x) ⟹ h'(x) = f'(x) + g'(x)`,200,250)
            if (gameState.stored.completedScenes['product.puzzle.20'] == 'complete')
                ctx.fillText(`Product: h(x) = f(x) g(x) ⟹ h'(x) = f'(x) g(x) + g'(x) f(x)`,200,250)
            if (gameState.stored.completedScenes['chain.puzzle.20'] == 'complete')
                ctx.fillText(`Chain: h(x) = f(g(x)) ⟹ h'(x) = f'(g(x)) g'(x)`,200,250)
        } 
    }
    const exitButton = new GameObjects.Button({originX:1525, originY:25, width: 50, height:50, label:'X',
        onclick: ()=>{
            gameState.objects = tempObjs
            tempObjs = []      
        }
    })
    const journalButton = new GameObjects.Button({originX:1525, originY:25, width: 50, height:50, label:'🕮',
        onclick: ()=>{
            tempObjs = gameState.objects
            gameState.objects = [journalPopup, exitButton]
        }
    })
    gameState.objects.push(journalButton)
    
}

