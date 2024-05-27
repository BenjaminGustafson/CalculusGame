class Grid{

    constructor(origin_x, origin_y, width, height, gridSize, lineWidthMax){
        thix.origin_x = origin_x
        this.origin_y = origin_y
        this.width = width
        this.height = height
        this.gridSize = gridSize
        this.lineWidthMax = lineWidthMax
    }

    draw(ctx){
        Color.setColor(ctx, Color.white)
        Shapes.RoundedLine(ctx, this.x, this.top_y, this.x, this.top_y + this.height, this.lineWidthMax)

        for (let i = 0; i <= this.numDivision; i++){
            const horizontalLength = 20
            const lineWidth = this.lineWidthMax * (i % this.subdivision == 0 ? 1 : 1/2)
            if (i == this.value && !this.grabbed){
                Color.setColor(ctx, Color.red)
            }else{
                Color.setColor(ctx, Color.white)
            }
            Shapes.RoundedLine(ctx, this.x-horizontalLength, this.top_y+i*this.height/this.numDivision,
                                    this.x+horizontalLength, this.top_y+i*this.height/this.numDivision, lineWidth)
        }

        Color.setColor(ctx, Color.red)
        Shapes.Circle(ctx, this.x,this.circle_y, this.circleRadius)

    }

    mouseMove(x,y){
        if (this.grabbed){
            this.circle_y = Math.max(Math.min(y - this.grab_y, this.top_y+this.height), this.top_y)
            const value = Math.round((this.circle_y-this.top_y)/this.height*this.numDivision)
            if (value != this.value){
                new Audio('audio/click_003.ogg').play();
                this.value = value
            }
            this.circle_y = this.top_y + this.value* this.height/this.numDivision
        }
       // console.log(Math.sqrt((this.x - x)*(this.x - x) + (this.y - y)*(this.y - y)))
        if ((this.x - x)*(this.x - x) + (this.circle_y - y)*(this.circle_y- y) <= this.circleRadius*this.circleRadius){
            
            return 1
        }
        return -1
    }

    grab(x,y){
        this.grabbed = true
        this.grab_y = y - this.circle_y
        new Audio('audio/click_003.ogg').play();
    }

    release(x,y){
        this.grabbed = false
        new Audio('audio/click_001.ogg').play();
        // this.value = Math.round((this.circle_y-this.top_y)/this.height*this.numDivision)
        // this.circle_y = this.top_y + this.value* this.height/this.numDivision
    }

}

}