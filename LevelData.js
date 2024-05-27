/**
 * This file contains all of the data for the levels.
 */

const data = {
    level1: {
        gridSize: 4,
        correctAnswer: 1,
        lineSegments: [
            [0,1, 1,1]
        ],
    },
    level2: {
        preset: "level1",
        correctAnswer: 2,
    }
}

// TODO: A function to play a level from the data
// And Go to next level


// It might just be easier to have a function for each level.... We'll see.
// Need an efficient way to do code resuse.
// Many of the levels will be similar. But also I want the freedom to have a lot of variety...
// How about a separate function for each type of level...

function loadLevel(levelNumber){
    switch (levelNumber){
        case 1: return sliderGridLevel();
        default: return sliderGridLevel();
    }
}


function sliderGridLevel(){
    const slider = new Slider(600,100,300, 10, -1, 10)
    const objs = [slider]
    function winCon(objs){
        return objs[0].value == 0 && objs[0].grabbed == false
    }
    return {objs: objs, winCon: winCon}
}

function level1(ctx){

}