import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"

export class ShipPosition extends GameObject {
    constructor({
        originX,
        originY,
        canvasWidth=400,
        canvasHeight=400,
        gridXMin=-2,
        gridXMax=2,
        tMax=4,
    }){
        super()
        Object.assign(this, { originX, originY, canvasWidth, canvasHeight, gridXMin, gridXMax, tMax})


    }

    update(ctx, audio, mouse){


    }
}
