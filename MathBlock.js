
class MathBlock {

    static VARIABLE = 0 // mx+b
    static POWER = 1    // m[]^2+b
    static EXPONENT = 2 // me^[]+b
    static FUNCTION = 3 // mf([])+b
    static BIN_OP = 4   // []+[] ?include scale or no... []*[] it would have weird interactions with the inside...

    depth = 0
    
    translate_y = 0
    scale_y = 1
    
    grabbed = false
    attached = false

    base_width = 50
    base_height = 50
    padding = 10
    w = 50
    h = 50
    
    lineWidth = 5

    grab_x = 0
    grab_y = 0

    manager = null

    prefix = ""
    suffix = ""

    constructor (type, token, origin_x, origin_y){
        this.origin_x = origin_x
        this.origin_y = origin_y
        this.x = origin_x
        this.y = origin_y
        this.type = type
        switch (type){
            case MathBlock.POWER:
            case MathBlock.EXPONENT:
            case MathBlock.FUNCTION:
                this.num_children = 1
                break
            case MathBlock.BIN_OP:
                this.num_children = 2
                break
            default:
                this.num_children = 0
                break
        }
        this.children = new Array(this.num_children)
        this.token = token
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
                this.prefix = "-"
            }else{
                this.prefix = sy.toString()
            }
            if (sy == 0){
                this.prefix = "0"
            }
        }
        if (ty != 0){
            if (ty < 0 ){
                this.suffix = ty.toString()
            }else{
                this.suffix = "+" + ty.toString()
            }
            if (sy == 0){
                this.suffix = ty.toString()
            }
        }

        ctx.font = "40px monospace";
        if (this.attached){
            switch (this.type){
                case MathBlock.VARIABLE:
                    const str = this.prefix + this.token + this.suffix 
                    this.w = ctx.measureText(str).width + this.padding*2
                    ctx.fillText(str, this.x + this.padding, this.y + this.h/2+10);
                    Shapes.Rectangle(ctx, this.x, this.y, this.w, this.h, this.lineWidth)
                    break
                case MathBlock.FUNCTION:
                    const str1 = this.prefix + this.token + "("
                    const str2 = ")" + this.suffix
                    const w1 = ctx.measureText(str1).width
                    const w2 = ctx.measureText(str2).width
                    this.w = w1+w2 + this.padding*2
                    ctx.fillText(str1, this.x + this.padding, this.y + this.h/2+10)
                    ctx.fillText(str2, this.x + this.padding + w1, this.y + this.h/2+10)
                    Shapes.Rectangle(ctx, this.x, this.y, this.w, this.h, this.lineWidth)
                    break
                default:
                    break
            }
        }else{
            ctx.fillText(this.token, this.x + this.padding, this.y + this.h/2+10);
            Shapes.Rectangle(ctx, this.x, this.y, this.w, this.h, this.lineWidth)
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