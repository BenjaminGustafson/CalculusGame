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

function loadLevel(ctx){
    Shapes.Grid(ctx, 100,100, 300,300, 4, 10)
    Shapes.VerticalSlider(ctx, 500,100, 300, 6,3, 10)
    
}