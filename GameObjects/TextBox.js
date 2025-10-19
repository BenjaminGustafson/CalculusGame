import {Color} from '../util/index.js'
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
        align='start',
        baseline='alphabetic',
        updateContent, 
    }){
        Object.assign(this, {
            originX, originY, content, font, color, align, baseline, updateContent
        })
    }

    update(ctx, audioManager, mouse){
        if (this.updateContent != null){
            this.content = this.updateContent()
        }
        Color.setColor(ctx,this.color)
        ctx.font = this.font
        ctx.textAlign = this.align
        ctx.textBaseline = this.baseline
        ctx.fillText(this.content, this.originX, this.originY);
    }

}