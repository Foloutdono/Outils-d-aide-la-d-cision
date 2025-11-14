class ResultTable {
    constructor(nameTest, résultats = null) {
        this.table = document.createElement("table");
        this.table.innerHTML = `<caption>Résultats du ${nameTest}</caption>
            <thead>
                <tr>
                    <th>Xᵢ¹</th>
                    <th>rᵢ</th>
                    <th>pᵢ</th>
                    <th>npᵢ</th>
                    <th>(rᵢ-npᵢ)²/npᵢ</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="4">X² observé</th>
                    <td></td>
                </tr>
                <tr>
                    <th scope="row" colspan="4">Valeur critique</th>
                    <td></td>
                </tr>
            </tfoot>
        `
        this.tfoot = this.table.getElementsByTagName("tfoot")[0];
        this.tbody = this.table.getElementsByTagName("tbody")[0];
        document.body.appendChild(this.table);
    }
    addRow(row) {
        let tr = document.createElement("tr");
        for (let value of row) {
            let td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        }
        this.tbody.appendChild(tr);
    }
    addRésultats(résultats) {
        console.log(résultats)
        for (let iRésultat in résultats) {
            this.tfoot.children[iRésultat].children[1].textContent = résultats[iRésultat]
        }
    }
}
function init() {
    let userform = document.getElementById("userForm");
    userform.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const alpha = Number(formData.get("alpha")) / 100;
        const a = Number(formData.get("a"));
        const m = Number(formData.get("m"));
        const c = Number(formData.get("c"));
        const x0 = Number(formData.get("x0"));
        const n = Number(formData.get("n"));

        userform.style.display = "none";

        const xn = generator(x0, a, c, m, n);
        const un = xn.map((x) => (x / m));
        const yn = un.map((u) => parseInt(u*10));

        if (formData.get("course")) {
            test_course(xn, m, n, alpha);
        }
        if (formData.get("poker")) {
            test_poker(yn, n, alpha)
        }
        if (formData.get("frésuences")) {
            test_fréquences(yn, m, n, alpha);
        }
        if (formData.get("saut")) {
            test_saut(yn, m, n, alpha);
        }
        if (formData.get("carre")) {
            test_carre(un, m, n, alpha);
        }

        // let résultatsTablePoisson = new ResultTable("test poisson");
        // let résultatsPoisson = test_poisson([0, 1, 2, 3, 4, 5, 6], [29, 34, 24, 9, 3, 1, 0], 0.05, résultatsTablePoisson);
        // résultatsTablePoisson.addRésultats(résultatsPoisson)

        // let résultatsTableExp = new ResultTable("test exp");
        // let résultatsExp = test_exp_neg([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],[7, 8],[8, 9],[9, 10],[10, 11],[11, 12]],
        //                                  [23, 20, 14, 12, 9, 5, 4, 5, 3, 2, 2, 1],
        //                                   0.05, résultatsTableExp);
        // résultatsTableExp.addRésultats(résultatsExp)

    });
}
window.onload = init;

