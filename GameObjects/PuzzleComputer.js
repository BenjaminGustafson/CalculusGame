import { Color } from "../util/index.js"
import { GameObject } from "./GameObject.js"

const computerSETrans = document.getElementById('computerSETrans')
const computerSWTrans = document.getElementById('computerSWTrans')

export class PuzzleComputer extends GameObject{

    constructor({color = Color.black, dir = 'SE', x, y, text='1'}){
        super()
        Object.assign(this, {color, x, y, dir,text})
    }

    update(ctx,audio,mouse){
        if (this.dir == 'SE'){
            ctx.save()
            ctx.translate(this.x + 236, this.y + 273);
            ctx.transform(1, -0.5, 0, 1, 0, 0);
            Color.setColor(ctx, this.color)
            ctx.fillRect(0,0,30,18)
            Color.setColor(ctx, Color.white)
            ctx.font = '18px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillText(this.text.toUpperCase(),15,0)
            ctx.restore()
            ctx.drawImage(computerSETrans, this.x, this.y)
            
        }else if (this.dir == 'SW'){
            ctx.save()
            ctx.translate(this.x + 246, this.y + 258)
            ctx.transform(1, 0.5, 0, 1, 0, 0);
            Color.setColor(ctx, this.color)
            ctx.fillRect(0,0,30,18)
            Color.setColor(ctx, Color.white)
            ctx.font = '18px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillText(this.text.toUpperCase(),15,0)
            ctx.restore()
            ctx.drawImage(computerSWTrans, this.x, this.y)
        }else{
            console.warn('invalid dir', this.dir)
        }
    }

}