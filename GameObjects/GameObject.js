/**
 * Every element that is drawn to the screen is a GameObject. 
 */
export class GameObject {
    // States that are handled in the main loop:
    hidden = false // When hidden, the objects update function is not called
    noInput = false // When true, object recieves no input

    /**
     * GameObjects have a z-value for drawing order.
     * In the main loop gameobjects are stored in an array in
     * increaing order of z-value.
     */
    z = 0

    /**
     * Function called every frame.
     * 
     * We don't currently handle keyboard input, which could be necessary in the future.
     * Probably would just need an object of which keys were currently pressed.
    */
    update(
        ctx, // CanvasRenderingContext2D
        audioManager, // util/AudioManager
        mouse // Mouse input object, see Main.js
    ) { throw new Error("update() must be implemented");  }


    insert(list, z=0){
        this.z = z
        for (let i = list.length-1; i>=0; i--){
            if (list[i].z < this.z){
                list[i+1] = this
                return
            }else{
                list[i+1] = list [i]
            }
        }
        list[0] = this;
    }
}



/**
 * GameObjects might be grouped together for convinience.
 */
export class GameObjectGroup extends GameObject{
    constructor(objects){
        super()
        this.objects = objects
    }
    update(ctx, audio, mouse){
        this.objects.forEach(obj => obj.update(ctx, audio, mouse))
    }
}