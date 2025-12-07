import { Color, Shapes } from "../util/index.js"
import { GameObject } from "./GameObject.js"

/**
 * A DrawFunction is a GameObject that lets you draw a function
 * onto a grid using the mouse. 
 */
export class DrawFunction extends GameObject{
    constructor({grid,
        numPoints = 100,
        defaultValue = 0,
        color = Color.red,
        lineWidth = 5,
    }){
        super()
        Object.assign(this, {grid, numPoints, defaultValue, color, lineWidth})
        // Index i corresponds to value of function on
        //  the interval  [gridX + i * precision, gridX + (i+1) * precision]
        this.gridYs = []
        for (let i = 0; i < numPoints; i ++){
            this.gridYs.push(defaultValue)
        }

        /**
         * isConnected 
         */
        this.isConnected = []
        for (let i = 0; i < numPoints; i ++){
            this.isConnected.push(true)
        }

        // States: wait, draw, 
        this.state = 'wait'

        this.newDrawing = []
        this.prevCanvasX = 0
        this.prevCanvasY = 0
    }

    gridXToIndex(x){
        return Math.floor((x - this.grid.gridXMin) * (this.numPoints-1) / this.grid.gridWidth)
    }

    indexToGridX(i){
        return this.grid.gridXMin + i * this.grid.gridWidth / (this.numPoints-1)
    }

    indexToCanvasX(i){
        return this.grid.canvasX + i * this.grid.canvasWidth / (this.numPoints-1)
    }

    canvasXToIndex(x){
        return Math.floor((x - this.grid.canvasX) * (this.numPoints-1) / this.grid.canvasWidth)
    }

    outputFunction(x){
        var i = this.gridXToIndex(x)
        if (i < 0) i = 0
        if (i > this.numPoints - 1) i = this.numPoints - 1
        return this.gridYs[i]
    }

    update(ctx, audioManager, mouse){
        var mx = mouse.x
        var my = mouse.y
        if (mouse.x < this.grid.canvasX && mouse.x > this.grid.canvasX - 20){
            mx = this.grid.canvasX
        }
        if (mouse.x > this.grid.canvasX + this.grid.canvasWidth && mouse.x < this.grid.canvasX + this.grid.canvasWidth + 20){
            mx = this.grid.canvasX + this.grid.canvasWidth
        }
        if (mouse.y < this.grid.canvasY && mouse.y > this.grid.canvasY - 20){
            my = this.grid.canvasY
        }
        if (mouse.y > this.grid.canvasY + this.grid.canvasHeight && mouse.y < this.grid.canvasY + this.grid.canvasHeight + 20){
            my = this.grid.canvasY + this.grid.canvasHeight
        }

        if (mouse.held && this.grid.isInBoundsCanvasX(mx)){
            if (this.state == 'draw'){
                const x1 = this.canvasXToIndex(this.prevCanvasX)
                const x2 = this.canvasXToIndex(mx)
                // Draw left to right
                if (x1 < x2){
                    for (let i = x1; i <= x2; i++){
                        const t = (i - x1)/(x2 - x1)
                        this.gridYs[i] = this.grid.canvasToGridYBounded(t * my + (1-t) * this.prevCanvasY)
                        this.isConnected[i] = true
                    }
                    this.isConnected[x2] = false
                    // Draw right to left
                }else if(x1 > x2){
                    for (let i = x2; i <= x1; i++){
                        const t = (i - x2)/(x1 - x2)
                        this.gridYs[i] = this.grid.canvasToGridYBounded(t * this.prevCanvasY + (1-t) * my)
                        this.isConnected[i-1] = true
                    }
                    this.isConnected[x2-1] = false
                }

                if (this.penDown){
                    if (x1 != x2){
                        // only drop pen if it has moved
                        this.penDown = false
                    }
                    if (x1 < x2) {
                        // draw left to right, so disconnect left
                        this.isConnected[x1-1] = false
                    }else { // draw right to left, so disconnect right
                        this.isConnected[x1] = false
                    }
                }
            // Pen down
            }else if (this.state == 'wait' && this.grid.isInBoundsCanvasY(my)){
                this.state = 'draw'
                this.penDown = true // true on the first frame where pen is down only
            }
        }
        // Pen up
        else if (this.state == 'draw'){
            this.state = 'wait'
        }
       
        this.prevCanvasY = my
        this.prevCanvasX = mx


        Color.setColor(ctx, this.color)
        ctx.lineWidth = this.lineWidth
        //ctx.beginPath()
        for (let i = 0; i < this.gridYs.length-1; i ++){
            const y1 = this.grid.gridToCanvasY(this.gridYs[i])
            const y2 = this.grid.gridToCanvasY(this.gridYs[i+1])
            const x1 = this.indexToCanvasX(i)
            const x2 = this.indexToCanvasX(i+1)
            if (this.isConnected[i]){
                Shapes.Line(ctx,x1,y1,x2,y2,this.lineWidth,'rounded')
            }else{
                Shapes.Circle({ctx: ctx, centerX:this.indexToCanvasX(i), centerY:this.grid.gridToCanvasY(this.gridYs[i]), radius:this.lineWidth/2})  
            }
        }
        //ctx.stroke()
    }
}