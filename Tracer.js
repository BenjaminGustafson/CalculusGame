/**
 * 
 * A discrete tracer
 * 
 * The tracer does not need to know its coordinates relative to the grid.
 * 
 */

// TODO refactor as discrete tracer or combine with continuous
class Tracer {
    frame = 0
    index = 0
    slopes = []
    solved_color = Color.blue
    unsolved_color = Color.red
    solved = false


    /**
     * 
     * @param {*} origin_x the canvas starting x coordinate
     * @param {*} origin_y the canvas starting y coordinate
     * @param {*} grid the grid to draw on
     * @param {[Slider]} sliders the sliders controlling the slopes of the tracer
     * @param {*} frames_per_unit how fast to animate the tracer
     * @param {[Target]} targets a list of the targets the tracer should hit
     */
    constructor(origin_x, origin_y, grid, sliders, frames_per_unit, targets){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.sliders = sliders
        this.grid = grid
        this.scale = grid.width/grid.gridWidth
        this.frames_per_unit = frames_per_unit
        this.targets = targets
    }
    

    draw(ctx){
        var slopes = []
        for (let i = 0; i < this.sliders.length; i++){
            slopes.push(this.sliders[i].value/this.sliders[i].numDivision*4)
            if (slopes[i] != this.slopes[i]){
                console.log(slopes[i])
                this.frame = 0
                this.index = 0
                this.targets.forEach(t => {
                    t.hit = false
                })
            }
        }
        this.slopes = slopes

        Color.setColor(ctx, this.solved ? this.solved_color : this.unsolved_color)
        var x = this.origin_x
        var y = this.origin_y
        for (let i = 0; i < this.index; i++){
            const ex = x + this.scale
            const ey = y - slopes[i] * this.scale
            Shapes.Line(ctx,x,y, ex, ey, 5,)
            x = ex
            y = ey
        }
        const ex = x +  this.scale * (this.frame / this.frames_per_unit)
        const ey = y - slopes[this.index] * this.scale * (this.frame / this.frames_per_unit)
        Shapes.Line(ctx,x,y, ex, ey, 5)

        this.solved = true
        this.targets.forEach(t => {
            if (t.isTouching(ex,ey)){
                t.hit = true
            }
            if (!t.hit){
                this.solved = false
            }
        })
        
        this.frame++
        if (this.frame % this.frames_per_unit == 0){
            this.frame = 0
            this.index++
        }
        if (this.index > slopes.length){
            this.index = slopes.length
        }
    }

}