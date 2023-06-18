import { sq, sqrt } from "./math.util.mjs";

class Vector {
    // constructor
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // vector returns
    add(v) { return new Vector(this.x + v.x, this.y + v.y); }
    minus(v) { return new Vector(this.x - v.x, this.y - v.y); }
    mult(n) { return new Vector(this.x * n, this.y * n); }
    div(n) { return new Vector(this.x / n, this.y / n); }

    // scalar returns
    dot(v) { return (this.x * v.x + this.y * v.y); }
    abs() { return sqrt(sq(this.x)+sq(this.y)); }

    // special returns
    round() { return new Vector(Math.round(this.x), Math.round(this.y)); }
    unit() { return this.mult(this.abs()); }
    perp() {
        if (this.x === 0) {
            return new Vector(1,0);
        } else if (this.y === 0) {
            return new Vector(0,1);
        } else {
            let px = 1, py;
            py = -px*this.x/this.y;
            let pv = new Vector(px,py);
            return pv.div(pv.abs());
        }
    }
}

export { Vector };
