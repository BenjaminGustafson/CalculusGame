import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"

export class ShipViewer extends GameObject {

    constructor ({  
        originX=100,
        originY=150,
        height=100,
        width=400,
        fun,
        tracer,
    }){
        super()
        Object.assign(this, {originX, originY, height, width, fun, tracer})
        this.shipImg = document.getElementById("shipSide")
        this.asteroidImg = document.getElementById("asteroidImg")
        this.shipX = fun(-10)
        this.shipWidth = 3
        this.asteroids = []
        this.state = ''
    }

    update (ctx, audio, mouse){
        Color.setFill(ctx, Color.darkBlack)
        ctx.save()
        ctx.beginPath()
        ctx.rect(this.originX, this.originY, this.width, this.height)
        ctx.clip()
        Shapes.Rectangle({ctx:ctx, originX:this.originX, originY:this.originY, width:this.width,height:this.height,inset:true} )
        if (this.state == 'Trace'){
            this.shipX = this.tracer.currentY
            this.shipXMin = this.shipX - this.shipWidth/2
            this.shipXMax = this.shipX + this.shipWidth/2
        }
        ctx.save() // Local coordinates at center of rect
        ctx.translate(this.originX + this.width/2, this.originY + this.height/2)
        ctx.scale((this.width-100)/20,(this.width-100)/20)
        ctx.save() // Flip ship if needed
        ctx.translate(this.shipX,0)
        if (this.tracer.currentDelta < 0) ctx.scale(-1,1)
        ctx.drawImage(this.shipImg, -this.shipWidth/2,-this.shipWidth/3/2,this.shipWidth,this.shipWidth/3)
        ctx.restore() // Back to local coords
        const t = this.tracer.currentX

        if (this.state == 'Trace'){
            var hit = false
            for (let asteroid of this.asteroids){
                if (asteroid.y(t) > -5 && asteroid.y(t) < 5)
                    ctx.drawImage(this.asteroidImg, asteroid.x-0.5,asteroid.y(t)-0.5, 1,1)
                if (this.checkCollision(asteroid, this.shipX, t)){
                    hit = true
                }
            }
            if (hit){
                audio.play('back_001', {pitch:(Math.random())*3-6, volume:0.7})
                ctx.fillStyle = `rgb(255,0,0,0.5)`
                ctx.fillRect(this.shipX - this.shipWidth/2, - this.shipWidth/3/2, this.shipWidth,this.shipWidth/3)
            }
        }

        this.prevShipX = this.shipX
        ctx.restore() // back to global coords
        ctx.restore() // unclip

        // for (let asteroid of this.asteroids){
        //     Color.setColor(ctx,asteroid.color)
        //     ctx.fillRect(gridLeft.gridToCanvasX(asteroid.tIntercept)-10,gridLeft.gridToCanvasY(asteroid.x), 20,20)
        // }
        // for (let i = -10; i < 10; i+=0.1){
        //     Color.setColor(ctx,Color.magenta)
        //     ctx.strokeRect(gridLeft.gridToCanvasX(i)-30,gridLeft.gridToCanvasY(fun(i))-10, 60,20)
        // }
    }

    checkCollision (asteroid, shipX, time){
        if (asteroid.y(time) -0.5 > 0.5 || asteroid.y(time) + 0.5 < -0.5 
        || asteroid.x > shipX + this.shipWidth/2 || asteroid.x+1 < shipX - this.shipWidth/2){
                return false
        }else {
            return true
        }
    }

    generateAsteroids (){
        outerLoop: for (let i = 0; i < 100; i++){
            const asteroid = {
                x: Math.random()*20-10, 
                tIntercept: Math.random()*20-10,
                slope: (Math.floor(Math.random()*2)*4-2),
                y: function(t){
                    return this.slope * t - this.tIntercept * this.slope
                },
                color: Color.red,
            }
            for (let t = asteroid.tIntercept-0.5; t <= asteroid.tIntercept + 0.5; t+=0.01){
                if (this.checkCollision(asteroid, this.fun(t), t)){
                    continue outerLoop
                    //asteroid.color = Color.blue
                }
            }
            this.asteroids.push(asteroid)
        }
    }      
}