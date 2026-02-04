import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"

/**
 * A GameObject to simplify drawing text.
 * 
 * See https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
 */
export class TextBox extends GameObject{

    constructor({
        originX,originY,
        content="",
        font='20px monospace',
        color=Color.white,
        bgColor=null,
        align='start',
        baseline='alphabetic',
        updateContent, 
        padding=0,
    }){
        super()
        Object.assign(this, {
            originX, originY, content, font, color, align, baseline, updateContent, bgColor, padding
        })
    }

    update(ctx, audioManager, mouse){
        if (this.updateContent != null){
            this.content = this.updateContent()
        }
        ctx.font = this.font
        ctx.textAlign = this.align
        ctx.textBaseline = this.baseline
        if (this.bgColor != null){
            Color.setColor(ctx,this.bgColor)
            const textMeasure = ctx.measureText(this.content)
            Shapes.Rectangle({ ctx: ctx,
                originX: this.originX - textMeasure.actualBoundingBoxLeft - 10 - this.padding,
                originY: this.originY - textMeasure.fontBoundingBoxAscent - this.padding, 
                width: textMeasure.actualBoundingBoxLeft + textMeasure.actualBoundingBoxRight + 20 + this.padding*2, 
                height: textMeasure.fontBoundingBoxAscent + textMeasure.fontBoundingBoxDescent + this.padding*2,
                inset:true,
            })
        }
        Color.setColor(ctx,this.color)
        ctx.fillText(this.content, this.originX, this.originY);
    }

}