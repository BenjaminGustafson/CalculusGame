import {Color, Shapes} from '../util/index.js'
import { GameObject } from "./GameObject.js"
import { IS_MOBILE } from '../Main.js'

/**
 * A MathBlock is a draggable rectangle that has a function or operation.
 * 
 * MathBlocks can nest in each other to form more complex functions.
 * 
 * MathBlocks are an input option for defining a function in a puzzle.
 */
export class MathBlock extends GameObject{

    static VARIABLE = 'VARIABLE' // m x +b
    static POWER = 'POWER'    // m []^2 +b
    static EXPONENT = 'EXPONENT' // m e^[] +b
    static FUNCTION = 'FUNCTION' // m f([]) +b
    static BIN_OP = 'BIN_OP'   // []+[]
    static CONSTANT = 'CONSTANT' // c
    static FRACTION = 'FRACTION' // [] / []

    
    constructor ({
        // One of the static strings enumerating the types of block
        type,
        // The token associated with the block, e.g. e, sin, x, +, *
        token = "",
        // The coordinate (originX, originY) is where the block is spawned. 
        originX = -100,
        originY = -100,
        // The font size
        baseSize = 26,
    }){
        super()
        Object.assign(this, {type,token,originX,originY,baseSize})

        // The block's current coordinates
        this.x = originX
        this.y = originY

        switch (type){
            case MathBlock.POWER:
            case MathBlock.EXPONENT:
            case MathBlock.FUNCTION:
                this.numChildren = 1
                break
            case MathBlock.BIN_OP:
                this.numChildren = 2
                break
            case MathBlock.CONSTANT:
            default:
                this.numChildren = 0
                break
        }

        // The blocks attached to this one in left to right order
        this.children = new Array(this.numChildren)

        /**
         * Attach squares are objects of the form {x,y,w,h}.
         * They are regions where other blocks can attach
         */
        this.attachSquares = new Array(this.numChildren)
        
        // The main color of the block
        this.bgColor = Color.darkBlack

        // The color of text on the block
        this.lineColor = Color.white

        // True if the 
        this.isHighlighted = false

        /**
         * If an attach square is currently hovered over, this.attachHover
         * is be the index of that square. This is used when we draw the attach squares.
         * 
         * If no attach square is hovered over, it is null.
         */
        this.attachHover = null

        // The text on the block in left to right order
        this.content = []

        // TODO
        this.toFunctionStored = null
        
        // TODO
        this.functionChanged = false

        // How many layers deep the block is, starting at 0
        this.depth = 0
    
        // The two slider controls of blocks
        this.translateY = 0
        this.scaleY = 1
        
        // True when the block is currently grabbed by the mouse
        this.grabbed = false

        // The block is attached either to a block field or another block
        this.attached = false
        
        // This mathblock that this block is attached to 
        this.parent = null

        // If this block is a child, selfChildIndex is the index of this block
        // in its parent's children array.
        this.selfChildIndex = null

        // The amount of space between elements in the block in px
        this.padding = 7

        // The width of the entire block in px
        this.w = 50

        // The height of the entire block in px
        this.h = 50

        // The block is currently on the toolbar, or was just grabbed
        // from the toolbar.
        this.onToolBar = false

        // The MathBlockField that the block is the root of
        // or null if the block is not the root.
        this.rootOfField = null

        // Index of the attach square that is currently highlighted
        // or -1 if none are highlighted
        this.attachHover = -1

        // True if the block is being hovered by a swapping block
        this.swapHover = false

        // The associalted MathBlockManager
        this.manager = null

        // Leading text like 2*
        this.prefix = ""

        // Trailing text like "+10"
        this.suffix = ""


    }

    /**
     * It is only necessary to call update on the root block, 
     * since the functions called in update all recursively call
     * on the block's children.
     */
    update(ctx, audioManager, mouse){
        this.setContent()
        this.calculateSize(ctx)
        this.draw(ctx)
    }

    /**
     * Determine what the text content of this block is.
     */
    setContent(){
        const ty =  Number(this.translateY.toFixed(6))
        const sy =  Number(this.scaleY.toFixed(6))

        this.prefix = ""
        this.suffix = ""
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
        }

