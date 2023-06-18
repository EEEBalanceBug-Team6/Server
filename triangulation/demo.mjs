import mt from "./map-triangulation.mjs";

let bpos1 = new mt.Vector(6.2, 3.5);
let bpos2 = new mt.Vector(1.4, 3);
let bpos3 = new mt.Vector(-0.7, -3.7);

let alpha = 64.1;
let beta = 76.7;
let vpos = new mt.Vector(6, -3);

let bber1 = 20.6;
let bber2 = 316.5;

let rpos1 = mt.findMyPosition3B2A(bpos1, bpos2, bpos3, alpha, beta, vpos);
let rpos2 = mt.findMyPosition2B2B(bpos1, bpos2, bber1, bber2);


console.log(`Locating with 3 beacons and 2 angles (using findMyPosition3B2A)...`);
console.log(`> rpos @ (${rpos1.x}, ${rpos1.y})`);

console.log(`Locating with 2 beacons and 2 bearings (using findMyPosition2B2B)...`);
console.log(`> rpos @ (${rpos2.x}, ${rpos2.y})`);
