import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"
export class Label extends GameObject{

    /**
     * 
     * By default we put the label to the left of the given point.
     */
    constructor({
        originX,
        originY,
        text,
        fontSize = 20,
        textAlign = 'right',
        textBaseline = 'middle',
        textColor = Color.white,
        bgColor = Color.darkBlack
    }){
        super()
        Object.assign(this, {originX, originY, text, fontSize, textAlign, 
            textBaseline, textColor, bgColor
        })
    }

    update(ctx, mouse, audio){
        ctx.font = `${this.fontSize}px monospace`
        ctx.textAlign = this.textAlign
        ctx.textBaseline = this.textBaseline
        const textWidth = ctx.measureText(this.text).width
        const labelPad = 10
        const labelRight = this.originX

        Color.setColor(ctx, this.bgColor)
        Shapes.Rectangle({
            ctx: ctx,
            originX: labelRight - labelPad * 2 - textWidth,
            originY: this.originY - this.fontSize/2,
            width: textWidth + 20,
            height: this.fontSize,
            shadow: 8,
        })
        Color.setColor(ctx, this.textColor)
        ctx.fillText(this.text,labelRight - labelPad, this.originY)   
    }
}
