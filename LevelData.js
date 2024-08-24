/**
 * This file contains all of the data for the levels.
 */

// You could make it so that each level function takes in a single js object
// Then if we wanted to use json for data storage later, you could just load in each object and pass it to the function....
// You would need to also store the level type. 
// TODO: implement this kind of thing
data = {
    sections:[
        {levels:[
            {id:"slope1", }
            ,]
        }
    ],

}


function loadLevel(levelNumber){
    switch (levelNumber){
        
        case 1: return simpleSlopeLevel({
            line:{start_x:0, start_y:0, end_x:1, end_y:1},
            answer:1,
            grid:{gridWidth: 1, gridHeight: 1},
            slider:{sliderSize:1, sliderDivision:-1}
        });
        case 2: return simpleSlopeLevel({
            line:{start_x:0, start_y:0, end_x:1, end_y:2},
            answer:2,
            grid:{gridWidth: 1, gridHeight: 2},
            slider:{sliderSize:2, sliderDivision:-1}
        });
        case 3: return simpleSlopeLevel({
            line:{start_x:0, start_y:0, end_x:1, end_y:3},
            answer:3,
            grid:{gridWidth: 1, gridHeight: 3},
            slider:{sliderSize:3, sliderDivision:-1}
        });
        case 4: return simpleSlopeLevel({
            line:{start_x:0, start_y:1, end_x:1, end_y:0},
            answer:-1,
            grid:{gridWidth: 1, gridHeight: 1},
            slider:{sliderSize:1, sliderDivision:-1, axis:0}
        });
        case 5: return simpleSlopeLevel({
            line:{start_x:0, start_y:2, end_x:1, end_y:0},
            answer:-2,
            grid:{gridWidth: 1, gridHeight: 2},
            slider:{sliderSize:2, sliderDivision:-1, axis:0}
        });
        case 6: return simpleSlopeLevel({
            line:{start_x:0, start_y:0, end_x:1, end_y:1},
            answer:1,
            grid:{gridWidth: 1, gridHeight: 2},
            slider:{sliderSize:4, sliderDivision:-1, axis:2}
        });
        case 7: return simpleSlopeLevel({
            line:{start_x:0, start_y:1, end_x:1, end_y:2},
            answer:1,
            grid:{gridWidth: 1, gridHeight: 2},
            slider:{sliderSize:4, sliderDivision:-1, axis:2}
        });
        // case 3: return simpleSlopeLevel({start_x:0, start_y:0, end_x:1, end_y:-1},-1,4,4,-1);
        // case 4: return simpleSlopeLevel({start_x:0, start_y:0, end_x:2, end_y:1},1/2,4,8,2);
        // case 5: return simpleSlopeLevel({start_x:-1, start_y:0, end_x:2, end_y:1},1/3,4,12,3);
        // case 6: return simpleSlopeLevel({start_x:0, start_y:0, end_x:2, end_y:2},1,4,8,2);
        // case 7: return multiSliderLevel([{start_x:-1, start_y:1, end_x:0, end_y:0},{start_x:0, start_y:0, end_x:1, end_y:1}],[-1,1],4,4,-1,2);
        // case 8: return slidableGridLevel([
        //     {start_x:-2, start_y:-2, end_x:-1, end_y:-1},
        //     {start_x:-1, start_y:-1, end_x:0, end_y:1},
        //     {start_x:0, start_y:1, end_x:1, end_y:0},
        //     {start_x:1, start_y:0, end_x:2, end_y:1},],
        //     [1,2,-1,1],4,4,-1,10);
        // case 9: return multiSliderLevel([
        //     {start_x:-2, start_y:2, end_x:-1, end_y:-1},
        //     {start_x:-1, start_y:-1, end_x:0, end_y:-2},
        //     {start_x:0, start_y:-2, end_x:1, end_y:-1},
        //     {start_x:1, start_y:-1, end_x:2, end_y:2},],
        //     [-3,-1,1,3],4,6,-1,4);
        // case 0: // Move this line for testing
        // case 10: return multiSliderLevel(plotGrid(x => x*x, 4),
        //     [-3,-1,1,3],4,6,-1,4);
        // case 100: return slidableGridLevel([
        //     {start_x:-2, start_y:2, end_x:-1, end_y:-1},
        //     {start_x:-1, start_y:-1, end_x:0, end_y:-2},
        //     {start_x:0, start_y:-2, end_x:1, end_y:-1},
        //     {start_x:1, start_y:-1, end_x:2, end_y:2},],
        //     [-3,-1,1,3],8,8,-1,10);
        default: return endLevel();
    }
}


