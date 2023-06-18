import { sq, degToRad } from "./math.util.mjs"; 


const findSide = (p1, p2, p3) => {
    if (p1.x !== p2.x) {
        // find line
        let a = (p2.y-p1.y) / (p2.x-p1.x);
        let b = p1.y - p1.x*a;
        // find factor
        let c = a*p3.x-p3.y+b;
        if (c > 0) return 1;
        else if (c < 0) return -1;
        else return 0;
    } else {
        // vertical line; compare x only
        let c = p3.x-p1.x;
        if (c > 0) return 1;
        else if (c < 0) return -1;
        else return 0;
    }
}


const findCenter = (p1, p2, alpha, side) => {
    if (alpha > 90) {
        let beta = 180-alpha;
        let dist = p1.minus(p2).abs() / Math.tan(degToRad(beta)) / 2;
        let distv = p1.minus(p2).perp().mult(dist);

        let c1 = p1.add(p2).div(2).add(distv);
        let c2 = p1.add(p2).div(2).minus(distv);
        let s1 = findSide(p1, p2, c1);
        let s2 = findSide(p1, p2, c2);
        
        // return opposite side
        if (side > 0) {
            if (s1 > 0 && s2 < 0) return c2;
            else if (s1 < 0 && s2 > 0) return c1;
            else throw Error("findCenter: alpha > 90 but centers not on different side of line (impossible condition)");
        } else if (side < 0) {
            if (s1 > 0 && s2 < 0) return c1;
            else if (s1 < 0 && s2 > 0) return c2;
            else throw Error("findCenter: alpha > 90 but centers not on different side of line (impossible condition)");
        } else {
            throw Error("findCenter: side variable is on line (bad input)");
        }

    } else if (alpha < 90) {
        let beta = alpha;
        let dist = p1.minus(p2).abs() / Math.tan(degToRad(beta)) / 2;
        let distv = p1.minus(p2).perp().mult(dist);

        let c1 = p1.add(p2).div(2).add(distv);
        let c2 = p1.add(p2).div(2).minus(distv);
        let s1 = findSide(p1, p2, c1);
        let s2 = findSide(p1, p2, c2);
        
        // return same side
        if (side > 0) {
            if (s1 > 0 && s2 < 0) return c1;
            else if (s1 < 0 && s2 > 0) return c2;
            else throw Error("findCenter: alpha < 90 but centers not on different side of line (impossible condition)");
        } else if (side < 0) {
            if (s1 > 0 && s2 < 0) return c2;
            else if (s1 < 0 && s2 > 0) return c1;
            else throw Error("findCenter: alpha < 90 but centers not on different side of line (impossible condition)");
        } else {
            throw Error("findCenter: side variable is on line (bad input)");
        }

    } else {
        return p1.add(p2).div(2); 
    }
}


const findMirror = (p1, p2, p3) => {
    let va = p2.minus(p1);
    let vb = p3.minus(p1);
    let dist = vb.minus(va.mult(va.dot(vb) / sq(va.abs())));
    let ans = p3.add(dist.mult(-2));
    return ans;
}


export { findSide, findCenter, findMirror };
