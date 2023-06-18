const sq = (n) => {
    return n * n;
}

const sqrt = (n) => {
    return Math.sqrt(n);
}

const degToRad = (deg) => {
    return (deg/180)*Math.PI;
}

const radToDeg = (rad) => {
    return (rad/Math.PI)*180;
}

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

export { 
    sq, sqrt, 
    degToRad, radToDeg,
    find2VLEquation, solve2VLEquation
};
