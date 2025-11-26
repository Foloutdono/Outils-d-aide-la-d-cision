import test_course from "./testCourse.js";
import test_fréquences from "./testFréquences.js";
import test_saut from "./testSaut.js";
import test_carre from "./testCarre.js";
import test_poker from "./testPoker.js";
import Test from "./test.js";
function init() {
    const userform = document.getElementById("userForm");
    userform.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const alpha = Number(formData.get("alpha")) / 100;
        const a = Number(formData.get("a"));
        const m = Number(formData.get("m"));
        const c = Number(formData.get("c"));
        const x0 = Number(formData.get("x0"));
        const n = Number(formData.get("n"));

        const resultsHullDobell = hullDobell(a, c, m);
        if (resultsHullDobell.includes(false)) {
            const errorbox = document.getElementById("errorboxParam");
            errorbox.hidden = false;
            let htmlContent = "<h4>Les paramètres doivent respecter le théorème d'HULL-DOBELL</h4>";
            htmlContent += "<ul>";
            for (let iRésultat = 0; iRésultat < 3; iRésultat++) {
                if (!resultsHullDobell[iRésultat]) {
                    htmlContent += `<li>L'hypothèse ${iRésultat+1} n'est pas respectée.</li>`;
                }
            }
            htmlContent += '</ul>';
            errorbox.innerHTML = htmlContent;

            if (!document.getElementById("rappelThéorème")) {
                const théorèmeImage = document.createElement("img");
                théorèmeImage.id = "rappelThéorème";
                théorèmeImage.src = "théorèmeHULL-DOBELL.png";
                théorèmeImage.width = 687;
                théorèmeImage.height = 185;
                document.body.appendChild(théorèmeImage);
            }
        } else {
            userform.style.display = "none";
            const théorèmeImage = document.getElementById("rappelThéorème");
            if (théorèmeImage) {
                théorèmeImage.hidden = true;
            }

            const xn = generator(x0, a, c, m, n);
            const un = xn.map((x) => (x / m));
            const yn = un.map((u) => parseInt(u*10));
            const per = periode(x0, a, c, m);

            const suiteGénéré = document.createElement("div");
            suiteGénéré.id= "valeursSuite";
            suiteGénéré.innerHTML = `
                <table>
                    <caption>Paramètres</caption>
                    <tr>
                        <th>m</th>
                        <td>${m}</td>
                    </tr>
                    <tr>
                        <th>a</th>
                        <td>${a}</td>
                    </tr>
                    <tr>
                        <th>c</th>
                        <td>${c}</td>
                    </tr>
                    <tr>
                        <th>n</th>
                        <td>${n}</td>
                    </tr>
                </table>
                <table>
                    <caption>Suite généré</caption>
                    <tr>
                        <th>xn</th>
                        <td>${formatArray(xn, 0)}</td>
                    </tr>
                    <tr>
                        <th>un</th>
                        <td>${formatArray(un, 4)}</td>
                    </tr>
                    <tr>
                        <th>yn</th>
                        <td>${formatArray(yn, 0)}</td>
                    </tr>
                    <tr>
                        <th>période</th>
                        <td>${per}</td>
                    </tr>
                </table>
            `;
            document.body.appendChild(suiteGénéré);

            if (formData.get("courses")) {
                new Test("Test des courses", "courses", test_course, {xn, m, n, alpha})
            }
            if (formData.get("poker")) {
                new Test("Test du poker", "poker", test_poker, {yn, n, alpha})
            }
            if (formData.get("fréquences")) {
                new Test("Test des fréquences", "fréquences", test_fréquences, {yn, n, alpha})
            }
            if (formData.get("sauts")) {
                new Test("Test des sauts", "sauts", test_saut, {yn, n, alpha});
            }
            if (formData.get("carré")) {
                new Test("Test du carré-unité", "carré", test_carre, {un, n, alpha});
            }
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

function hullDobell(a, c, m) {
    return [hypotèse1(c, m), hypotèse2(a, m), hypotèse3(a, m)];
}
function hypotèse1(c, m) {
    return sontPremiersEntreEux(c, m);
}
function hypotèse2(a, m) {
    let facteursPremiersDeM = facteursPremiersUniques(m);
    let iFacteur = 0;
    while (iFacteur < facteursPremiersDeM.length && (a-1) % facteursPremiersDeM[iFacteur] === 0) {
        iFacteur++;
    }
    return iFacteur === facteursPremiersDeM.length;
}
function hypotèse3(a, m) {
    return (m % 4 ==! 0) || ((a-1) % 4 === 0)
}
function facteursPremiersUniques(n) {
    const facteurs = new Set();

    if (n % 2 === 0) {
        facteurs.add(2);
        while (n % 2 === 0) {
            n /= 2;
        }
    }

    let i = 3;
    while (i ** 2 <= n) {
        if (n % i === 0) {
            facteurs.add(i);
            while (n % i === 0) {
                n /= i;
            }
        }
        i += 2;
    }

    if (n > 1) facteurs.add(n);

    return [...facteurs];
}
function sontPremiersEntreEux(x, y) {
    while (y !== 0) {
        [x, y] = [y, x % y];
    }

    return x === 1;
}
function generator(x0, a, c, m, n) {
    let random_numbers = [x0];
    for (let i = 0;i < n-1; i++) {
        random_numbers.push((a*random_numbers[i]+c)%m);
    }
    return random_numbers;
}
function periode(x0, a, c, m) {
    let x = (a * x0 + c) % m;
    let count = 1;
    while (x !== x0) {
        x = (a * x + c) % m;
        count++;
    }
    return count;
}
const formatArray = (arr, decimals = 4) => {
    const first5 = arr.slice(0, 5);
    const last = arr[arr.length - 1];

    const formatted = first5.map(x => typeof x === "number" ? x.toFixed(decimals) : x);

    if (arr.length > 6) {
        formatted.push("...");
        formatted.push(typeof last === "number" ? last.toFixed(decimals) : last);
    } else if (arr.length === 6) {
        formatted.push(typeof last === "number" ? last.toFixed(decimals) : last);
    }
    return `[${formatted.join(", ")}]`;
};


// function test_poisson(xn, rn, alpha, resultsTable) {
//     let n = rn.reduce((acc, val) => acc + val, 0);
//     let lamda = somme_pond(xn, rn);
//     let pn = Pn_p(lamda, xn);
//     let variable_observe= 0;

//     let regroup = false;
//     let riSum = 0;
//     let npiSum = 0;
//     let debReg = null;
//     let endReg = null;
//     let v = null;
//     for (let i = 0; i < xn.length; i++) {
//         let ri = rn[i];
//         let xi = xn[i];
//         let pi = pn[i];
//         let npi = pi *n;
//         regroup = npi < 5;
//         if (!regroup) {
//             let contribution = ((ri - npi)**2) / npi;
//             variable_observe += contribution;
//             resultsTable.addRow([xi, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)), parseFloat(contribution.toFixed(4))]);
//         } else {
//             if (!debReg) {
//                 debReg = xi;
//             }
//             endReg = xi;
//             riSum += ri;
//             npiSum += npi;
//         }
//     }
//     if (!regroup) {
//         v = Object.keys(rn).length - 2;
//     } else {
//         if (npiSum < 5) {
//             prevRow = resultsTable.tbody.children[resultsTable.tbody.children.length-1]
//             debReg = prevRow.children[0].textContent;
//             npiSum += Number(prevRow.children[3].textContent);
//             riSum += Number(prevRow.children[1].textContent);
//             variable_observe -= Number(prevRow.children[4].textContent);
//             resultsTable.tbody.lastElementChild.remove();
//         }
//         let contribution = ((riSum - npiSum) ** 2) / npiSum;
//         let pi = npiSum / n;
//         variable_observe += contribution;
//         let valueName = `[${debReg};${endReg}]`
//         resultsTable.addRow([valueName, riSum, parseFloat(pi.toFixed(4)), parseFloat(npiSum.toFixed(4)), parseFloat(contribution.toFixed(4))]);
//         v = resultsTable.tbody.children.length - 2;
//     }
//     return [variable_observe, jStat.chisquare.inv(1 - alpha, v)];
// }
// function test_exp_neg(xn, rn, alpha, resultsTable) {
//     let cn = [];
//     for (let i = 0; i < xn.length; i++) {
//         cn.push((xn[i][0] + xn[i][1]) / 2);
//     }
//     let n = rn.reduce((acc, val) => acc + val, 0);
//     let espérence = somme_pond(cn, rn);
//     let pn = Pn_exp(xn, 1/espérence);
//     let variable_observe= 0;

//     let regroup = false;
//     let riSum = 0;
//     let npiSum = 0;
//     let debReg = null;
//     let endReg = null;
//     let v = null;
//     for (let i = 0; i < xn.length; i++) {
//         let ri = rn[i];
//         let xi = xn[i];
//         let pi = pn[i];
//         let npi = pi *n;
//         regroup = npi < 5;
//         if (!regroup) {
//             let contribution = ((ri - npi)**2) / npi;
//             variable_observe += contribution;
//             resultsTable.addRow([xi, ri, parseFloat(pi.toFixed(4)), parseFloat(npi.toFixed(4)), parseFloat(contribution.toFixed(4))]);
//         } else {
//             if (!debReg) {
//                 debReg = xi[0];
//             }
//             endReg = xi[1];
//             riSum += ri;
//             npiSum += npi;
//         }
//     }
//     if (!regroup) {
//         v = Object.keys(rn).length - 2;
//     } else {
//         if (npiSum < 5) {
//             prevRow = resultsTable.tbody.children[resultsTable.tbody.children.length-1]
//             debReg = prevRow.children[0].textContent;
//             npiSum += Number(prevRow.children[3].textContent);
//             riSum += Number(prevRow.children[1].textContent);
//             variable_observe -= Number(prevRow.children[4].textContent);
//             resultsTable.tbody.lastElementChild.remove();
//         }
//         let contribution = ((riSum - npiSum) ** 2) / npiSum;
//         let pi = npiSum / n;
//         variable_observe += contribution;
//         let valueName = `[${debReg};${endReg}]`
//         resultsTable.addRow([valueName, riSum, parseFloat(pi.toFixed(4)), parseFloat(npiSum.toFixed(4)), parseFloat(contribution.toFixed(4))]);
//         v = resultsTable.tbody.children.length - 2;
//     }
//     return [variable_observe, jStat.chisquare.inv(1 - alpha, v)];
// }


// const factorial = n =>
//     n < 0 ? null : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);

// function li(x, y) {
//   return ((Math.E**-x) * x**y) / factorial(y);
// }
// function Pn_p(x, y) {
//     pn = []
//     for (let i = 0; i < y.length; i++) {
//         pn.push(li(x, i));
//     }
//     return pn;
// }
// function exp_neg(a, b, mu) {
//     return (Math.E ** (-mu * a)) - (Math.E ** (-mu * b))
// }
// function Pn_exp(xn, mu) {
//     pn = []
//     for (let i = 0; i < xn.length; i++) {
//         pn.push(exp_neg(xn[i][0], xn[i][1], mu));
//     }
//     return pn;
// }
// function arrivées_clients(ui) {
//     let nbClients = 0;
//     let sum_prob = li(0.83, 0);
//     while (ui > sum_prob) {
//         nbClients++;
//         sum_prob += li(0.83, nbClients);
//     }
//     return nbClients;
// }
// function somme_pond(x, y) {
//     let n = y.reduce((acc, val) => acc + val, 0);
//     let somme_p = 0;
//     for (let i = 0; i < x.length; i++) {
//         somme_p += x[i] * y[i];
//     }
//     return somme_p / n;
// }