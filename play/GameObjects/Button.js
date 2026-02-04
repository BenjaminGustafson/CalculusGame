import {Color, Shapes} from '../util/index.js'
import { GameObject } from './GameObject.js'
/**
 * A button GameObject
 * 
 * Buttons are rectangular and have a text label.
 * 
 */
export class Button extends GameObject{

    active = true

    /**
     * 
     * @param {number} originX x-value of left of button rectangle 
     * @param {number} originY y-value of top of button rectangle
     * @param {number} width
     * @param {number} height 
     * @param {Function} onclick function that is called when button is clicked
     * @param {string} label the text to go in the button
     */
    constructor({
        originX, originY,
        width = 50, height =50, 
        onclick = (() =>{}),
        label = "",
        color = Color.white,
        lineWidth = 5,
        bgColor = Color.darkBlack,
        fontSize = 30,
        onhover = (() => {})
    }){
        super()
        Object.assign(this, {
            originX, originY,
            width, height,
            onclick,
            label,
            color,
            lineWidth,
            bgColor, 
            fontSize,
            onhover
        })
        this.visible = true // when false the button is not drawn, but is still clickable
        this.active = true // when false the button is not clickable and is drawn in gray

        this.pressed = false
    }

    update(ctx, audioManager, mouse){
        
        Color.setFill(ctx, this.bgColor)
        const buttonColor = this.active ? this.color : Color.gray 
        Color.setStroke(ctx,buttonColor)


        // If mouse over
        if (this.active && this.originX <= mouse.x && mouse.x <= this.originX + this.width && this.originY <= mouse.y && mouse.y <= this.originY + this.height){
            // Mouse pressed on button
            if (mouse.down){
                mouse.down = false // don't allow clicking multiple things
                audioManager.play('click_003')
                this.pressed = true
            }
            // Mouse hovering over button
            else{
                this.onhover(ctx, audioManager, mouse)
            }
            // Mouse released on button
            if (this.pressed && !mouse.held){
                this.onclick(audioManager)
            }
            //Color.setColor(ctx,Color.adjustLightness(this.color,50))
            mouse.cursor = 'pointer'
        }
        if (!mouse.held){
            this.pressed = false
        }

        // Drawing:
        if (!this.visible){
            return
        }

        if (!this.pressed){
            Color.setFill(ctx, Color.adjustLightness(this.bgColor, -50))
            Shapes.Rectangle({ctx:ctx,
                originX:this.originX,originY:this.originY+5,
                width:this.width,height:this.height,
                lineWidth:this.lineWidth,stroke:false,fill:true,
                radius:10,
            })
        }
        const pressY = this.pressed ? 5 : 0

        Color.setFill(ctx, this.bgColor)
        Shapes.Rectangle({ctx:ctx,originX:this.originX,originY:this.originY + pressY,
            width:this.width,height:this.height,
            lineWidth:this.lineWidth,stroke:false,fill:true,
            radius:10,
        })

        ctx.font = "40px monospace"
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        Color.setFill(ctx, buttonColor)
        var text_size = ctx.measureText(this.label)
        // Adjust to fit inside label
        const font_size = Math.min(40 * this.width / text_size.width * 0.8 - 10, 40)
        ctx.font = this.fontSize + "px monospace"
        text_size = ctx.measureText(this.label)
        // text baseline = top + half of height + half of font...
        ctx.fillText(this.label, this.originX + this.width/2-text_size.width/2, this.originY + this.height/2 + text_size.actualBoundingBoxAscent/2 + pressY)
    }

}