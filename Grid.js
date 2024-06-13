/**
 * Class Grid
 * 
 * Lines on the grid are supplied with the addLine method.
 * There is no mouse interaction with the object.
 */
class Grid{

    /**
     * 
     * 
     * @param {*} origin_x 
     * @param {*} origin_y 
     * @param {*} width the width in pixels
     * @param {*} height 
     * @param {*} gridWidth width in squares
     * @param {*} gridHeight
     * @param {*} lineWidthMax 
     * @param {*} x_axis The location of the x-axis, counting from the bottom left corner starting
     * at 0.
     * @param {*} y_axis The location of the x-axis, counting from the bottom left corner starting
     * at 0.
     */
    constructor(origin_x, origin_y, width, height, gridWidth, gridHeight, lineWidthMax, x_axis = -1, y_axis = -1){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.width = width
        this.height = height
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.lineWidthMax = lineWidthMax
        this.lines = []
        this.x_axis = x_axis
        this.y_axis = y_axis
    }

    draw(ctx){
        Color.setColor(ctx,Color.white)
        // Horizontal lines
        for (let i = 0; i <= this.gridHeight; i++){
            const lineWidth = this.lineWidthMax// * (i % (this.gridSize/2) == 0 ? 1 : 1/2)
            Shapes.Line(ctx,
                        this.origin_x,            this.origin_y+this.height/this.gridHeight*i, 
                        this.origin_x+this.width, this.origin_y+this.height/this.gridHeight*i, 
                        lineWidth, (i == this.x_axis ? "arrow" : "rounded"))
        }
        // Vertical lines
        for (let i = 0; i <= this.gridWidth; i++){
            const lineWidth = this.lineWidthMax
            Shapes.Line(ctx,
                        this.origin_x+this.width/this.gridWidth*i, this.origin_y, 
                        this.origin_x+this.width/this.gridWidth*i, this.origin_y+this.height, 
                        lineWidth, (i == this.y_axis ? "arrow" : "rounded"))

        }
        Color.setColor(ctx,Color.red)
        for (let i = 0; i < this.lines.length; i++){
            const line = this.lines[i]
            Shapes.LineSegment(ctx, this.origin_x+(line.start_x)*this.width/this.gridWidth, 
                                    this.origin_y+this.height+(-line.start_y)*this.height/this.gridHeight,
                                    this.origin_x+(line.end_x)*this.width/this.gridWidth,
                                    this.origin_y+this.height+(-line.end_y)*this.height/this.gridHeight,
                                    this.lineWidthMax, this.lineWidthMax*1.5)
        }


    }


    /**
     * A line is encoded as an object of the form {start_x:start_x,start_y:start_y,end_x:end_x,end_y:end_y}
     * 
     * 
     *  
    */ 
    addLine(line){
        this.lines.push(line)
    }

    

    mouseMove(x,y){
        return -1
    }

    grab(x,y){
    }

    release(x,y){
    }

}
