const find2VLEquation = (x0, y0, slope) => {
    if (slope === Infinity) {
        // x = x0  >>>  1x + 0y = x0
        return [1, 0, x0];
    } else {
        // y = s*x + r  >>>  (-s)*x + y = r  >>>  a*x + b*y = c
        let a = -slope;
        let c = a*x0 + y0;
        return [a, 1, c];
    }
}

const solve2VLEquation = (a1, b1, c1, a2, b2, c2) => {
    let denom = a1*b2 - b1*a2;
    let xnum = c1*b2 - b1*c2;
    let ynum = a1*c2 - c1*a2;

    if (denom === 0) {
        throw Error("solve2VLEquation: Cramer's rule has denominator is 0");
    }

    return [xnum/denom, ynum/denom];
}

const degToRad = (deg) => {
    return (deg/180)*Math.PI;
}

const sq = (n) => {
    return n * n;
}

const sqrt = (n) => {
    return Math.sqrt(n);
}

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

const findLineOfSight = (bpos, bber) => {
    if (bber < 0 || bber >= 360) {
        throw Error("findLineOfSight: bber not between 0 and 360 (bad input)");
    } else if (bber === 0) {
        return find2VLEquation(bpos.x, bpos.y, Infinity);
    } else if (bber === 90) {
        return find2VLEquation(bpos.x, bpos.y, 0);
    } else if (bber === 180) {
        return find2VLEquation(bpos.x, bpos.y, Infinity);
    } else if (bber === 270) {
        return find2VLEquation(bpos.x, bpos.y, 0);
    } else if (0 < bber && bber < 90) {
        return find2VLEquation(bpos.x, bpos.y, Math.tan(degToRad(90-bber)));
    } else if (90 < bber && bber < 180) {
        return find2VLEquation(bpos.x, bpos.y, Math.tan(degToRad(90-bber)));
    } else if (180 < bber && bber < 270) {
        return find2VLEquation(bpos.x, bpos.y, Math.tan(degToRad(270-bber)));
    } else if (270 < bber && bber < 360) {
        return find2VLEquation(bpos.x, bpos.y, Math.tan(degToRad(270-bber)));
    } else {
        throw Error("findLineOfSight: impossible condition (program error)");
    }
}

// find my position using 2 beacons and 2 bearings
const findMyPosition2B2B = (bpos1, bpos2, bber1, bber2) => { 
    // find line
    let [a1, b1, c1] = findLineOfSight(bpos1, bber1);
    let [a2, b2, c2] = findLineOfSight(bpos2, bber2);
    
    // solve
    let [xr, yr] = solve2VLEquation(a1, b1, c1, a2, b2, c2);

    // ans
    return new Vector(xr, yr);
}

module.exports = { findMyPosition2B2B };
