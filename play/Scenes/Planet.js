import {Color, Shapes} from '../util/index.js'
import * as GameObjects from '../GameObjects/index.js'
import * as Scene from '../Scene.js'
import { TileMap } from '../util/TileMap.js'
import { GameObjectGroup } from '../GameObjects/GameObject.js'
import * as Header from './Header.js' 

export function planetScene(gameState, {
    planetName,
    tileMap,
    pathData,
    bgImg,
    fgImg,
    goTo,
}){
    const gss = gameState.stored
    const nodes = pathData.nodes

    // // Map '1a' -> 'linear.1a'
    // for (let node in pathData.nodes){
    //     nodes[planetName + '.' + node] = pathData.nodes[node]
    // }

    if (gss.planetProgress[gss.planet] == 'unvisited'){
        gss.planetProgress[gss.planet] = 'visited'
    }

    if (!nodes[gss.playerLocation]){
        gss.playerLocation = 'ship'
    }


    
    function capFirst(str) {
        if (!str) return "";
        return str[0].toUpperCase() + str.slice(1);
    }

    Header.header(gameState, {
        buttonOptsList: [
            {onclick: ()=> Scene.loadScene(gameState, 'planetMap'), label:"←"}
        ],
        title: capFirst(planetName) + " Planet",
    })
    

    const player = new GameObjects.Player({
        nodes:pathData.nodes,
        pathSquares:pathData.pathSquares,
        currentNode:gss.playerLocation,
        tileMap:tileMap
    })

    const sprites = []
    const buttons = []

    for (let nodeName in nodes){
        const node = nodes[nodeName]
        
        const dirCoord = TileMap.dirToCoord(node.dir)
        const canvasPos = tileMap.isometricToCanvas(node.x + dirCoord.x, node.y + dirCoord.y)

        // Invisible button where this node is
        const button = new GameObjects.Button({
            originX:0,
            originY:0,
            onclick : () => player.moveTo(nodeName),
            bgColor: `rgba(100,0,100,0.1)`,
            color: `rgba(100,0,100,0.1)`
        })
        button.visible = false
        buttons.push(button)
        
        // Add sprite
        switch(node.type){
            default:
            case 'puzzle':
                button.originX = canvasPos.x + 230
                button.originY = canvasPos.y + 250
                button.width = 50
                button.height = 70
                
                const computer = new GameObjects.PuzzleComputer({
                    x:canvasPos.x, y:canvasPos.y,
                    text:nodeName,
                    dir: TileMap.reverseDir(node.dir)
                })

                switch (gss.completedScenes[gameState.stored.planet + '.' + nodeName]){
                    case 'complete':
                        computer.color = Color.adjustLightness(Color.blue, -50)
                        break
                    case 'in progress':
                        computer.color = Color.adjustLightness(Color.magenta, -50)
                        break
                    default:
                            button.active = false
                        break
                }
                sprites.push(computer)
                break
            case 'ship':
                sprites.push(new GameObjects.ImageObject({
                    originX:canvasPos.x - 150,
                    originY:canvasPos.y - 50,
                    id:'shipSE'
                }))
                button.originX = canvasPos.x-25,
                button.originY = canvasPos.y+150,
                button.width = 250
                button.height = 150
                break
        }
    }

    // Update and objects
    gameState.update = () => {
        if (player.state == 'arrived'){
            gss.playerLocation = player.currentNode
            if (gss.playerLocation.split('.')[1] == 'dialogue'){
                Scene.loadScene(gameState, planetName + '.' + player.currentNode)
            }else {
                Scene.loadSceneWithTransition(gameState,planetName + '.' + player.currentNode,
                    {x:player.cx,y:player.cy})
            }
        }
    }

    
    new GameObjectGroup([
        new GameObjects.ImageObject({originX:0, originY:0, id:bgImg}),
        ...sprites,
        player,
        new GameObjects.ImageObject({originX:0, originY:0, id:fgImg}),
    ].concat(buttons)).insert(gameState.objects, 0)

    if (goTo){
        player.moveTo(goTo)
    }
}

// ---------------------------------------------------------------------------


/**
 * Standard logic for level navigation 
 */