/**
 * Puzzles in section 1.1-1.4
 * 
 * @param params object containing:
 * - line: {start_x, start_y, end_x, end_y}
 * - gridSize
 * - sliderSize
 * - sliderDivision
 * @returns object containing:
 * - objs a list of game objects
 * - winCon a function that returns true when the level is passed
 */
function simpleSlopeLevel(params){
    // Draw the grid on the left and the slider on the right.
    // Make the squares 200 x 200 each time
    const unitSize = 200
    const width = params.grid.gridWidth * unitSize 
    const height = params.grid.gridHeight * unitSize
    const slider = new Slider(800+100+width/2,450-height/2,height, params.slider.sliderSize, params.slider.sliderDivision, params.slider.axis, 10)
    const grid = new Grid(800-100-width,450-height/2,width,height,params.grid.gridWidth, params.grid.gridHeight,10)
    grid.addLine(params.line)
    const objs = [slider,grid]
    function winCon(){
        return slider.value == params.answer && slider.grabbed == false
    }
    return {objs: objs, winCon: winCon}
}



function plotGrid(f, gridSize, x_axis, y_axis, x_scale, y_scale){
    var plot = []
    for (let i = 0; i < gridSize; i++){
        const x = i-gridSize/2
        plot.push({
            start_x: x,
            start_y: f(x),
            end_x: x+1,
            end_y: f(x+1)
        })
    }
    return plot
}

function slidableGridLevel(lines, answer, gridSize, sliderSize, sliderDivision, lineWidth){
    const grid1 = new Grid(200,200,500,500,gridSize,lineWidth)
    const grid2_x = 900
    const grid2_y = 200
    const grid2_size = 500
    const grid2 = new Grid(grid2_x,grid2_y,grid2_size,grid2_size,gridSize,lineWidth)
    var sliders = []
    var objs = [grid1,grid2]
    for (let i = 0; i < gridSize; i++){
        const slider = new Slider(grid2_x+(i+0.5)*grid2_size/gridSize,grid2_y,grid2_size,
             sliderSize, sliderDivision, -1, lineWidth*1.5)
        objs.push(slider)
        sliders.push(slider)
    }
    for (let i = 0; i < lines.length; i++){
        grid1.addLine(lines[i])
    }
    function winCon(objs){
        for (let i = 0; i < gridSize; i++){
            tickValue = (sliderSize/2 - sliders[i].value)/(sliderDivision == -1 ? 1 : sliderDivision)
            if (tickValue != answer[i])
                return false
            if (sliders[i].grabbed)
                return false            
        }
        return true
    }
    return {objs: objs, winCon: winCon}
}



function multiSliderLevel(lines, answer, gridSize, sliderSize, sliderDivision, numSliders){
    const grid = new Grid(400,200,500,500,gridSize,10,2,2)
    var objs = [grid]
    var sliders = []
    for (let i = 0; i < numSliders; i++){
        const slider = new Slider(1100+i*100,200,500, sliderSize, sliderDivision, 10)
        objs.push(slider)
        sliders.push(slider)
    }
    for (let i = 0; i < lines.length; i++){
        grid.addLine(lines[i])
    }
    function winCon(){
        for (let i = 0; i < numSliders; i++){
            tickValue = (sliderSize/2 - sliders[i].value)/(sliderDivision == -1 ? 1 : sliderDivision)
            if (tickValue != answer[i] || sliders[i].grabbed)
                return false
        }
        return true
    }
    return {objs: objs, winCon: winCon}
}



function endLevel(){
    return {objs: [], winCon: ()=>false}
}

