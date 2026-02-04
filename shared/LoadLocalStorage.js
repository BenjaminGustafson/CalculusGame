

/**
 * Creates a new state
 */
function initStoredState(){
    return {
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
}



export function loadLocalStorage() {
    // Try to load stored data
    const storedState = localStorage.getItem('storedState')

    if (storedState == null){ // Local storage does not have stored data
        console.log('No stored data')
    }else{ // Try to parse stored data
        try {
            const parsed = JSON.parse(storedState);
            if (parsed == null){ // Data has parse error
                console.log('Stored state is null')
            }else { // Save data exists
                console.log("Loaded save")
                return parsed
            }
        }catch (e){
            console.log('Unable to parse stored state')
        }
    }
    return initStoredState()
}