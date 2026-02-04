import {Color, Shapes} from '../util/index.js'
import {Button, ImageObject, TextBox} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import * as Header from './Header.js'

export function planetMap (gameState){
    const gss = gameState.stored

    // const backButton =  new Button({originX:50, originY: 50, width:60, height: 60,
    //     onclick: ()=>Scene.loadScene(gameState,gss.planet), label:"↑"})
    Header.header(gameState, {
        buttonOptsList: [
            {onclick: ()=>Scene.loadScene(gameState,gss.planet), label:"↑"}
        ],
        title: 'Fluxionum',
    })

    // Confirmation popup
    var popUp = false
    const confirmButton = new Button({originX:650, originY: 400, width:100, height: 50,
        onclick: ()=>Scene.loadScene(gameState,'navigation'), label:"Travel"})
    const cancelButton = new Button({originX:850, originY: 400, width:100, height: 50,
        onclick: () => popUp = false, label:"Cancel"}) 
    
    const confirmNav = {
        update: function(ctx, audio, mouse){
            Color.setColor(ctx, Color.darkBlack)
            Shapes.Rectangle({ctx:ctx, originX: 500, originY:200, width: 600, height:400,inset:true, shadow:8})
            Color.setColor(ctx, Color.white)
            ctx.font = "40px monospace"
            ctx.textBaseline = 'alphabetic'
            ctx.textAlign = 'center'
            ctx.fillText(`Travel to ${gameState.stored.nextPlanet}?`,800,300)
        } 
    }

    function travelTo(planet){
        // Do not travel if already at planet
        if (gss.planet == planet){
            Scene.loadScene(gameState, planet)
            return
        }
        // Teleport if planet has been visited 
        if (gss.planetProgress[planet] == 'visited' || gss.planetProgress[planet] == 'complete'){
            Scene.loadScene(gameState, planet)
            return
        }
        gss.navDistance = 0
        gss.nextPlanet = planet
        popUp = true
    }
    

    // Planet Buttons
    const planetPositions = {
        'linear':[100,400],
        'quadratic':[300,400],
        'power':[500,400],
        'exponential':[700,400],
        'sine':[900,400],
        'sum':[1100,400],
        'product':[1300,400],
        'chain':[1500,400]
    }
    
    const planetButtons = {}
    for (let planet in planetPositions){
        planetButtons[planet] = new Button( {
            originX: planetPositions[planet][0]-(planet.length*15+30)/2, originY: planetPositions[planet][1],
            width: planet.length*15+30, height:50,
            onclick: () => {travelTo(planet)},
            label: planet.charAt(0).toUpperCase() + planet.slice(1),
        })

        switch (gss.planetProgress[planet]){
            case 'complete':
                planetButtons[planet].color = Color.blue
                break
            case 'visited':
            case 'unvisited':
                break
            default:
            case 'locked':
                planetButtons[planet].active = false
                break
                //planetButtons[planet].hidden = true
                break
        }
    }


    // Set objects and update
    // const baseObjs = Object.values(planetButtons)
    // gameState.update = () => {
    //     gameState.objects = baseObjs
    //     if (popUp){
    //         gameState.objects = baseObjs.concat([confirmNav, confirmButton, cancelButton])
    //     }
    // }
}