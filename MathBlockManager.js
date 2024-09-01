class MathBlockManager {

    highlighted = null
    field_block = null


    constructor (blocks, field_x, field_y, translate_y_slider,scale_y_slider){
        this.blocks = blocks
        this.field_x = field_x
        this.field_y = field_y
        this.width = 400
        this.height = 50
        this.translate_y_slider = translate_y_slider
        this.scale_y_slider = scale_y_slider
        blocks.forEach(b => b.setManager(this));
    }

    draw(ctx){
        if (this.field_block == null){
            Color.setColor(ctx,Color.gray)
            Shapes.Rectangle(ctx,this.field_x,this.field_y,this.width,this.height,10,true)
        }
        this.blocks.forEach(b => b.draw(ctx))
    }

    placeBlock(block,x,y){
        console.log(x,y)
        if (this.field_block == null && x >= this.field_x && x <= this.field_x + this.width && y >= this.field_y && y <= this.field_y + this.height){
            block.x = this.field_x
            block.y = this.field_y
            this.field_block = block
            block.attached = true
        }else{
            block.x = block.origin_x
            block.y = block.origin_y
            if (block == this.field_block){
                this.field_block = null
            }
            block.attached = false
        }
    }

    mouseMove(x,y){
        if (this.field_block){
            this.field_block.translate_y = this.translate_y_slider.value
            this.field_block.scale_y = this.scale_y_slider.value
        }
        return -1
    }

    grab(x,y){
    }

    release(x,y){
    }



}