// TODO: Figure out class interaction
class Target{

    hit = false

    constructor(x,y,size){
        this.unhit_color = Color.magenta
        this.hit_color = Color.blue
        this.size = size
        this.x = x
        this.y = y
    }

    draw(ctx){
        Color.setColor(ctx,this.hit ? this.hit_color : this.unhit_color)
        Shapes.Rectangle(ctx,this.x-this.size/2,this.y-this.size/2,this.size,this.size,5,true)
    }

    isTouching(x,y){
        return x >= this.x - this.size/2 && x <= this.x+this.size/2 && y >= this.y - this.size/2 && y <= this.y + this.size/2
    }
}