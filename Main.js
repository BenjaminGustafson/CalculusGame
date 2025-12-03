import {Color, Shapes, AudioManager} from './util/index.js'
import {loadScene, PLANETS} from './Scene.js'
import { MathBlock } from './GameObjects/MathBlock.js'

/** 
 * -------------------------------------------------------
 * Main.js
 * -------------------------------------------------------
 * Loads assets and stored data. Launches the game
 * and runs the update loop.
 * 
 * The gameState object keeps track of the current scene
 * and the player's progress. Any data that should be saved
 * between sessions goes in gameState.stored. The gameState.stored
 * object is saved to local storage. 
 * 
 *  A Scene is an object with 
 *  - a list of GameObjects
 *  - an update function
 * 
 * GameObject list:
 * GameObjects must be added to the array such that they are increasing 
 * in z-value so that the highest z is drawn last.
 * Why not use a priority queue? 
 * We do not expect to be inserting objects frequently enough or in large enough number to inhibit performance.
 * We expect the number of objects to be less 100, where insertion sort is typically fastest.
 * We expect most objects to have z-value 0, which also helps with insertion efficiency.
 * 
 * GameObjects are allowed to modify the mouse input, to allow them to change the cursor.
 * There is currently no gaurd against GameObjects modifying other input values.
 * Highest z-value objects end up having priority of the cursor. I do not consider this an issue.
 * 
 * The audio manager is unaffected by the order in which objects call it. If multiple objects call 
 * for the same sound that is already handled by internal limits in the audio manager.
 * 
 * Scene update function:
 * The scene update function is a place to put logic that doesn't 
 * naturally fit in any individual GameObject's update function.
 * 
 */

// Build "dev" for developement
// "play" release version
const build = "dev"

var keysPressed = {}

