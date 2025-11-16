export default function test_fréquences(params, resultsTable) {
    let rn = {};
    for (let i = 0; i < params.n; i++) {
        if (rn.hasOwnProperty(params.yn[i])) {
            rn[params.yn[i]]++;
        } else {
            rn[params.yn[i]] = 1;
        }
    }
    for (let Xi in rn) {
        const ri = rn[Xi];
        const pi = 1/10;
        const npi = params.n * pi;
        const contribution = ((ri - npi)**2) / npi;
        const row = {
            Xi: Xi,
            ri: ri,
            pi: pi,
            npi: npi,
            contribution: contribution,
        }
        resultsTable.ajouteLigne(row);
    }
}