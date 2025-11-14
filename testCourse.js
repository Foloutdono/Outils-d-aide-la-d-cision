import TableRésultats from "./tableRésultats.js";
export default function test_course(xn, m, n, alpha) {
    const resultsTable = new TableRésultats("Test des courses");
    let rn = {};
    let len = 1;
    for (let i = 1; i < n; i++) {
        if (xn[i-1] < xn[i]) {
            len++;
        }
        if (!(xn[i-1] < xn[i]) || i+1 == n) {
            if (rn.hasOwnProperty(len)) {
                rn[len]++;
            } else {
                rn[len] = 1;
            }
            len = 1;
            i++;
        }
    }
    let variable_observe = 0;
    for (let prop in rn) {
        const value = Number(prop);
        const ri = rn[prop];
        const pi = (value/factorial((value+1)));
        const npi = n * pi;
        const contribution = ((ri - npi)**2) / npi;
        variable_observe += contribution;
        resultsTable.addRow([prop, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)),  parseFloat(contribution.toFixed(4))]);
    }
    const v = Object.keys(rn).length - 1;

    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)]);
}
const factorial = n =>
    n < 0 ? null : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);