export function levelNavigation(gameState, {
    winCon, // boolean function for win condition
    nextScenes, // array of scenes to unlock
}){
    const backB = backButton(gameState)
    backB.insert(gameState.objects, 0)
    const nextB = nextButton(gameState, nextScenes)
    nextB.insert(gameState.objects, 0)
    const hintB = hintButton(gameState, nextScenes)
    hintB.insert(gameState.objects, 0)

    // if (gameState.stored.completedScenes[gameState.stored.sceneName] == 'complete'){
    //     const solutionB = new GameObjects.Button({originX:400, originY: 25, width:60, height: 60,
    //         onclick: () => videoOverlay(gameState, gameState.temp.nodeData.solution),
    //         label:"!",
    //         fontSize: 30,
    //     })
    //     solutionB.insert(gameState.objects)
    // }

    addWinCon(gameState, winCon, nextB, nextScenes)
    //unlockScenes(nextScenes, gameState.stored)
}

/**
 *  Planet scene navigation
 * 
 */
export function unlockScenes (scenes, gss){
    scenes.forEach(p => {
        if (gss.completedScenes[p] != 'complete') gss.completedScenes[p] = 'in progress'
    })
}

export function backButton (gameState){
    return new GameObjects.Button({originX:100, originY: 25, width:60, height: 60,
        onclick: ()=>Scene.loadScene(gameState,gameState.stored.planet),
        label:"↑",
        fontSize: 30,
    })
}


/**
 * Create the button to go to the next scene 
 */
export function nextButton (gameState, nextScenes){
    const button = new GameObjects.Button({originX:200, originY: 25, width:60, height: 60,
        onclick: ()=>Scene.loadScene(gameState, gameState.stored.planet, {goTo:nextScenes[0]}),
        label:"→", fontSize: 30,
        })
    button.active = false
    return button
}


export function hintButton (gameState){
    return new GameObjects.Button({originX:300, originY: 25, width:60, height: 60,
        onclick: () => videoOverlay(gameState, gameState.temp.nodeData.hint),
        label:"?", fontSize: 30,
    })
}

function videoOverlay(gameState, url, delay = 0){
    const savedObjects = gameState.objects.slice()

    const canvas = document.getElementById("myCanvas");

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/" + url + "?autoplay=1";
    console.log(url)
    iframe.style.position = "absolute";
    iframe.style.border = "0";
    iframe.allowFullscreen = true;

    setTimeout(function(){
                
    document.body.appendChild(iframe);
    
    function positionVideo() {
        const rect = canvas.getBoundingClientRect();
        
        const m = 0.10
        const marginX = rect.width * m;
        const marginY = rect.height * m;
        
        iframe.style.left = rect.left + marginX + "px";
        iframe.style.top = rect.top + marginY + "px";
        iframe.style.width = rect.width * (1-m*2) + "px";
        iframe.style.height = rect.height * (1-m*2) + "px";
    }

    // Initial positioning
    positionVideo();
    
    // Keep it aligned
    window.addEventListener("resize", positionVideo);
    window.addEventListener("scroll", positionVideo);
    
    
    gameState.objects = []
    Scene.sceneTitle(gameState, gameState.temp.sceneTitle)
    
    const exitButton = new GameObjects.Button({originX:50, originY: 90, width:60, height: 60,
        onclick: function() {
            iframe.remove()
            gameState.objects = savedObjects
        },
        label:"X"
    })
    exitButton.insert(gameState.objects,1000)
    
    }, delay);    
}

export function addWinCon(gameState, condition, nextButton, nextScenes){
    const oldUpdate = gameState.update
    gameState.update = () => {
        oldUpdate()
        if (!gameState.temp.solved && condition()){
            gameState.temp.solved = true
            gameState.stored.completedScenes[gameState.stored.sceneName] = 'complete'
            if (nextButton != null){
                nextButton.active = true
                nextButton.bgColor = Color.blue
            }

            unlockScenes(nextScenes.map(s => gameState.stored.planet+'.'+s), gameState.stored)

            videoOverlay(gameState, gameState.temp.nodeData.solution, 500)
        }
    }
}



