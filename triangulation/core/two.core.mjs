import { Vector } from "../util/vector.util.mjs";
import { degToRad, find2VLEquation, solve2VLEquation } from "../util/math.util.mjs";

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


export { findMyPosition2B2B };
