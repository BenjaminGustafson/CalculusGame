import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"

export class ProgressBar extends GameObject {

    constructor ({  
        originX=500,
        originY=50,
        length=600,
        width=20,
    }){
        super()
        Object.assign(this, {originX, originY, width, length})
        this.value = 0.5
    }

    update (ctx, audio, mouse){
        Color.setColor(ctx, Color.gray)
        Shapes.Line(ctx, this.originX, this.originY, this.originX + this.length, this.originY, this.width, 'rounded')

        Color.setColor(ctx, Color.blue)
        Shapes.Line(ctx, this.originX, this.originY, this.originX + this.length * this.value, this.originY, this.width, 'rounded')

        Color.setColor(ctx, Color.adjustLightness(Color.blue, 30))
        const highlightY = this.originY - 0.2 * this.width
        Shapes.Line(ctx, this.originX, highlightY, this.originX + this.length * this.value, highlightY, this.width * 0.2, 'rounded')
    }

      
}