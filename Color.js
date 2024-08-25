class Color {
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static black = new Color(40,40,40);
    static white = new Color(230,230,230);
    static light_gray = new Color(200,200,200);
    static gray = new Color(150,150,150);
    static red = new Color(248,60,65);
    static green = new Color(78, 242, 121);

    static setColor(ctx, color){
        ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`
    }
}