        switch (this.type){
            case MathBlock.CONSTANT:{
                    this.content = [{type:'string', string:ty.toString()}]
                }
                break
            case MathBlock.VARIABLE:
                this.content = [{type:'string', string:this.prefix + this.token + this.suffix}]
                break
            case MathBlock.FUNCTION:{
                this.content = [
                    {type:'string', string:this.prefix + this.token },
                    {type:'child', childIndex:0},
                    {type:'string', string: this.suffix}]
            }
            break
            case MathBlock.POWER:{
                this.content = [{type:'string', string:this.prefix},{type:'child', childIndex:0},{type:'string', string:'^' + this.token + this.suffix}] // todo
            }
                break
            case MathBlock.EXPONENT:{
                this.content = [{type:'string', string:this.prefix + this.token + '^'},{type:'child', childIndex:0},{type:'string', string:this.suffix}]
            }
                break
            case MathBlock.BIN_OP:{
                this.content = [
                    {type:'string', string:this.prefix + (this.prefix == '' ? '' : '(')},
                    {type:'child', childIndex:0},
                    {type:'string', string:this.token},
                    {type:'child', childIndex:1},
                    {type:'string', string: (this.prefix == '' ? '' : ')')+this.suffix},]
            }   
                break
            default:
                break
        }
        this.children.forEach( c => {
            if (c != null){
                c.setContent()
            }
        })
    }

    /**
     * Calculate the width w and height h of the block
     * based off of the text and children it contains
     * 
     * Iterate through the content (text, children, and attach squares)
     * and add padding around all content
     */
    calculateSize(ctx){
        ctx.font = this.baseSize+"px monospace"
        this.w = this.padding
        this.h = this.padding * 2 + this.baseSize
        this.content.forEach( obj => {
            if (obj.type == 'string'  && obj.string.length > 0){
                this.w += ctx.measureText(obj.string).width + this.padding 
            }else if (obj.type == 'child'){
                const child = this.children[obj.childIndex]
                if (child != null){
                    child.calculateSize(ctx)
                    this.w += child.w + this.padding
                    this.h = Math.max(this.h, child.h + this.padding*2)
                }else{ // Attach square
                    this.w += this.baseSize + this.padding
                    this.h = Math.max(this.h, this.baseSize + this.padding * 2)
                }
            }
        })
    }

    /**
     * Draw the block's rectangle, parentheses and content
     */
    draw(ctx){
        // Font setup
        ctx.font = this.baseSize+"px monospace"
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'left'

        // Color setup
        var bgColor = this.isHighlighted ? Color.green : this.bgColor
        if (this.swapHover) bgColor = Color.adjustLightness(bgColor, 50)
        const textColor = this.lineColor
        Color.setFill(ctx, bgColor)
        Color.setStroke(ctx,textColor)

        // Draw the rectangle base of the block
        const blockRadius = this.baseSize * 6 / 26
        if (!this.attached){
            Color.setFill(ctx,Color.adjustLightness(bgColor, -50))
            Shapes.Rectangle({ctx:ctx,
                originX:this.x, originY:this.y + 5, width:this.w, height:this.h,
                radius : blockRadius,
            })
        }
        Color.setFill(ctx,bgColor)
        Shapes.Rectangle({ctx:ctx,
            originX:this.x, originY:this.y, width:this.w, height:this.h,
            radius : blockRadius,
        })


        /**
         * If the block has a parent, it gets parentheses
         */
        if (this.parent){
            Color.setStroke(ctx,this.lineColor)
            // At defualt baseSize of 26px, the parens are 4 px wide (half will get clipped)
            const parenWidth = this.baseSize / 26 * 4
             // How far the paren extends into the block, default 6
            const parenLength = this.baseSize / 26 * 6
            // Set clip to left and right sides of the block
            ctx.save()
            let region = new Path2D()
            region.rect(this.x-10,0,10+parenLength,900)
            region.rect(this.x+this.w-parenLength,0,10+parenLength,900)
            ctx.clip(region)
            // Also clip the block border
            let region2 = new Path2D()
            region2.roundRect(this.x, this.y, this.w, this.h, blockRadius)
            ctx.clip(region2)

            // Stroke a rounded rectangle
            Shapes.Rectangle({
                ctx: ctx,
                originX:this.x, originY:this.y,
                width:this.w, height:this.h,
                originX:this.x, originY:this.y, width:this.w, height:this.h,
                radius: blockRadius,
                lineWidth: parenWidth,
                fill:false, stroke: true,
            })
            ctx.restore()
        }

        /**
         * Loop through the content of the block and draw it
         * 
         */
        var contentX = this.x + this.padding
        const middleY = this.y + this.h/2
        this.content.forEach( obj => {
            if (obj.type == 'string' && obj.string.length > 0){
                Color.setColor(ctx,textColor)
                ctx.fillText(obj.string, contentX, middleY)
                contentX += ctx.measureText(obj.string).width + this.padding
            }else if (obj.type == 'child'){
                const child = this.children[obj.childIndex]
                if (child != null){
                    child.x = contentX
                    child.y = middleY - child.h/2
                    child.draw(ctx)
                    contentX += child.w + this.padding
                }else{ // Attach square
                    const squareColor = Color.adjustLightness(this.bgColor, obj.childIndex == this.attachHover ? 150 : 40)
                    const square = {x: contentX, y: middleY - this.baseSize/2, w: this.baseSize, h:this.baseSize}
                    this.attachSquares[obj.childIndex] = square
                    Shapes.BorderRect({ctx:ctx, originX:square.x, originY:square.y, width:square.w, height:square.h, mainColor: squareColor, 
                        borderColor: Color.adjustLightness(squareColor, 50),
                        borderOffset: 3
                    })
                    contentX += this.baseSize + this.padding
                }
            }
        })

    }


    /**
     * Convert a MathBlock to an object with just the necessary data
     * Used when saving a block to storage
     */
    static dehydrate(mathBlock){
        const children = []
        mathBlock.children.forEach(c => children.push(MathBlock.dehydrate(c)))
        return {
            'type':mathBlock.type,
            'token':mathBlock.token,
            'scaleY':mathBlock.scaleY,
            'translateY':mathBlock.translateY,
            'x':mathBlock.x,
            'y':mathBlock.y,
            'children': children,
        }
    }

    /**
     * Convert an object with just data to a MathBlock
     * Used when loading a block from storage
     * 
     * See dehydrate() above
     */
    static rehydrate(block) {
        const obj = new MathBlock({})
    
        // Only copy primitive / safe fields
        obj.type = block.type
        obj.token = block.token
        obj.scaleY = block.scaleY
        obj.translateY = block.translateY
        obj.x = block.x
        obj.y = block.y
    
        obj.children = []
        for (let i = 0; i < block.children.length; i++) {
            if (block.children[i] != null) {
                const child = MathBlock.rehydrate(block.children[i])
                obj.setChild(i, child)
            }
        }
    
        return obj
    }
    
    /**
     * Given a mouse coordinate check if it is grabbing this block
     * 
     * Returns true if it should be grabbed
     */
    checkGrab(x,y){
        var pad = 0
        if (IS_MOBILE){
            pad = 5
        }
        return x >= this.x - pad
            && x <= this.x + this.w + pad
            && y >= this.y - pad
            && y <= this.y + this.h + pad 
    }

    /**
     * Check this block and its children to see if any are grabbed by the 
     * mouse at the given coordinate, (x,y).
     * 
     * The child that is highest on top is the one that should be grabbed.
     * It is the lowest child in the tree.
     * 
     * Returns the MathBlock object that is grabbed
     * Returns null if there is none
     */
    checkGrabRecursive(x,y){   
        if (this.checkGrab(x,y)){
            for (let i = 0; i < this.numChildren; i++){
                const c = this.children[i]
                if (c == null) continue

                const res = c.checkGrabRecursive(x,y)
                if (res != null){
                    return res
                }
            }
            return this
        }else{
            return null 
        }
    }

    /**
     * Turn off all attach squares of this block and its children.
     * 
     * Useful to ensure that all squares turn off after an attaching block 
     * passes over them. 
     */
    hoverOff (){
        this.attachHover = -1
        this.swapHover = false
        for(let i = 0; i < this.children.length; i++){
            if (this.children[i] != null){
                this.children[i].hoverOff()
            }
        }
    }

    checkHover(hoveringBlock){
        this.hoverOff()

        const attach = this.checkAttach(hoveringBlock.x, hoveringBlock.y, hoveringBlock.w, hoveringBlock.h)
        if (attach) return attach
        
        const swap = this.checkSwap(hoveringBlock.x, hoveringBlock.y, hoveringBlock.w, hoveringBlock.h, hoveringBlock.numChildren)
        if (swap) return swap

        return null
    }

    /**
     * Given a rectangular region check if that region is overlapping any 
     * of this blocks attach squares.
     * 
     * If so, return 
     * {
     * block: the MathBlock that should be attached to
     * childIndex: the index of the attach square
     * }
     * Otherwise return null
     * 
     * Also, sets this.attachHover which changes the color of the attach square. 
     * 
     * If multiple squares are overlapped, the leftmost one will be returned.
     */
    checkAttach(x,y,w,h){
        // Check all children for hover
        for(let i = 0; i < this.children.length; i++){
            // If child has a block attached, recursively call checkAttach
            if (this.children[i] != null){
                const check = this.children[i].checkAttach(x,y,w,h)
                if (check != null){
                    return check
                }
            }
            // Otherwise child is empty, and is an attach square
            else{
                const a = this.attachSquares[i]
                // Check if the block's square overlaps with the attach square
                if (x + w >= a.x && x <= a.x + a.w && y + h >= a.y && y <= a.y + a.h){
                    this.attachHover = i
                    return {action: 'attach', block: this, childIndex:i}
                }
            }
        }
        return null
    }

    /**
     * 
     * Similar to checkAttach, but look for the deepest block in the tree
     * that the given region is overlapping.
     * 
     * In order to swap, the block must have the same number of children
     */
    checkSwap(x,y,w,h, numChildren){
        // First check children for overlap
        for(let i = 0; i < this.children.length; i++){
            if (this.children[i] != null){
                const check = this.children[i].checkSwap(x,y,w,h, numChildren)
                if (check != null){
                    return check
                }
            }
        }
        // Check if the block can be swapped with this one
        if (x + w >= this.x && x <= this.x + this.w && y + h >= this.y && y <= this.y + this.h 
            && this.numChildren == numChildren
        ){
            this.swapHover = true
            return {action: 'swap', block:this}
        }
    }

    /**
     * Set a given block to be child of this block at index i 
     */
    setChild(i, child){
        this.children[i] = child
        child.attached = true
        child.depth = this.depth + 1
        child.selfChildIndex = i
        child.parent = this
        child.baseSize = this.baseSize
    }

    /**
     * Remove this block from its parent
     */
    detachFromParent(){
        this.attached = false
        this.parent.children[this.selfChildIndex] = null
        this.parent = null
        this.selfChildIndex = null
    }

    /**
     * Checks if the right and bottom edges of the block are within some bound.
     * Useful for checking if the block is too large to fit in a blockfield.
     */
    checkInBounds(xBound, yBound){
        // We don't need to check the bounds on children, since they are within the bounds of the parent block
        return this.x + this.w <= xBound && this.y + this.h <= yBound
    }

    /**
     * Recursively set the baseSize of a block and all its children
     */
    setBaseSize(baseSize){
        this.baseSize = baseSize
        this.padding = 7/26 * baseSize
        this.children.forEach(c => {if (c) c.setBaseSize(baseSize)})
    }

    /**
     * Grammar:
     * Block
     * - Brackets [] surround every block
     * Inside of block
     * - Optional scalar a and translate b, i.e. a*x+b
     * Content
     * - See MathBlock types
     * 
     * B -> [I]
     * I -> num * C + num | C + num | num * C | C
     * C -> num | var | var B | B ^ num | num ^ B | e ^ B | B + B | B * B
     * 
     * Examples:
     * [3*x+4]
     * [[x+2]^2]
     * [e^[-1*x]]
     * [2*x+-5.5]
     * [3*sin[cos[2]]]
     * [[x]+[x]]
     */
    static parse(expression) {
        /**
         * Turn a expression string into an array of token strings
         */
        function tokenize(expression) {
            // Match numbers, variables and function names, parens and operators
            const re = /-?\d+\.?\d*|[a-zA-Z]+|[\[\]()+*^]/g;
            return expression.match(re) || [];
        }

        const numRE = /-?\d+\.?\d*/
        const varRE = /[a-zA-Z]+/

        const tokens = tokenize(expression);
        let i = 0

        // B -> [I]
        function parseBlock() {
            if (tokens[i] == '[') {
                i++;
                const block = parseInside();
                if (tokens[i] != ']') {
                    throw new Error('Expected ]');
                }
                i++;
                return block;
            }
        }

        // I -> num * C + num  | num * C | C + num | C
        function parseInside(){
            let a = 1
            let b = 0
            if (numRE.test(tokens[i]) && tokens[i+1] == '*'){
                a = tokens[i]
                i += 2;
            }
            const block = parseContent()
            if (tokens[i] == '+' && numRE.test(tokens[i+1])){
                b = tokens[i+1]
                block.translateY = Number(b)
                i += 2;
            }
            block.scaleY = Number(a)
            return block
        }

        // C -> num ^ B | e ^ B | num | var ( B ) | var | B ^ num | B + B | B * B
        function parseContent() {
            let block;
            if ((numRE.test(tokens[i]) || tokens[i] == 'e') && tokens[i+1] == '^'){ // num ^ B | e ^ b
                block = new MathBlock({type: MathBlock.EXPONENT, token: tokens[i]})
                i += 2
                block.children[0] = parseBlock()
            }else if (numRE.test(tokens[i])){ // num
                block = new MathBlock({type: MathBlock.CONSTANT})
                block.translateY = Number(tokens[i])
                i++
            }else if (varRE.test(tokens[i]) && tokens[i+1] == '('){ // var ( B )
                block = new MathBlock({type: MathBlock.FUNCTION, token: tokens[i]})
                i += 2
                block.children[0] = parseBlock()
                if (tokens[i] == ')'){
                    i++
                }else {
                    throw new Error('Expected ) but received ' + tokens[i])
                }
            }else if (varRE.test(tokens[i])) { // var
                block = new MathBlock({type: MathBlock.VARIABLE, token: tokens[i]})
                i++
            } else { 
                const child0 = parseBlock()
                if (tokens[i] == '^' && numRE.test(tokens[i+1])){ // B ^ num
                    block = new MathBlock({type: MathBlock.POWER, token: tokens[i]})
                    i+=2
                }else if (tokens[i] == '+' || tokens[i] == '*'){ // B + B | B * B
                    block = new MathBlock({type: MathBlock.BIN_OP, token: tokens[i]})
                    i++
                }else {
                    throw new Error('Unexpected input on token ' + tokens[i])
                }
                block.children[0] = child0
                block.children[1] = parseBlock()
            }

            return block
        }

        const block = parseBlock()
        if (i < tokens.length) {
            throw new Error('Unexpected input on token ' + tokens[i]);
        }
        return block;
    }

    /**
     * Flatten this block and its children into an array
     */
    toArray (){
        var arr = [this]
        for (let i = 0; i < this.children.length; i++){
            console.log(this.children[i].token)
            arr = arr.concat(this.children[i].toArray())
        }
        return arr
    }


    /**
     * 
     * Returns null if the function tree is not complete
     * 
     * @param {*} scale 
     * @param {*} offset 
     * @returns 
     */
    toFunction(constants={}){
        switch(this.type){
            case MathBlock.CONSTANT:
                return x => this.translateY
            case MathBlock.VARIABLE:
                if (constants[this.token] != null){
                    return x => this.translateY + this.scaleY*constants[this.token]
                }
                return (x => this.translateY + this.scaleY*x)
            case MathBlock.POWER:
                if (this.children[0] != null && this.children[0].toFunction(constants) != null){
                    return (x => (this.translateY + this.scaleY*(this.children[0].toFunction(constants)(x))**this.token))
                }else{
                    return null
                }
            case MathBlock.EXPONENT:{
                if (this.children[0] != null && this.children[0].toFunction(constants) != null){
                    const base = this.token == 'e' ? Math.E : Number(this.token)
                    return (x => (this.translateY + this.scaleY*Math.pow(base,(this.children[0].toFunction(constants)(x)))))
                }else{
                    return null
                }
            }
            case MathBlock.FUNCTION:
                if (this.children[0] == null || this.children[0].toFunction(constants) == null){
                    return null
                }
                switch (this.token){
                    case "sin":
                        return (x => this.translateY + this.scaleY*Math.sin(this.children[0].toFunction(constants)(x)))
                    case "cos":
                        return (x => this.translateY + this.scaleY*Math.cos(this.children[0].toFunction(constants)(x)))
                    default:
                        return null
                }
            case MathBlock.BIN_OP:
                if (this.children[0] == null || this.children[0].toFunction(constants) == null || this.children[1] == null || this.children[1].toFunction(constants) == null){
                    return null
                }
                switch (this.token){
                    case "+":
                        return x =>  this.translateY + this.scaleY*(this.children[0].toFunction(constants)(x) + this.children[1].toFunction(constants)(x))
                    case "*":
                        return x =>  this.translateY + this.scaleY*(this.children[0].toFunction(constants)(x) * this.children[1].toFunction(constants)(x))
                    case "/":
                        return x =>  this.translateY + this.scaleY*(this.children[0].toFunction(constants)(x) / this.children[1].toFunction(constants)(x))
                    case "^":
                        return x =>  this.translateY + this.scaleY*(Math.pow(this.children[0].toFunction(constants)(x), this.children[1].toFunction(constants)(x)))
                    default:
                        return null
                }
            default:
                return null

        }
    }

    /**
     * Convert the block to a human readable string
     */
    toString(){
        var str = ""
        this.content.forEach(obj =>{
            if (obj.type == 'string'){
                str += obj.string
            }else if (obj.type == 'child'){
                const child = this.children[obj.childIndex]
                if (child != null)
                    str += child.toString()
                else
                    str += '[]'
            }
        })
        return str
    }
}