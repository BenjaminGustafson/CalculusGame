class Shapes {

    
    /**
     * 
     * Draws a line with rounded (circular) endcaps. Endcap extends past the 
     * start and end points by width. Line extends out from the start and end
     * points by width/2.
     * 
     * @param {context} ctx the context of the canvas to draw on
     * @param {int} start_x the x coordinate of the middle of the start point
     * @param {int} start_y the y coordinate of the middle of the start point
     * @param {int} end_x the x coordinate of the middle of the end point
     * @param {int} end_y the y coordinate of the middle of the end point
     * @param {int} width the width of the line
    */
    static RoundedLine(ctx, start_x, start_y, end_x, end_y, width){
       ctx.beginPath();
       ctx.moveTo(start_x, start_y);
       ctx.lineTo(end_x, end_y);
       ctx.lineWidth = width;
       ctx.stroke();
       
       ctx.beginPath();
       ctx.arc(start_x,start_y,width/2,0,2*Math.PI);
       ctx.fill();

       ctx.beginPath();
       ctx.arc(end_x,end_y,width/2,0,2*Math.PI);
       ctx.fill();
    }

    static LineSegment(ctx, start_x, start_y, end_x, end_y, width, endpointSize){
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(end_x, end_y);
        ctx.lineWidth = width;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(start_x,start_y,endpointSize,0,2*Math.PI);
        ctx.fill();
 
        ctx.beginPath();
        ctx.arc(end_x,end_y,endpointSize,0,2*Math.PI);
        ctx.fill();
    }

    static Circle(ctx, center_x, center_y, radius){ 
        ctx.beginPath();
        ctx.arc(center_x,center_y,radius,0,2*Math.PI);
        ctx.fill();
    }

    static Grid(ctx, origin_x, origin_y, width, height, gridSize, lineWidthMax){

        for (let i = 0; i <= gridSize; i++){
            const lineWidth = lineWidthMax * (i % 2 == 0 ? 1 : 1/2)
            // Horizontal
            this.RoundedLine(ctx, origin_x, origin_y+height/gridSize*i, origin_x+width, origin_y+height/gridSize*i, lineWidth)
            // Vertical
            this.RoundedLine(ctx, origin_x+width/gridSize*i, origin_y, origin_x+width/gridSize*i, origin_y+height, lineWidth)
        }
    }

    static VerticalSlider(ctx, top_x, top_y, height, numDivision, subdivision, lineWidthMax){
        // Vertical line
        this.RoundedLine(ctx, top_x, top_y, top_x, top_y + height, lineWidthMax)

        for (let i = 0; i <= numDivision; i++){
            const horizontalLength = 20
            const lineWidth = lineWidthMax * (i % subdivision == 0 ? 1 : 1/2)
            this.RoundedLine(ctx, top_x-horizontalLength, top_y+i*height/numDivision, top_x+horizontalLength, top_y+i*height/numDivision, lineWidth)
        }

    }


}