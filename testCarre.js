export default function test_carre(params, resultsTable) {
    if (params.n % 4 != 0) {
        return;
    }
    let rn = {}
    for (let i = 0; i < params.n; i+=4) {
        let d2 = (params.un[i+3]-params.un[i+1])**2+(params.un[i+2]-params.un[i])**2;
        d2 = ((Math.floor(d2 * 10) / 10) + 0.1).toFixed(1);
        if (rn.hasOwnProperty(d2)) {
            rn[d2]++;
        } else {
            rn[d2] = 1;
        }
    }
    let pn = [];
    for (let i = 1; i < 20; i++) {
        let x = (i / 10).toFixed(1);
        let pi = F(x) - pn.reduce((acc, val) => acc + val, 0);
        pn.push(pi);
        if (x in rn) {
            let ri = rn[x];
            let npi = params.n * pi;
            let contribution = ((ri - npi)**2) / npi;
            let Xi = parseFloat(Number(x).toFixed(1));
            Xi = `[${parseFloat((Xi-0.1).toFixed(1))};${Xi}[`;
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