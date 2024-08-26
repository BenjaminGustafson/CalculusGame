class Color {
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static black = new Color(43,43,43)
    static white = new Color(233,233,233)
    static light_gray = new Color(190,190,190)
    static gray = new Color(150,150,150)
    static red = new Color(240,70,40)
    static green = new Color(0,158,115)
    static blue = new Color(86,180,233)
    static yellow = new Color(240,228,66)

    static setColor(ctx, color){
        ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`
    }
}