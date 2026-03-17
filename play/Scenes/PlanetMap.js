import {Color, Shapes} from '../util/index.js'
import {Button, ImageObject, ProgressBar, TextBox} from '../GameObjects/index.js'
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
        {name:'Linear', img: 'linearPlanetIcon', data: 'linearPlanet.json', numPuzzles:20},
        {name:'Quadratic', img: 'quadPlanetIcon', data: 'quadraticPlanet.json', numPuzzles:23},
        {name:'Power', img: 'powerPlanetIcon', data: 'powerPlanet.json', numPuzzles:24},
        {name:'Exponential', img: 'exponentialPlanetIcon', data: 'exponentialPlanet.json', numPuzzles:21},
        {name:'Sine', img: 'sinePlanetIcon', data: '', numPuzzles:1},
        {name:'Sum', img: 'sumPlanetIcon', data: '', numPuzzles:1},
        {name:'Product', img: 'productPlanetIcon', data: '',numPuzzles:1},
        {name:'Chain', img: 'chainPlanetIcon', data: '', numPuzzles:1},
    ]

    const practiceAllButton = new Button({
        originX: 700, originY: 750,
        onclick: () => {
            gss.practiceCategory = 'all'
            Scene.loadScene(gameState, 'navigation')
        },
        label: "Practice All",
        width: 210,
    }).insert(gameState.objects)

    const planetGroups = []
    for (let i = 0; i < planets.length; i++){
        const planet = planets[i].name.toLowerCase()
        const x = 100 + i * 400
        
        var numPuzzles = 1
        var numComplete = 0 
        const learnButton = new Button({
            originX: x, originY: 420,
            onclick: () => {
                gameState.stored.playerLocation = "ship"
                Scene.loadScene(gameState, planets[i].name.toLowerCase())
            },
            label: "Learn",
            width: 100,
        })
        
        // Loading data is slow enough to be annoying, so just hard code the puzzle numbers,
        // Only thing that would break

        numPuzzles = planets[i].numPuzzles//Object.keys(pathData.nodes).length - 1
        numComplete = Object.entries(gameState.stored.completedScenes)
            .filter(([key, value]) => key.startsWith(planet) && value === 'complete').length
        if (numPuzzles == 1){
            learnButton.active = false
        }
        
        const planetName = new TextBox({
            originX: x, originY: 200,
            content: planets[i].name,
            font: '30px monospace'
        })
        
        const planetIcon = new ImageObject({
            originX: x, originY: 220,
            width: 150, height:150,
            id: planets[i].img,
        })
        
        
        
        const learnProgressBar = new ProgressBar({
            originX : x+10,
            originY: 500,
            length: 150,
            width: 20
        })
        learnProgressBar.value = numComplete / numPuzzles
        
        const learnProgressText = new TextBox({
            originX: x, originY: 540,
            content: numComplete + '/' + numPuzzles + ' puzzles solved',
            font: '20px monospace'
        })
        if (numPuzzles == 1){
            learnProgressText.content = 'No puzzles yet'
        }
        
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
            content: ((mastery ? mastery : 0)*100).toFixed(0) + '% mastery',
            font: '20px monospace'
        })
        
        const masteryIcon = new ImageObject({
            originX: x, originY: 670, id: masteryStar(mastery).toLowerCase()+'Star', width: 30, height:30,
        })
        
        const masteryStarText = new TextBox({
            originX: x + 40 , originY: 695,
            content: masteryStar(mastery),
            font: '20px monospace'
        })
        
        
        const planetGroup = new GameObjectGroup([learnButton, planetName, planetIcon, practiceButton, learnProgressText, learnProgressBar, masteryText, masteryIcon, masteryStarText])
        planetGroups.push(planetGroup)
    }

    if (!gss.planetScroll){
        gss.planetScroll = 0
    }
    function moveCarousal(deltaX){
        for (let i = 0; i < planetGroups.length; i++){
            const objs = planetGroups[i].objects
            for (let j = 0; j < objs.length; j++){
                objs[j].originX += deltaX
            }
        }
    }
    moveCarousal(-gss.planetScroll * 400)
    const leftButton = new Button({
        originX: 10, originY: 450,
        onclick: function() {
            if (gss.planetScroll > 0) {
                gss.planetScroll--
                moveCarousal(400)
            }
            this.active = gss.planetScroll > 0
            rightButton.active = true
        },
        label: "←",
        width: 40,
    })
    leftButton.insert(gameState.objects, 2)
    leftButton.active = gss.planetScroll > 0

    const rightButton = new Button({
        originX: 1550, originY: 450,
        onclick: function (){
            if (gss.planetScroll < 4) {
                gss.planetScroll++
                moveCarousal(-400)
            }
            this.active = gss.planetScroll < 4
            leftButton.active = true
        },
        label: "→",
        width: 40,
    })
    rightButton.insert(gameState.objects, 2)
    rightButton.active = gss.planetScroll < 4

    for (let i = 0; i < planetGroups.length; i++){
        planetGroups[i].insert(gameState.objects)
    }

    gameState.update = () => {
        // TODO animate carousal
    }
}

export function masteryStar(mastery){
    const stars = [
        'Copper', 'Silver', 'Gold', 'Platinum', 'Neptunium', 'Plutonium', 'Curium' 
    ]
    const i = Math.floor(Math.log2(-1/(mastery-1)))
    return stars[Math.min(i, stars.length-1)]
}