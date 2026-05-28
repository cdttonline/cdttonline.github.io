    
/**
 * 
 * @param {float[]} xSig 
 * @param {number} ixStart 
 * @param {number} ixEnd 
*/
export function stdDev(xSig, ixStart, ixEnd) {
    
    // We compute the standard deviation through a 2-pass method

    // Initialize some variables
    let sd = 0.0;
    let diff = 0.0;
    let sq_diff_sum = 0.0;

    let numValues = (ixEnd - ixStart) + 1;

    // Do some parameter checking first
    if (numValues >= 2 && (xSig != null) && (xSig.length >= numValues)) {

        // Compute the average of the xSig (first pass)
        var avg = mean(xSig, ixStart, ixEnd);

        // Compute the sum of squared difference (second pass)
        for (let ix = ixStart; ix <= ixEnd; ix++) {
            diff = xSig[ix] - avg;
            sq_diff_sum += diff * diff;
        }

        // Standard deviation is the square root of variance
        sd = Math.sqrt(sq_diff_sum / (numValues - 1)); 
    }

    return sd;
}

/**
 * 
 * @param {float[]} xSig 
 * @param {number} ixStart 
 * @param {number} ixEnd 
 */
export function mean(xSig, ixStart, ixEnd) {
    let avg = 0.0;
    let numValues = (ixEnd - ixStart) + 1;

    // Compute the mean
    if ((xSig != null) && (xSig.length >= numValues)) {
        for (let ix = ixStart; ix <= ixEnd; ix++) {
            avg += xSig[ix];
        }

        avg /= numValues;
    } 
    return avg;
}

/**
 * 
 * @param {number[]} xSig 
 * @param {number} ixStart 
 * @param {number} ixEnd 
 * @returns 
 */
export function sum(xSig, ixStart, ixEnd) {
    let sum = 0;
    let numValues = (ixEnd - ixStart) + 1;

    // Compute the sum
    if ((xSig != null) && (xSig.length >= numValues)) {
        for (let ix = ixStart; ix <= ixEnd; ix++) {
            sum += xSig[ix];
        }
    }
    return sum;
}