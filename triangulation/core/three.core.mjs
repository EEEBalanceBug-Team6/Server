import { findSide, findCenter, findMirror } from "../util/cartesian.util.mjs";

// find my position using 3 beacons and 2 angles
const findMyPosition3B2A = (bpos1, bpos2, bpos3, ang12, ang23, vpos) => {
    // TODO: should catch bad case

    // find 1st center
    let side12 = findSide(bpos1, bpos2, vpos);
    let c12 = findCenter(bpos1, bpos2, ang12, side12);

    // find 2nd center
    let side23 = findSide(bpos2, bpos3, vpos);
    let c23 = findCenter(bpos2, bpos3, ang23, side23);
    
    // find mirror
    let pos = findMirror(c12, c23, bpos2);
    return pos;
}

export { findMyPosition3B2A };