// Setup - called on page load 
function setup() {
    // Game is drawn on this canvas
    var canvas = document.getElementById('myCanvas');

    // Load audio
    const audioManager = new AudioManager();
    const audioPaths = ["click_001.ogg", "click4.ogg", // slider
        "drop_002.ogg", // target hit
        "confirmation_001.ogg", // solved
        "glass_002.ogg", "switch1.ogg","switch9.ogg","switch6.ogg", "switch13.ogg", 'click_003.ogg', 'click2.ogg',
        'click3.ogg',
        'drop_003.ogg', 'drop_001.ogg', //target adder
        'error_008.ogg','bong_001.ogg', // dialogue
        'click_005.ogg', // footstep
    ];

    Promise.all(
        audioPaths.map(path => {
            const name = path.split(".")[0]; // drop file extension
            return audioManager.load(name, "audio/" + path)
        })
    ).then(() => {
        console.log("All audio loaded.")
    })

    // Mouse object
    const mouse = {
        x:0,
        y:0,
        down:false, // the mouse has just been pressed
        held:false, // the mouse is being pressed
        up: false,  // the mouse was just released
        moved: false, // the mouse was moved
        cursor: 'default'
    }

    // Game state
    var gameState = {
        objects: [], // The GameObjects in the current scene
        update: (() => { }), // The update function for the scene
        stored: {}, // The part of the state that is saved. See initStoredState for object contents
        temp: {}, // Refreshes on scene load
    }

    function initStoredState(){
        gameState.stored = {
            sceneName: "startMenu", // the unique name of the current scene
            planet: 'linear', // the current planet landed on, or the planet we just left
            landed:true, // true if the ship is on a planet, false if it is in space
            
            // Planet puzzles and experiments
            planetProgress: {}, // progress on each planet. {'PlanetName' : 'complete'} or 'in progress' or 'locked'
            completedScenes: {}, // completed puzzles, trials, and rules by scene name. {"level1":true}
            playerLocation: 'planetMap', // where the player is in the planet scene
            
            // Navigation
            nextPlanet: null,
            navDistance: 0, // the distance the trip has travelled during navigation
            currentNavFunction: null, // the puzzle that the navigation is currently on
            currentNavPuzzleType: null,
            strikes: 0, // the number of strikes (incorrect answers) at the navigation puzzle
            navPuzzleMastery: {}, // list of mastery scores, indexed by puzzle type. {'linear1': 0.9}. null if puzzle not unlocked yet
            navPuzzleAttempts: {}, // number of attempted puzzles, indexed by puzzle type
            mathBlocksUnlocked: [{type:MathBlock.CONSTANT}],// the MathBlocks currently available, excluding variables

            journal: {},

            itemsUnlocked: {},
        }

        for (const planet in PLANETS){
            gameState.stored.planetProgress[PLANETS[planet]] = 'locked'
        }
        gameState.stored.planetProgress['linear'] = 'visited'        
    }

    // Try to load stored data
    const storedState = localStorage.getItem('storedState')
    var savedScene = null
    if (storedState == null){ // Local storage does not have stored data
        console.log('No stored data. Creating new save')
        initStoredState()
    }else{ // Try to parse stored data
        try {
            const parsed = JSON.parse(storedState);
            if (parsed == null){ // Data has parse error
                console.log('Stored state is null')
                initStoredState()
            }else { // Save data exists
                gameState.stored = parsed
                console.log("Loaded save")

                // TODO: Check that save data has the expected fields

                if (build != 'dev') {
                    savedScene = gameState.stored.sceneName
                    if (savedScene == 'startMenu') savedScene = null
                    gameState.stored.sceneName = 'startMenu' // always start at menu
                }
            }
        }catch (e){
            console.log('Unable to parse stored state')
            initStoredState()
        }
        
    }
    
    loadScene(gameState, gameState.stored.sceneName, {'nextScene':savedScene})

    // ----------------------------- Mouse events -------------------------------------------------------
    canvas.addEventListener('mousedown', e => {
        e.preventDefault()
        mouse.held = true
        mouse.down = true
    });

    canvas.addEventListener('mouseup', e => {
        mouse.held = false
        mouse.up = true
    });

    canvas.addEventListener("dragstart", e => e.preventDefault());
    
    document.addEventListener('mousemove', e => {
        mouse.moved = true
        var rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    document.addEventListener("mouseout", (event) => {
        mouse.held = false
        mouse.up = true
     })
    
    document.addEventListener('keyup', function (event) {
        keysPressed[event.key] = false
    });


    document.addEventListener('keydown', function (event) {
        if (!keysPressed[event.key] && gameState.keyPressed) {
            gameState.keyPressed(event.key)
        }
        keysPressed[event.key] = true

        if (build == "dev") {
            switch (event.key) {
                case 'm':
                    console.log(Math.round(mouse.x) + ',' + Math.round(mouse.y))
                    break
            }
        }
    });

    // ----------------- Development tools (push ` to show/hide) ---------------------
    if (build == 'dev'){
        // Container to toggle
        const ui = document.createElement("div");
        ui.style.position = "absolute";
        ui.style.left = "0";
        ui.style.top = "0";
        document.body.appendChild(ui);

        // Label + input for scene name
        const label = document.createElement("label");
        label.innerText = "sceneName:";
        label.style.position = "absolute";
        label.style.left = "10px";
        label.style.top = "40px";
        label.style.fontFamily = "sans-serif";
        label.style.fontSize = "12px";
        label.style.color = "white";

        const input = document.createElement("input");
        input.type = "text";
        input.style.position = "absolute";
        input.style.left = "90px";
        input.style.top  = "35px";
        input.style.width  = "160px";
        input.style.height = "20px";

        // Refresh button
        const refresh = document.createElement("button");
        refresh.innerText = "Refresh";
        refresh.style.position = "absolute";
        refresh.style.left = "10px";
        refresh.style.top  = "10px";

        // Buttons row
        const clearBtn = document.createElement("button");
        clearBtn.innerText = "Full reset";
        clearBtn.style.position = "absolute";
        clearBtn.style.left = "100px";
        clearBtn.style.top  = "10px";
        clearBtn.style.width  = "80px";

        const unlockAllBtn = document.createElement("button");
        unlockAllBtn.innerText = "Unlock all";
        unlockAllBtn.style.position = "absolute";
        unlockAllBtn.style.left = "10px";
        unlockAllBtn.style.top  = "65px";
        unlockAllBtn.style.width  = "100px";

        const plusBtn = document.createElement("button");
        ui.appendChild(plusBtn);
        plusBtn.innerText = "+100";
        plusBtn.style.position = "absolute";
        plusBtn.style.left = "120px";
        plusBtn.style.top  = "65px";
        plusBtn.style.width  = "40px";
        plusBtn.addEventListener("click", () => {
            gameState.stored.navDistance += 100
        });

        const minusBtn = document.createElement("button");
        ui.appendChild(minusBtn);
        minusBtn.innerText = "-100";
        minusBtn.style.position = "absolute";
        minusBtn.style.left = "170px";
        minusBtn.style.top  = "65px";
        minusBtn.style.width  = "40px";
        minusBtn.addEventListener("click", () => {
            gameState.stored.navDistance -= 100
        });


        // Completion input
        const compLabel = document.createElement("label");
        compLabel.innerText = "completion:";
        compLabel.style.position = "absolute";
        compLabel.style.left = "10px";
        compLabel.style.top  = "95px";
        compLabel.style.fontFamily = "sans-serif";
        compLabel.style.fontSize = "12px";
        compLabel.style.color = "white";

        const compInput = document.createElement("input");
        compInput.type = "text";
        compInput.style.position = "absolute";
        compInput.style.left = "90px";
        compInput.style.top  = "90px";
        compInput.style.width  = "160px";
        compInput.style.height = "20px";

        // Stored printout
        const storedDisplay = document.createElement("div");
        storedDisplay.style.position = "absolute";
        storedDisplay.style.left = "10px";
        storedDisplay.style.top = "120px";
        storedDisplay.style.fontFamily = "monospace";
        storedDisplay.style.fontSize = "12px";
        storedDisplay.style.color = "white";
        storedDisplay.style.whiteSpace = "pre";

        function updateStoredDisplay() {
            storedDisplay.textContent = JSON.stringify(gameState.stored, null, 2);
        }

        function syncInputsFromState() {
            if (!gameState.stored) return;
            input.value = gameState.stored.sceneName ?? "";
            const scene = gameState.stored.sceneName;
            const cs = (gameState.stored.completedScenes ?? (gameState.stored.completedScenes = {}));
            compInput.value = cs?.[scene] ?? "";
        }

        refresh.addEventListener("click", () => {
            syncInputsFromState();
            updateStoredDisplay();
        });

        clearBtn.addEventListener("click", () => {
            localStorage.clear();
            gameState.stored = null;
            location.reload();
        });

        

        unlockAllBtn.addEventListener("click", () => {
            if (!gameState.stored) return;
            if (!gameState.stored.completedScenes) gameState.stored.completedScenes = {};

            // for (let i = 1; i <= 20; i ++){
            //     const planet = gameState.stored.planet
            //     gameState.stored.completedScenes[planet+'.puzzle.' + i] = "in progress"
            // }
            updateStoredDisplay();
        });

        input.addEventListener("keydown", e => {
            if (e.key === "Enter"){
                const text = input.value;
                loadScene(gameState, text);
                syncInputsFromState();
                updateStoredDisplay();
            }
        });

        compInput.addEventListener("keydown", e => {
            if (e.key === "Enter"){
                if (!gameState.stored) return;
                const scene = gameState.stored.sceneName;
                if (!gameState.stored.completedScenes) gameState.stored.completedScenes = {};
                gameState.stored.completedScenes[scene] = compInput.value;
                updateStoredDisplay();
            }
        });

        // Append to container
        ui.appendChild(refresh);
        ui.appendChild(label);
        ui.appendChild(input);
        ui.appendChild(clearBtn);
        ui.appendChild(unlockAllBtn);
        ui.appendChild(compLabel);
        ui.appendChild(compInput);
        ui.appendChild(storedDisplay);

        const fpsLabel = document.createElement("label");
        fpsLabel.id = 'fpsLabel'
        fpsLabel.style.position = "absolute";
        fpsLabel.style.left = "200px";
        fpsLabel.style.top = "10px";
        fpsLabel.style.fontFamily = "sans-serif";
        fpsLabel.style.fontSize = "12px";
        fpsLabel.style.color = "white";
        ui.appendChild(fpsLabel)

        syncInputsFromState();
        updateStoredDisplay();

        ui.style.display = "none"

        // Toggle UI with backtick
        document.addEventListener("keydown", (e) => {
            if (e.key === "`" || e.code === "Backquote") {
                ui.style.display = (ui.style.display === "none") ? "" : "none";
            }
        });

    }

    // ------------------------------------- Main update loop --------------------------------------------------------
    let frameCount = 0
    var prevTime = Date.now()
    function update() {

        // Save progress every 200 frames
        frameCount++
        if (frameCount >= 200 && gameState.stored.sceneName != 'startMenu') {
            if (build == 'dev'){
                const fpsLabel = document.getElementById('fpsLabel')
                fpsLabel.innerText = (1000/ (Date.now() - prevTime) * 200).toFixed(1) + ' fps'
            }
            prevTime = Date.now()
            localStorage.setItem('storedState', JSON.stringify(gameState.stored));
            frameCount = 0
        }

        // Call the scene update function
        gameState.update(audioManager)

        // Get rendering context
        var ctx = canvas.getContext('2d');

        // Draw background
        Color.setColor(ctx, Color.black)
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset cursor before objects update
        mouse.cursor = 'default'

        // Mouse to pass to inactive objects
        const defaultMouse = {x:-1, y:-1, down:false, held:false, up: false, moved: false, cursor: 'default'}

        // Update all GameObjects
        for (let i = 0; i < gameState.objects.length; i++) {
            const obj = gameState.objects[i]
            if (!obj.hidden){
                obj.update(ctx, audioManager, obj.noInput ? defaultMouse : mouse);
            }
        }

        // Reset mouse state
        mouse.down = false
        mouse.up = false
        mouse.moved = false
        canvas.style.cursor = mouse.cursor

        window.requestAnimationFrame(update);
    }

    update();
}
window.onload = setup;




