import TableRésultats from "./tableRésultats.js";
export default function test_fréquences(yn, m, n, alpha) {
    const resultsTable = new TableRésultats("test des fréquences");

    let rn = {};
    for (let i = 0; i < n; i++) {
        if (rn.hasOwnProperty(yn[i])) {
            rn[yn[i]]++;
        } else {
            rn[yn[i]] = 1;
        }
    }
    let variable_observe = 0;
    for (let prop in rn) {
        const ri = rn[prop];
        const pi = 1/10;
        const npi = n * pi;
        const contribution = ((ri - npi)**2) / npi;
        variable_observe += contribution;
        resultsTable.addRow([prop, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)),  parseFloat(contribution.toFixed(4))]);
    }
    const v = Object.keys(rn).length - 1;

    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)])
}