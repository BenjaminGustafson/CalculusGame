class Tracer {
    frame = 0
    index = 0
    slopes = []

    constructor(origin_x, origin_y, scale, sliders, frames_per_unit){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.sliders = sliders
        this.scale = scale
        this.frames_per_unit = frames_per_unit
    }
    

    draw(ctx){
        var slopes = []
        for (let i = 0; i < this.sliders.length; i++){
            slopes.push(this.sliders[i].value/this.sliders[i].numDivision*4)
            if (slopes[i] != this.slopes[i]){
                console.log(slopes[i])
                this.frame = 0
                this.index = 0
            }
        }
        this.slopes = slopes

        Color.setColor(ctx, "red")
        var x = this.origin_x
        var y = this.origin_y
        for (let i = 0; i < this.index; i++){
            const ex = x + this.scale
            const ey = y - slopes[i] * this.scale
            Shapes.Line(ctx,x,y, ex, ey, 5)
            x = ex
            y = ey
        }
        const ex = x +  this.scale * (this.frame / this.frames_per_unit)
        const ey = y - slopes[this.index] * this.scale * (this.frame / this.frames_per_unit)
        Shapes.Line(ctx,x,y, ex, ey, 5)

        this.frame++
        if (this.frame % this.frames_per_unit == 0){
            this.frame = 0
            this.index++
        }
        if (this.index > slopes.length){
            this.index = slopes.length
        }
    }

    mouseMove(x,y){
        return -1
    }

    grab(x,y){
    }

    release(x,y){
    }

}