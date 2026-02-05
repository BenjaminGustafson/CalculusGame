import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"

export class ShipViewer extends GameObject {

    constructor ({  
        originX=100,
        originY=150,
        height=100,
        width=400,

    }){
        super()
        Object.assign(this, {originX, originY, width, height})

    }

    update (ctx, audio, mouse){

    }

      
}