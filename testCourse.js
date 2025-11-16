export default function test_course(params, resultsTable) {
    let rn = {};
    let len = 1;
    for (let i = 1; i < params.n; i++) {
        if (params.xn[i-1] < params.xn[i]) {
            len++;
        }
        if (!(params.xn[i-1] < params.xn[i]) || i+1 == params.n) {
            if (rn.hasOwnProperty(len)) {
                rn[len]++;
            } else {
                rn[len] = 1;
            }
            len = 1;
            i++;
        }
    }
    for (let Xi in rn) {
        const value = Number(Xi);
        const ri = rn[Xi];
        const pi = (value/factorial((value+1)));
        const npi = params.n * pi;
        const contribution = ((ri - npi)**2) / npi;
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
const factorial = n =>
    n < 0 ? null : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);