function generator(x0, a, c, m, n) {
    random_numbers = [x0];
    for (let i = 0;i < n-1; i++) {
        random_numbers.push((a*random_numbers[i]+c)%m);
    }
    return random_numbers;
}
function test_course(xn, m, n, alpha) {
    const resultsTable = new ResultTable("Test des courses");
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
    for (prop in rn) {
        const value = Number(prop);
        const ri = rn[prop];
        const pi = (value/factorial((value+1)));
        const npi = n * pi;
        const contribution = ((ri - npi)**2) / npi;
        variable_observe += contribution;
        resultsTable.addRow([prop, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)),  parseFloat(contribution.toFixed(4))]);
    }
    v = Object.keys(rn).length - 1;

    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)]);
}
function test_fréquences(yn, m, n, alpha) {
    const resultsTable = new ResultTable("test des fréquences");

    let rn = {};
    for (let i = 0; i < n; i++) {
        if (rn.hasOwnProperty(yn[i])) {
            rn[yn[i]]++;
        } else {
            rn[yn[i]] = 1;
        }
    }
    let variable_observe = 0;
    for (prop in rn) {
        const ri = rn[prop];
        const pi = 1/10;
        const npi = n * pi;
        const contribution = ((ri - npi)**2) / npi;
        variable_observe += contribution;
        resultsTable.addRow([prop, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)),  parseFloat(contribution.toFixed(4))]);
    }
    v = Object.keys(rn).length - 1;

    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)])
}
function test_saut(yn, m, n, alpha) {
    const resultsTable = new ResultTable("test des sauts");

    let rn = {};
    let tailles_sauts = {};
    for (let x of yn) {
        // console.log(tailles_sauts)
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
    let debReg = undefined;
    let endReg = undefined;
    let v = undefined;
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

function test_carre(un, m, n, alpha) {
    let resultsTable = new ResultTable("test des carrés unités");

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
    v = Object.keys(rn).length - 1;
    resultsTable.addRésultats([variable_observe, jStat.chisquare.inv(1 - alpha, v)])
}
function test_poisson(xn, rn, alpha, resultsTable) {
    let n = rn.reduce((acc, val) => acc + val, 0);
    let lamda = somme_pond(xn, rn);
    let pn = Pn_p(lamda, xn);
    let variable_observe= 0;

    let regroup = false;
    let riSum = 0;
    let npiSum = 0;
    let debReg = undefined;
    let endReg = undefined;
    let v = undefined;
    for (let i = 0; i < xn.length; i++) {
        let ri = rn[i];
        let xi = xn[i];
        let pi = pn[i];
        let npi = pi *n;
        regroup = npi < 5;
        if (!regroup) {
            let contribution = ((ri - npi)**2) / npi;
            variable_observe += contribution;
            resultsTable.addRow([xi, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)), parseFloat(contribution.toFixed(4))]);
        } else {
            if (!debReg) {
                debReg = xi;
            }
            endReg = xi;
            riSum += ri;
            npiSum += npi;
        }
    }
    if (!regroup) {
        v = Object.keys(rn).length - 2;
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
        v = resultsTable.tbody.children.length - 2;
    }
    return [variable_observe, jStat.chisquare.inv(1 - alpha, v)];
}
function test_exp_neg(xn, rn, alpha, resultsTable) {
    let cn = [];
    for (let i = 0; i < xn.length; i++) {
        cn.push((xn[i][0] + xn[i][1]) / 2);
    }
    let n = rn.reduce((acc, val) => acc + val, 0);
    let espérence = somme_pond(cn, rn);
    let pn = Pn_exp(xn, 1/espérence);
    let variable_observe= 0;

    let regroup = false;
    let riSum = 0;
    let npiSum = 0;
    let debReg = undefined;
    let endReg = undefined;
    let v = undefined;
    for (let i = 0; i < xn.length; i++) {
        let ri = rn[i];
        let xi = xn[i];
        let pi = pn[i];
        let npi = pi *n;
        regroup = npi < 5;
        if (!regroup) {
            let contribution = ((ri - npi)**2) / npi;
            variable_observe += contribution;
            resultsTable.addRow([xi, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)), parseFloat(contribution.toFixed(4))]);
        } else {
            if (!debReg) {
                debReg = xi[0];
            }
            endReg = xi[1];
            riSum += ri;
            npiSum += npi;
        }
    }
    if (!regroup) {
        v = Object.keys(rn).length - 2;
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
        v = resultsTable.tbody.children.length - 2;
    }
    return [variable_observe, jStat.chisquare.inv(1 - alpha, v)];
}


const factorial = n =>
    n < 0 ? undefined : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);

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
function P(x, y) {
  return ((Math.E**-x) * x**y) / factorial(y);
}
function Pn_p(x, y) {
    pn = []
    for (let i = 0; i < y.length; i++) {
        pn.push(P(x, i));
    }
    return pn;
}
function exp_neg(a, b, mu) {
    return (Math.E ** (-mu * a)) - (Math.E ** (-mu * b))
}
function Pn_exp(xn, mu) {
    pn = []
    for (let i = 0; i < xn.length; i++) {
        pn.push(exp_neg(xn[i][0], xn[i][1], mu));
    }
    return pn;
}
function arrivées_clients(ui) {
    let nbClients = 0;
    let sum_prob = P(0.83, 0);
    while (ui > sum_prob) {
        nbClients++;
        sum_prob += P(0.83, nbClients);
    }
    return nbClients;
}
function somme_pond(x, y) {
    let n = y.reduce((acc, val) => acc + val, 0);
    let somme_p = 0;
    for (let i = 0; i < x.length; i++) {
        somme_p += x[i] * y[i];
    }
    return somme_p / n;
}


function test_poker(yn, n, alpha) {
    const resultsTable = new ResultTable("test du poker");
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
