class Slider{
    /**
     * 
     * Ex: 
     *
     * _____ i=0 value = 2   y = top_y 
     *   |
     * __|__ i=1 value = 1   y = top_y + unitLength
     *   |
     * <_|_> i=2 value = 0  axis = 2
     *   |
     * __|__ i=3 value = -1
     *
     * value = axis - i
     * y = top_y + unitLength * i 
     *   = top_y + unitLength * (axis - value)
     * 
     * value = axis - (y - top_y)/unitLength
     * @param {*} x 
     * @param {*} top_y 
     * @param {*} height 
     * @param {*} numDivision The slider will have numDivision+1 tick marks.
     * @param {*} axis Where 0 is on the slider. Counting from the top down starting at zero.
     * @param {*} circleRadius 
     */
    constructor(x, top_y, height, numDivision, startValue, axis=-1, circleRadius=15){
        this.x = x
        this.top_y = top_y
        this.height = height
        this.numDivision = numDivision
        this.grabbed = false
        this.grab_y = 0
        this.circleRadius = circleRadius
        if (axis == -1 || axis == null){
            this.axis = this.numDivision
            this.showAxis = false
        }else{
            this.axis = axis
            this.showAxis = true
        }
        this.value = startValue // The true value of the slider
        this.unitLength = this.height/this.numDivision
        // The circle goes at the tick mark given by the value
        this.circle_y = this.top_y + (this.axis - this.value)* this.unitLength
        this.circleColor = Color.red
    }

    draw(ctx){

        Color.setColor(ctx, Color.red)
        Shapes.Circle(ctx, this.x,this.circle_y, this.circleRadius)

    }

    mouseMove(x,y){
        if (this.grabbed){
            this.circle_y = Math.max(Math.min(y - this.grab_y, this.top_y+this.height), this.top_y)
            const value =  this.axis - Math.round((this.circle_y-this.top_y)/this.unitLength)
            if (value != this.value){
                // new Audio('audio/click_003.mp3').play()
                this.value = value
                console.log('value', value)
            }
            this.circle_y = this.top_y + (this.axis - this.value)* this.unitLength
        }
        if ((this.x - x)*(this.x - x) + (this.circle_y - y)*(this.circle_y- y) <= this.circleRadius*this.circleRadius){
            // request grab
            return 1
        }
        return -1
    }

    grab(x,y){
        this.grabbed = true
        this.grab_y = y - this.circle_y
        
        //new Audio('audio/click_003.ogg').play();
          
    }

    release(x,y){
        this.grabbed = false
        //new Audio('audio/click_001.ogg').play();
        // this.value = Math.round((this.circle_y-this.top_y)/this.height*this.numDivision)
        // this.circle_y = this.top_y + this.value* this.height/this.numDivision
    }

    solved(){
        this.circleColor = Color.green
    }

}