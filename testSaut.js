export default function test_saut(params, resultsTable) {
    let rn = {};
    let tailles_sauts = {};
    for (let x of params.yn) {
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
    for (let Xi in rn) {
        let value = Number(Xi);
        let ri = rn[Xi];
        let pi = Math.pow(0.9, value) * 0.1;
        let npi = params.n * pi;
        
        let contribution = ((ri - npi)**2) / npi;
        const row = {
            Xi: Xi,
            ri: ri,
            pi: pi,
            npi: npi,
            contribution: contribution,
        }
        resultsTable.addRow(row);
    } 
}