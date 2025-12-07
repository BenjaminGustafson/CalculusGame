import { GameObject } from "./GameObject.js"
import { TileMap } from '../util/TileMap.js'

/**
 * "paths":{
 *   {"x,y": true}
 * }
 */
export class Player extends GameObject {
    constructor({
        nodes,
        pathSquares, 
        currentNode,
        tileMap
    }) {
        super()
        Object.assign(this, {nodes, pathSquares, currentNode, tileMap})

        // Isometric grid location
        this.isoX = nodes[currentNode].x
        this.isoY = nodes[currentNode].y

        // Direction facing
        const dirCoord = TileMap.dirToCoord(nodes[currentNode].dir)
        this.dx = dirCoord.x
        this.dy = dirCoord.y

        // State machine:
        // waiting, moving, arrived
        this.state = 'waiting'

        // Images
        this.imgNE = document.getElementById('astronautB_NE')
        this.imgSE = document.getElementById('astronautB_SE')
        this.imgNW = document.getElementById('astronautB_NW')
        this.imgSW = document.getElementById('astronautB_SW')

        // Movement variables
        this.currentPath = [] // list of squares {x,y}
        this.pathIndex = 0    // index of where we are on the currentPath
        this.targetNode = ''  // the name of the destination node
        this.startTime = 0    // Date.now when step started 
        this.stepCount = 0    // Number of steps taken
        this.stepTime = 50    // ms per step
  
        // Canvas x,y
        this.cx = 0 
        this.cy = 0
    }

    /**
     * Breadth-first search
     */
    bfsPath(nodes, pathSquares, startId, endId) {
        const start = nodes[startId]
        const end = nodes[endId]
        const dirs = [
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
            {dx: 0, dy: 1},
            {dx: 0, dy: -1}
        ];
        
        const queue = [];
        const visited = new Set();
        const parent = new Map(); // key: "x,y" → value: "px,py"
        
        const startKey = `${start.x},${start.y}`;
        const endKey = `${end.x},${end.y}`;
        
        queue.push(start);
        visited.add(startKey);
        
        while (queue.length > 0) {
            const {x, y} = queue.shift();
            const key = `${x},${y}`;
        
            if (key === endKey) {
                // Reconstruct path
                const path = [];
                let curKey = key;
                while (curKey) {
                    const [cx, cy] = curKey.split(",").map(Number);
                    path.push({x: cx, y: cy});
                    curKey = parent.get(curKey);
                }
                return path.reverse();
            }
        
            for (const {dx, dy} of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                const nKey = `${nx},${ny}`;
        
            if (!visited.has(nKey) && pathSquares[`${x},${y}`]) {
                visited.add(nKey);
                parent.set(nKey, key);
                queue.push({x: nx, y: ny});
            }
            }
        }
        
        return null; // no path found         
    }

    moveTo (node){
        // Stop if we are already moving
        if (this.state == 'moving') return
        
        // Stop if we are already at destination
        if (node == this.currentNode) {
            this.state = 'arrived'
            return
        }
        
        // Set up the path to the node
        this.targetNode = node
        this.currentPath = this.bfsPath(this.nodes, this.pathSquares, this.currentNode, node)
        this.pathIndex = 1

        // Speed up for further away nodes
        this.stepTime = Math.max(50,Math.min(200,1000/this.currentPath.length)) 
        const nextTarget = this.currentPath[this.pathIndex]
        this.dx = Math.sign(nextTarget.x - this.isoX)
        this.dy = Math.sign(nextTarget.y - this.isoY)
        this.startTime = Date.now()
        this.state = 'moving'
    }

    update (ctx, audio, mouse){
        switch (this.state){
            case 'moving':
                // Move one tick
                if (Date.now() - this.startTime > this.stepTime){
                    audio.play('click_005', (this.stepCount++%2)*18-18+Math.random()*4, 0.4)
                    this.isoX += this.dx
                    this.isoY += this.dy
                    const targetCoord = this.currentPath[this.pathIndex]
                    // End of path step
                    if (this.isoX == targetCoord.x && this.isoY == targetCoord.y){
                        this.pathIndex ++
                        // End of path
                        if (this.pathIndex >= this.currentPath.length){
                            this.currentNode = this.targetNode
                            this.state = 'arrived'
                            const coordDir = TileMap.dirToCoord(this.nodes[this.currentNode].dir)
                            this.dx =  coordDir.x
                            this.dy = coordDir.y
                        }
                        // Next step
                        else{    
                            const nextTarget = this.currentPath[this.pathIndex]
                            this.dx = Math.sign(nextTarget.x - this.isoX)
                            this.dy = Math.sign(nextTarget.y - this.isoY)
                        }
                    }
                    this.startTime = Date.now()
                }
                break
            case 'waiting':
                break
            case 'arrived':
                break
        }

        // Draw the player
        const {x,y} = this.tileMap.isometricToCanvas(this.isoX,this.isoY)
        const nextCoord = this.tileMap.isometricToCanvas(this.isoX + this.dx,this.isoY+this.dy)
        const nx = nextCoord.x
        const ny = nextCoord.y
        const t = Math.max(0,Math.min(1,(Date.now() - this.startTime)/this.stepTime))
        const lerpX = this.state == 'moving' ? t*nx + (1-t)*x : x
        const lerpY = this.state == 'moving' ? t*ny + (1-t)*y : y 
        const jumpY = lerpY - 50 * (-t*t + t) 
        this.cx = lerpX + 256
        this.cy = jumpY + 256
        if (this.dx == 1){
            ctx.drawImage(this.imgSE, lerpX, jumpY)
        }else if (this.dx == -1){
            ctx.drawImage(this.imgNW, lerpX, jumpY)
        }else if (this.dy == 1){
            ctx.drawImage(this.imgSW, lerpX, jumpY)
        }else if (this.dy == -1){
            ctx.drawImage(this.imgNE, lerpX, jumpY)
        }else{
            console.warn('invalid dir', this.dx, this.dy)
        }
    }
}