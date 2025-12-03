import {Color, Shapes} from '../util/index.js'
import * as GameObjects from "./index.js"

export class ShipPosition extends GameObjects.GameObject {
    constructor({
        originX,
        originY,
        positionGrid,
        positionTracer,
        positionTargetGroup,
        canvasWidth=400,
        canvasHeight=400,
    }){
        super()
        Object.assign(this, { originX, originY, canvasWidth, canvasHeight, positionGrid, positionTracer, positionTargetGroup})

        this.grid = new GameObjects.Grid({
            canvasX: originX, canvasY: originY, canvasWidth: canvasWidth, canvasHeight: canvasHeight,
            arrows:false
        })

        this.pSlider = new GameObjects.Slider({
            canvasX: this.originX,
            canvasY: this.originY+this.canvasHeight,
            circleRadius: 10,
            minValue: positionGrid.gridYMin,
            maxValue: positionGrid.gridYMax,
            vertical:false,
            increment: 0.0001,
        })
        this.pSlider.clickable = false

        this.tSlider = new GameObjects.Slider({
            canvasX: this.originX,
            canvasY: this.originY,
            circleRadius: 15,
            minValue: positionGrid.gridXMin,
            maxValue: positionGrid.gridXMax,
            vertical:false,
            showAxis:true,
        })
        this.tSlider.clickable = false

        const shipScale = 0.6
        this.shipImage = new GameObjects.ImageObject({
            originX: this.originX,
            height:55*shipScale,
            width:200*shipScale, 
            originY: this.originY+this.canvasHeight+55/2*shipScale,
            id : 'shipSide',
        })

        this.time = 0
        this.position = 0
        this.prevPosition = 0

        this.targetGroupClone = Object.create(positionTargetGroup)        

        // this.playing = false
        // this.startValue = 0
        // this.startTime = 0

        // this.playPauseButton = new GameObjects.Button({
        //     originX: this.originX, 
        //     originY: this.originY + this.canvasHeight*0.1,
        //     width: 50,
        //     height: 50,
        //     onclick: () => {
        //         // Restart
        //         if (this.tSlider.value >= this.tSlider.maxValue) {
        //             this.playing = true
        //             this.tSlider.value = 0
        //             this.startTime = Date.now()
        //             this.startValue = 0
        //             this.tSlider.setValue(0)
        //         } else {
        //             // Pause
        //             if (this.playing) {
        //                 this.playing = false
        //             // Play
        //             } else {
        //                 this.startTime = Date.now()
        //                 this.startValue = this.tSlider.value
        //                 this.playing = true
        //             }
        //         }
        //     },
        //     label: "⏸", lineWidth: 5
        // })

        this.positionTracer.autoStart = false
        this.playPauseButton = new GameObjects.Button({
            originX: this.originX + this.canvasWidth/2 - 25, 
            originY: this.originY - 75,
            width: 50,
            height: 50,
            onclick: () => {
                if (this.positionTracer.state == GameObjects.FunctionTracer.STOPPED_AT_END) {
                    this.positionTracer.reset()
                }else{
                    this.positionTracer.start()
                }
            },
            label: "⏵", lineWidth: 5
        })
        
    }

    update(ctx, audio, mouse){
        this.time = this.positionTracer.currentX
        this.position = this.positionTracer.currentY
        this.tSlider.setValue(this.time)
        this.pSlider.setValue(this.position)


        // Ship position
        this.shipImage.originX = this.pSlider.circlePos - this.shipImage.width/2
        this.shipImage.flip = this.position < this.prevPosition

        // Text
        // Color.setColor(ctx, Color.white)
        // ctx.font = '26px monospace'
        // ctx.textAlign = 'left'
        // ctx.textBaseline = 'top'
        // ctx.fillText('t = ' + this.tSlider.value.toFixed(1), this.originX, this.originY+this.canvasHeight*0.3)
        // ctx.fillText('p(t) = ' + this.pSlider.value.toFixed(1), this.originX, this.originY+this.canvasHeight*0.4)

        // Time button
        // Stopped at end
        // if (this.tSlider.value >= this.tSlider.maxValue) {
        //     this.tSlider.setValue(this.tSlider.maxValue)
        //     this.playing = false
        //     this.playPauseButton.label = '⏮'
        // }else {
        //     // Playing
        //     if (this.playing) {
        //         this.tSlider.setValue((Date.now() - this.startTime) / 1000 + this.startValue) // time in secs to 1 decimal
        //         this.playPauseButton.label = '⏸'
        //     } 
        //     // Paused
        //     else {
        //         this.playPauseButton.label = '⏵'
        //     }
        // }

        if (this.positionTracer.state == GameObjects.FunctionTracer.STOPPED_AT_END) {
            this.playPauseButton.label = '⏮'
        }else{
            this.playPauseButton.label = '⏵'
        }
        

        // Update children
        //this.grid.update(ctx)
        this.pSlider.update(ctx,audio,mouse)
        //this.tSlider.update(ctx,audio,mouse)
        this.shipImage.update(ctx,audio,mouse)
        this.playPauseButton.update(ctx,audio,mouse)

        ctx.translate(this.originX+this.canvasWidth, this.originY + this.canvasHeight + this.time*this.canvasHeight/4)
        ctx.scale(-1,1)
        ctx.rotate(-Math.PI/2)
        ctx.translate(-this.positionGrid.canvasX, -this.positionGrid.canvasY)
        this.targetGroupClone.update(ctx,audio,mouse)
        ctx.resetTransform()

        this.prevPosition = this.position
    }
}