// --------------------- Other helpers ----------------------------------

export function standardBlocks(planet){
    const blocks = [
        new GameObjects.MathBlock({type:GameObjects.MathBlock.CONSTANT}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.VARIABLE, token:'x'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.POWER, token:'2'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.POWER, token:'3'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.EXPONENT, token:'e'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.FUNCTION, token:'sin'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.FUNCTION, token:'cos'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.BIN_OP, token:'+'}),
        new GameObjects.MathBlock({type:GameObjects.MathBlock.BIN_OP, token:'*'}),
    ]
    switch (planet.toLowerCase()){
        case 'linear':
            return blocks.slice(0,1)
        case 'quadratic':
            return blocks.slice(0,2)
        case 'power':
            return blocks.slice(0,4)
        case 'exponential':
            return blocks.slice(0,5)
        case 'sine':
            return blocks.slice(0,7)
        case 'sum':
            return blocks.slice(0,8)
        case 'product':
            return blocks.slice(0,9)
    }
    
}

/**
 * 
 * Puts a dialogue pop up over the current scene.
 * 
 * @param {*} gameState 
 * @param {*} param1 
 */
export function dialogueScene(gameState, {nextScenes = [], filePath, onComplete=()=>{},
    noExit = false,
}){
    const gss = gameState.stored
    gameState.objects.forEach(obj => obj.noInput = true)

    const exitButton = new GameObjects.Button( {originX:50, originY:50, width:50, height:50, 
        onclick: () => Scene.loadScene(gameState, gss.planet), label:"↑"} )

    // Read data from file

    
    fetch(filePath)
        .then(r => r.text())
        .then(content => {
            const data = content.split('\n');
            let ids = {};
            let readingText = false;
            const text = [];

            for (const line of data) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed === 'IDS') continue;
                if (trimmed === 'TEXT') {
                    readingText = true;
                    continue;
                }
                if (trimmed === 'END') break

                if (!readingText) {
                    const [speaker, id] = trimmed.split(':').map(s => s.trim());
                    ids[speaker] = id;
                } else {
                    const [speaker, string] = trimmed.split(':').map(s => s.trim());
                    text.push({ portraitId: ids[speaker], string });
                }
            }

            const portraitIds = Object.values(ids);

            const dialogueBox = new DialogueBox({
                portraitIds:portraitIds,
                text: text,
                onComplete: function(){
                    gss.completedScenes[gameState.stored.sceneName] = 'complete'
                    Scene.loadScene(gameState, gss.planet)
                    onComplete(gameState)
                }
            })
            
            gameState.objects = gameState.objects.concat([
                dialogueBox,
            ])
            if (!noExit) gameState.objects.push(exitButton)
        });
    
    unlockScenes(nextScenes, gss)
}



export function unlockPopup(gameState, {itemImage, topText, onComplete = () => {}, bottomText=''}){
    const gss = gameState.stored
    gameState.objects.forEach(obj => obj.noInput = true)

    const popup = {
        textBox: new TextBox({originX:800, originY: 300, content: topText, align: 'center', color: Color.white,
             font:'30px monospace'}),
        bottomTextBox: new TextBox({originX:800, originY: 550, content: bottomText, align: 'center', color: Color.white,
        font:'20px monospace'}),
        playedAudio: false,
        image: new ImageObject({originX:700, originY: 350, id:itemImage}),
        startTime : Date.now(),
        update: function(ctx, audio, mouse){
            if (!this.playedAudio){
                this.playedAudio = true
                audio.play('confirmation_001')
            }
            Color.setColor(ctx, Color.black)
            Shapes.Rectangle({ctx: ctx, originX: 400, originY:200, width:800, height: 400, inset:true, shadow:8})
            this.textBox.update(ctx)
            this.bottomTextBox.update(ctx)
            this.image.update(ctx)
            if (Date.now() - this.startTime > 500){
                mouse.cursor = 'pointer'
                if (mouse.down) {
                    this.hidden = true
                    gameState.objects.forEach(obj => obj.noInput = false)
                    onComplete(gameState)
                }
            }
            
        }
    }
    gameState.objects.push(popup)
}
