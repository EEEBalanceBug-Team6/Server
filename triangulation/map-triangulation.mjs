import { Vector } from "./util/vector.util.mjs";
import { findMyPosition3B2A } from "./core/three.core.mjs";
import { findMyPosition2B2B } from "./core/two.core.mjs";

// NOTE:
// It is also possible to use 3 beacons and 3 bearings to find the positino of
// the rover, but that is not needed. If you have 3 beacons and 3 bearings, just
// discard the additional beacon and bearing. Testing should be done on this
// selection strategy.

export default {
    Vector,
    findMyPosition3B2A,
    findMyPosition2B2B,
};