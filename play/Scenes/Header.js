import {Color, Shapes} from '../util/index.js'
import * as GameObjects from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { TileMap } from '../util/TileMap.js'
import { GameObjectGroup } from '../GameObjects/GameObject.js'

export function backButton (gameState){
    return new GameObjects.Button({originX:100, originY: 25, width:60, height: 60,
        onclick: ()=>Scene.loadScene(gameState,gameState.stored.planet),
        label:"↑",
        fontSize: 30,
    })
}

export function header (gameState, {
    buttonOptsList,
    title,
    border = false,
}){
    const buttons = []
    var x = 100
    for (let i = 0; i < buttonOptsList.length; i++){
        buttons.push(new GameObjects.Button({
            originX:x, originY: 20, width:60, height: 60,
            fontSize: 30,
            ...buttonOptsList[i],
        }))
        x += buttons[i].width + 50
    }
    const buttonGroup = new GameObjectGroup(buttons)
    buttonGroup.insert(gameState.objects, 50)

    gameState.temp.sceneTitle = title
    const sceneTitleBox = new GameObjects.TextBox({
        originX: 800, originY: 30,
        font:'40px monospace',
        color:Color.white,
        align:'center', baseline: 'top',
        content: title,
        bgColor: Color.darkBlack,
        padding: 5
    })
    if (title !== ''){
        sceneTitleBox.insert(gameState.objects, 50)
    }



    return {buttonGroup, sceneTitleBox}
}

export function sceneTitle(gameState, title){
    gameState.temp.sceneTitle = title
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
    console.log(gameState.objects)
}
