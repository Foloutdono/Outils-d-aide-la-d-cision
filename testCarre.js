import TableRésultats from "./tableRésultats.js";
export default function test_carre(un, m, n, alpha) {
    let resultsTable = new TableRésultats("test des carrés unités");

    if (n % 4 != 0) {
        return;
    }
    let rn = {}
    for (let i = 0; i < n; i+=4) {
        let d2 = (un[i+3]-un[i+1])**2+(un[i+2]-un[i])**2;
        d2 = ((Math.floor(d2 * 10) / 10) + 0.1).toFixed(1);
        if (rn.hasOwnProperty(d2)) {
            rn[d2]++;
        } else {
            rn[d2] = 1;
        }
    }
    let variable_observe = 0;
    let pn = [];
    for (let i = 1; i < 20; i++) {
        let x = (i / 10).toFixed(1);
        let pi = F(x) - pn.reduce((acc, val) => acc + val, 0);
        pn.push(pi);
        if (x in rn) {
            let ri = rn[x];
            let npi = n * pi;
            let contribution = ((ri - npi)**2) / npi;
            let value = parseFloat(Number(x).toFixed(1));
            let valueName = `[${parseFloat((value-0.1).toFixed(1))};${value}[`;
            variable_observe += contribution;
            resultsTable.addRow([valueName, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)), parseFloat(contribution.toFixed(4))]);
        }
    }
    const v = Object.keys(rn).length - 1;
    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)])
}
function F(x) {
    if (x >= 0 && x <= 1) {
        return Math.PI * x - (8/3) * Math.pow(x, 3/2) + (x*x)/2;
    } else if (x > 1 && x <= 2) {
        return (1/3) 
            + (Math.PI - 2) * x
            + 4 * Math.sqrt(x - 1)
            + (8/3) * Math.pow(x - 1, 3/2)
            - (x*x)/2
            - 4 * x * Math.acos(1 / Math.sqrt(x));
    } else {
        return 0;
    }
}