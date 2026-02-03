import { GameObject } from "./GameObject.js";
import { ImageObject } from "./ImageObject.js";
import { Button } from "./Button.js";
import { Color, Shapes } from "../util/index.js";

export class DialogueBox extends GameObject{

    constructor({portraitIds,
        text = [], // [{speaker:'', string: ''}]
        onComplete = () => {},
        originY = 600,
     }){
        super()
        Object.assign(this, {portraitIds, text, onComplete, originY})

        this.msPerLetter = 50
        this.stopped = true
        this.textIndex = -1 // text[textIndex]
        this.time = 0
        this.portraitImages = {}
        for (let i = 0; i < portraitIds.length; i++){
            this.portraitImages[portraitIds[i]] = new ImageObject({originX:0, originY:this.originY-50, width:300,height:300, id:portraitIds[i]})
        }
        this.lineIndex = 0 // lines[textIndex][lineIndex]
        this.letterIndex = 0

        this.lines = [] // [['text 0, line 0', 'line 1'], ...]

        // Split text into lines 
        for (let i = 0; i < text.length; i++){
            var textLines = [] // ['text i, line 0', ...]
            const words = text[i].string.split(' ')
            var charCount = 0
            var lineNum = 0
            var line = ''
            for (let j = 0; j < words.length; j++){
                charCount += words[j].length + 1
                if (charCount > 50){
                    textLines.push(line)
                    lineNum ++
                    line = ''
                    charCount = 0
                }
                line += words[j] + ' '
            }
            textLines.push(line)
            this.lines.push(textLines)
        }

        this.start()
    }

    start(){
        this.hidden = false
        this.textIndex = -1
        this.next()
    }

    next(){
        if (this.textIndex < this.text.length-1){
            this.stopped = false
            this.time = Date.now()
            this.textIndex ++
        }else{
            this.onComplete()
        }
    }
    

    update(ctx, audioManager, mouse){
        Color.setFill(ctx,Color.black)
        Shapes.Rectangle({ctx:ctx, originX: 50, originY: this.originY, width:1500, height:200, inset: true, shadow:8})
        
        Color.setColor(ctx,Color.white)
        //const line = this.lines[this.textIndex][this.lineIndex]

        // if (!this.stopped){
        //     const elapsedTime = Date.now() - this.time
        //     this.letterIndex = Math.floor(elapsedTime / this.msPerLetter)
        //     if (this.letterIndex >= line.length){
        //         this.letterIndex = this.time = Date.now()
        //         this.lineIndex ++
        //         if(this.lineIndex >= this.lines[this.textIndex].length-1){
        //             this.stopped = true
        //             this.lineIndex = this.lines[this.textIndex].length-1
        //         } 
        //     }
        //     if (line[this.letterIndex] != ' '){
        //         audioManager.play('bong_001', 6 - Math.random()*12,0.5)
        //     }
        // }else{
        //     this.letterIndex = line.length
        // }

        // console.log(this.textIndex, this.lineIndex, this.letterIndex)

        ctx.font = '40px monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'

        for (let i = 0; i < this.lines[this.textIndex].length; i++){
            ctx.fillText(this.lines[this.textIndex][i], 300, this.originY + 40 + i * 50)
        }
        this.stopped = true
        //ctx.fillText(this.lines[this.textIndex][this.lineIndex].substring(0,this.letterIndex), 300, 650 + this.lineIndex * 50)

        
        if (mouse.down && this.stopped){
            this.next()
        }else if (mouse.down && !this.stopped){
            this.time = 0
        }

        this.portraitImages[this.text[this.textIndex].portraitId].update(ctx,audioManager,mouse)

        mouse.cursor = 'pointer'
    }
} 