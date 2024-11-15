class ContinuousTracer {
    frame = 0
    index = 0
    slopes = []
    solved_color = Color.blue
    unsolved_color = Color.red
    solved = false

    constructor(origin_x, origin_y, grid, input, frames_per_unit, targets){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.type = input.type
        if (input.type == "sliders"){
            this.sliders = input.sliders

        }else if (input.type == "mathBlock"){
            this.mathBlockMngr = input.mathBlockMngr
        }
        this.grid = grid
        this.scale = grid.width/grid.gridWidth
        this.frames_per_unit = frames_per_unit
        this.targets = targets
    }
    

    draw(ctx){
        var slopes = []

        Color.setColor(ctx, this.solved ? this.solved_color : this.unsolved_color)
        var x = this.origin_x
        var y = this.origin_y

        if (this.type == "sliders"){
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
        }else if (this.type == "mathBlock"){
            //console.log(this.frame)
            if (this.mathBlockMngr.field_block && this.mathBlockMngr.field_block.toFunction()){
                const fun = this.mathBlockMngr.field_block.toFunction()
                var i = 0
                while (x < this.origin_x + this.frame){
                    const gx = this.grid.canvasToGrid(x,0).x
                    const cy = y - fun(gx)
                    slopes.push(cy)
                    if (Math.abs(slopes[i]-this.slopes[i]) > 0.001){
                        console.log("reset")
                        this.frame = 0
                        this.targets.forEach(t => {
                            t.hit = false
                        })
                    }
                    Shapes.Line(ctx,x,y, x+1, cy, 5)
                    y = cy
                    x++
                    i++
                }
            }
        }
        this.slopes = slopes

    
        this.solved = true
        this.targets.forEach(t => {
            if (t.isTouching(x,y)){
                t.hit = true
            }
            if (!t.hit){
                this.solved = false
            }
        })
        

        if (this.frame <= this.grid.width && this.mathBlockMngr.field_block && this.mathBlockMngr.field_block.toFunction()){
            this.frame++
        }
    }

}

