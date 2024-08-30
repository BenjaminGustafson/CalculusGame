
class MathBlock {

    static VARIABLE = 0
    static POWER = 1
    static EXPONENT = 2
    static FUNCTION = 3
    static CONSTANT = 4
    static BIN_OP = 5

    depth = 0
    x = 0
    y = 0 
    w = 0
    h = 0

    translate_y = 0
    scale_y = 1

    grabbed = false
    
    base_width = 50
    base_height = 50
    padding = 10
        
    lineWidth = 5

    grab_x = 0
    grab_y = 0

    manager = null

    constructor (type, token, origin_x, origin_y){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.type = type
        switch (type){
            case this.POWER:
            case this.EXPONENT:
            case this.FUNCTION:
                this.num_children = 1
                break
            case this.BIN_OP:
                this.num_children = 2
                break
            default:
                this.num_children = 0
                break
        }
        this.children = new Array(this.num_children)
        this.token = token
    }

    /**
     * Call this function after setting up the connections for the tree.
     * 
     * Calculates: depth, x, y, width, height 
     */
    setupChildren (x = this.origin_x,y=this.origin_y,depth=0){
        this.x = x
        this.y = y
        this.depth = depth
        if (this.num_children == 0){
            this.h = this.base_height
            this.w = this.base_width
        }

        

        this.w = this.padding*3 // left padding + 2 * token padding, token width added in draw method....... this won't work
        for (let i = 0; i < this.num_children; i++){
            const child = this.children[i]
            if (child){
                child.setupChildren(x+this.w+this.padding,y+this.padding,depth+1)
                this.w += child.w + this.padding
                this.h = Math.max(this.h, child.h) + this.padding*2
            }else{
                this.w += this.base_width
                this.h = this.h + this.padding*2
            }
        }
    }

    setManager(manager){
        this.manager = manager
    }


    setChild(n, child){
        this.children[n] = child
    }

    getChild(n){
        return this.children[n]
    }

    grab(mx,my){
        this.grabbed = true
        this.grab_x = mx - this.x
        this.grab_y = my - this.y
    }

    release(mx,my){
        this.grabbed = false
        this.manager.placeBlock(this,mx,my)
    }

    mouseMove(mx,my){
        //this.children.forEach(c => c.mouseMove(mx,my))
        if (this.grabbed){
            this.x = mx - this.grab_x
            this.y = my - this.grab_y
        }

        if (mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h){
            return 1
        }else{
            return -1
        }
    }


    draw (ctx){
        

        if (this.grabbed){
            Color.setColor(ctx,Color.light_gray)
        }else{
            Color.setColor(ctx,Color.white)
        }

        const ty =  Number(this.translate_y.toFixed(1))
        const sy =  Number(this.scale_y.toFixed(1))
        var full_string = this.token

        if (sy != 1){
            if (sy == -1){
                full_string = "-" + full_string
            }else{
                full_string = sy.toString() + full_string
            }
            if (sy == 0){
                full_string = "0"
            }
        }
        if (ty != 0){
            if (ty < 0 ){
                full_string = full_string  + ty.toString()
            }else{
                full_string = full_string + "+" + ty.toString()
            }
            if (sy == 0){
                full_string = ty.toString()
            }
        }

        if (this.num_children == 0){
            ctx.font = "40px monospace";
            ctx.fillText(full_string, this.x + 15, this.y + this.h/2+10);
            ctx.lineWidth = this.lineWidth
            ctx.strokeRect(this.x,this.y,this.w,this.h)
        }else if (this.num_children == 1){
            ctx.font = "40px monospace";
            ctx.fillText(this.token, this.x + 15, this.y + this.h/2+10);
            ctx.lineWidth = this.lineWidth
            ctx.strokeRect(this.x,this.y,this.w,this.h)
            if (!this.children[0]){
                ctx.strokeRect(this.x+this.w-this.base_width-this.padding,this.y+this.h/2-this.base_height/2,this.base_width,this.base_height)
            }

        }else if (this.num_children == 2){
            ctx.font = "40px monospace";
            ctx.fillText(this.token + "•", this.x + this.w/2 - ctx.measureText(this.token).width/2, this.y + this.h/2+10);
            ctx.lineWidth = this.lineWidth
            ctx.strokeRect(this.x,this.y,this.w,this.h)
            if (!this.children[0]){
                ctx.strokeRect(this.x+this.padding,this.y+this.h/2-this.base_height/2,this.base_width,this.base_height)
            }
            if (!this.children[1]){
                ctx.strokeRect(this.x+this.w-this.base_width-this.padding,this.y+this.h/2-this.base_height/2,this.base_width,this.base_height)
            }
        }
        
    }

    static fromSyntaxTree (tree){
        var num_children = 0
        if (tree.left && tree.right){
            num_children = 2
        }else if (tree.left || tree.right){
            num_children = 1
        }

        const block = new MathBlock(num_children, tree.value)
        if (tree.left){
            block.setChild(0, MathBlock.fromSyntaxTree(tree.left))
        }
        if (tree.right){
            block.setChild(1, MathBlock.fromSyntaxTree(tree.right))
        }
        block.setupChildren()
        return block
    }

    toArray (){
        var arr = [this]
        for (let i = 0; i < this.children.length; i++){
            console.log(this.children[i].token)
            arr = arr.concat(this.children[i].toArray())
        }
        return arr
    }

    


}