import TableRésultats from "./tableRésultats.js";
export default function test_poker(yn, n, alpha) {
    const resultsTable = new TableRésultats("test du poker");
    const categories = {
        "poker": 10 / 100000,
        "carre": 450 / 100000,
        "full": 900 / 100000,
        "brelan": 7200 / 100000,
        "double_paire": 10800 / 100000,
        "paire": 50400 / 100000,
        "rien": 30240 / 100000
    };
    let ris = {
        poker: 0,
        carre: 0,
        full: 0,
        brelan: 0,
        double_paire: 0,
        paire: 0,
        rien: 0
    };
    const nbCartesMain = 5;
    const nbMains = Math.floor(n / nbCartesMain);

    for (let i = 0; i < nbMains; i++) {
        const bloc = yn.slice(i * nbCartesMain, i * nbCartesMain + nbCartesMain);

        let counts = {};
        bloc.forEach(v => counts[v] = (counts[v] || 0) + 1);

        let valeurs = Object.values(counts).sort((a, b) => b - a);

        if (valeurs[0] === 5) ris.poker++;
        else if (valeurs[0] === 4) ris.carre++;
        else if (valeurs[0] === 3 && valeurs[1] === 2) ris.full++;
        else if (valeurs[0] === 3) ris.brelan++;
        else if (valeurs[0] === 2 && valeurs[1] === 2) ris.double_paire++;
        else if (valeurs[0] === 2) ris.paire++;
        else ris.rien++;
    }

    let variable_observe = 0;

    for (let categorie in categories) {
        const pi = categories[categorie];
        const ri = ris[categorie];
        const npi = nbMains * pi;
        const contribution = ((ri - npi) ** 2) / npi;

        variable_observe += contribution;

        resultsTable.addRow([
            categorie,
            ri,
            parseFloat(pi.toFixed(5)),
            parseFloat(npi.toFixed(4)),
            parseFloat(contribution.toFixed(4))
        ]);
    }

    let v = Object.keys(categories).length - 1;
    let seuil = jStat.chisquare.inv(1 - alpha, v);

    resultsTable.addRésultats([variable_observe, seuil])
}