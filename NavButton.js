class NavButton{
    constructor(origin_x, origin_y, width, height, link){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.width = width
        this.height = height
        this.link = link
    }

    draw(ctx){
    }

    mouseMove(x,y){
        if (this.origin_x <= x && x <= this.origin_x + this.width && this.origin_y <= y && y <= this.origin_y + this.height){
            return 2
        }
        return -1
    }

    // We need the mouse down data, but the object doesn't get grabbed
    grab(x,y){
        if (this.origin_x <= x && x <= this.origin_x + this.width && this.origin_y <= y && y <= this.origin_y + this.height){
            
        }
    }

    release(x,y){
    }

}