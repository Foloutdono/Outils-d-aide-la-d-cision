import TableRésultats from "./tableRésultats.js";
export default function test_saut(yn, m, n, alpha) {
    const resultsTable = new TableRésultats("test des sauts");

    let rn = {};
    let tailles_sauts = {};
    for (let x of yn) {
        if (tailles_sauts.hasOwnProperty(x)) {
            if (rn.hasOwnProperty(tailles_sauts[x])) {
                rn[tailles_sauts[x]]++;
            } else {
                rn[tailles_sauts[x]] = 1;
            }
        }
        tailles_sauts[x] = 0;
        for (let i in tailles_sauts) {
            if (tailles_sauts[i] != x) {
                tailles_sauts[i]++;
            }
        }
    }
    let variable_observe = 0;
    let regroup = false;
    let riSum = 0;
    let npiSum = 0;
    let debReg = null;
    let endReg = null;
    let v = null;
    for (let prop in rn) {
        let value = Number(prop);
        let ri = rn[prop];
        let pi = Math.pow(0.9, value) * 0.1;
        let npi = n * pi;
        regroup = npi < 5;
        if (!regroup) {
            let contribution = ((ri - npi)**2) / npi;
            variable_observe += contribution;
            resultsTable.addRow([value, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)), parseFloat(contribution.toFixed(4))]);
        } else {
            if (!debReg) {
                debReg = value;
            }
            endReg = value;
            riSum += ri;
            npiSum += npi;
        }
    }
    if (!regroup) {
        v = Object.keys(rn).length - 1;
    } else {
        if (npiSum < 5) {
            prevRow = resultsTable.tbody.children[resultsTable.tbody.children.length-1]
            debReg = prevRow.children[0].textContent;
            npiSum += Number(prevRow.children[3].textContent);
            riSum += Number(prevRow.children[1].textContent);
            variable_observe -= Number(prevRow.children[4].textContent);
            resultsTable.tbody.lastElementChild.remove();
        }
        let contribution = ((riSum - npiSum) ** 2) / npiSum;
        let pi = npiSum / n;
        variable_observe += contribution;
        let valueName = `[${debReg};${endReg}]`
        resultsTable.addRow([valueName, riSum, parseFloat(pi.toFixed(4)), parseFloat(npiSum.toFixed(4)), parseFloat(contribution.toFixed(4))]);
        v = resultsTable.tbody.children.length - 1;
    }
    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)])
}