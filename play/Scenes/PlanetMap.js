import {Color, Shapes} from '../util/index.js'
import {Button, ImageObject, TextBox} from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import * as Header from './Header.js'
import { GameObjectGroup } from '../GameObjects/GameObject.js'
import * as FileLoading from '../util/FileLoading.js'


export async function planetMap (gameState){
    const gss = gameState.stored

    Header.header(gameState, {
        buttonOptsList: [
            {onclick: ()=> window.location.href = '..' , label:"Quit", width: 90}
        ],
        title: 'Map',
    })

    const planets = [
        {name:'Linear', img: 'linearPlanetIcon', data: 'linearPlanet.json'},
        {name:'Quadratic', img: 'quadPlanetIcon', data: 'quadraticPlanet.json'},
        {name:'Power', img: 'quadPlanetIcon', data: 'powerPlanet.json'},
        // {name:'Sine', img: 'quadPlanetIcon'},
    ]
    
    for (let i = 0; i < planets.length; i++){
        const planet = planets[i].name.toLowerCase()
        const x = 100 + i * 400
        
        const pathData = await FileLoading.loadJsonFile('./data/'+planets[i].data)
        const numPuzzles = Object.keys(pathData.nodes).length - 1
        const numComplete = Object.entries(gameState.stored.completedScenes)
            .filter(([key, value]) => key.startsWith(planet) && value === 'complete').length
        

        const planetName = new TextBox({
            originX: x, originY: 240,
            content: planets[i].name,
            font: '30px monospace'
        })

        const planetIcon = new ImageObject({
            originX: x, originY: 260,
            width: 150, height:150,
            id: planets[i].img,
        })

        const learnButton = new Button({
            originX: x, originY: 450,
            onclick: () => {Scene.loadScene(gameState, planets[i].name.toLowerCase())},
            label: "Learn",
            width: 100,
        })

        const learnProgress = new TextBox({
            originX: x, originY: 540,
            content: numComplete + '/' + numPuzzles + ' puzzles',
            font: '20px monospace'
        })

        const practiceButton = new Button({
            originX: x, originY: 580,
            onclick: () => {
                gss.practiceCategory = planets[i].name.toLowerCase()
                Scene.loadScene(gameState, 'navigation')
            },
            label: "Practice",
            width: 145,
        })
        if (gss.planetProgress[planet] === "locked"){
            learnButton.active = false
            practiceButton.active = false
        }

        const mastery = gss.practiceMastery[planets[i].name.toLowerCase()]

        const masteryText = new TextBox({
            originX: x, originY: 660,
            content: ((mastery ? mastery : 0)*100).toFixed(1) + '% mastery',
            font: '20px monospace'
        })

        const planetGroup = new GameObjectGroup([learnButton, planetName, planetIcon, practiceButton, learnProgress, masteryText])
        planetGroup.insert(gameState.objects)
    }

    const practiceAllButton = new Button({
        originX: 700, originY: 750,
        onclick: () => {
            gss.practiceCategory = 'all'
            Scene.loadScene(gameState, 'navigation')
        },
        label: "Practice All",
        width: 210,
    }).insert(gameState.objects)

}