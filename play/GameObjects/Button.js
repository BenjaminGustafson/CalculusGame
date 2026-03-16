import {Color, Shapes} from '../util/index.js'
import { GameObject } from './GameObject.js'
import { IS_MOBILE } from '../Main.js'
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
        if (this.fitButtonToTextFlag){
            this.fitButtonToText(ctx)
            this.fitButtonToTextFlag = false
        }
        
        Color.setFill(ctx, this.bgColor)
        const buttonColor = this.active ? this.color : Color.gray 
        Color.setStroke(ctx,buttonColor)


        var pad = 0
        if (IS_MOBILE){
            pad = 15
        }

        // If mouse over
        if (this.active 
            && this.originX <= mouse.x + pad 
            && mouse.x <= this.originX + this.width + pad 
            && this.originY <= mouse.y + pad 
            && mouse.y <= this.originY + this.height + pad ){
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

        this.setupFont(ctx)
        Color.setFill(ctx, buttonColor)        
        const text_size = ctx.measureText(this.label)
        // text baseline = top + half of height + half of font...
        ctx.fillText(this.label, this.originX + this.width/2-text_size.width/2, this.originY + this.height/2 + text_size.actualBoundingBoxAscent/2 + pressY)
    }

    setupFont(ctx){
        ctx.font = "40px monospace"
        ctx.textBaseline = 'alphabetic'
        ctx.textAlign = 'start'
        ctx.font = this.fontSize + "px monospace"
    }

    fitButtonToText(ctx){
        this.setupFont(ctx)
        const textMeasure = ctx.measureText(this.label)
        this.width = textMeasure.width + 20
    }

    setLabel(label){
        this.label = label

        // Because we need access to the rendering context 
        // set a flag and call the function on the next update
        this.fitButtonToTextFlag = true
    }

    // TODO if needed 
    // fitTextToButton(){}

}