export default class TableRésultats {
    constructor(nomTest) {
        this.table = [];
        this.nomTest = nomTest;
    }
    ajouteLigne(ligne) {
        this.table.push(ligne);
    }
    regroupementTable(table) {
        let nouvelleTable = [];
        let iLigne = 0;
        let fini = false;

        while (iLigne < table.length && !fini) {
            if (table[iLigne].npi >= 5) {
                nouvelleTable.push(table[iLigne]);
                iLigne++;
            } else {
                let riSum = table[iLigne].ri;
                let npiSum = table[iLigne].npi;
                let XiList = [table[iLigne].Xi];
                let n = table[iLigne].npi / table[iLigne].pi;

                iLigne++;
                while (iLigne < table.length && npiSum < 5) {
                    riSum += table[iLigne].ri;
                    npiSum += table[iLigne].npi;
                    XiList.push(table[iLigne].Xi);
                    iLigne++;
                }
                if (npiSum < 5) {
                    let lignePréc = nouvelleTable.pop();

                    lignePréc.ri += riSum;
                    lignePréc.npi += npiSum;
                    lignePréc.Xi = "[" + lignePréc.Xi + "," + XiList.join(",") + "]";
                    lignePréc.pi = lignePréc.npi / n;
                    lignePréc.contribution = ((lignePréc.ri - lignePréc.npi) ** 2) / lignePréc.npi;

                    nouvelleTable.push(lignePréc);
                    fini = true;
                } else {
                    let ligne = {
                        Xi: "[" + XiList.join(",") + "]",
                        ri: riSum,
                        pi: parseFloat((npiSum / n).toFixed(4)),
                        npi: parseFloat(npiSum.toFixed(4)),
                        contribution: parseFloat(((riSum - npiSum) ** 2 / npiSum).toFixed(4))
                    };
                    nouvelleTable.push(ligne);
                }
            }
        }
        this.tableRegroupé = nouvelleTable;
    }
    getTableHtml(alpha, regroupé = false) {
        let innerHTML = `
        <table>
            <caption>${this.nomTest} ${regroupé ? "avec regroupement": "sans regroupement"}</caption>
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
        `;
        let résultats = [];
        if (regroupé) {
            this.regroupementTable(this.table);
            this.tableRegroupé.forEach((ligne) => {
                innerHTML+= this.ligneHtml(ligne);
            });
            résultats = [this.totalContributions(this.tableRegroupé) ,jStat.chisquare.inv(1 - alpha, this.v(regroupé))];
            this.résultatsRegroupés = résultats;
        } else {
            this.table.forEach((ligne) => {
                innerHTML+= this.ligneHtml(ligne);
            });
            résultats = [this.totalContributions(this.table) ,jStat.chisquare.inv(1 - alpha, this.v(regroupé))];
            this.résultas = résultats;
        }
        innerHTML+= this.résultatsHtml(résultats);
        return innerHTML;
    }
    ligneHtml(ligne) {
        return `
            <tr>
                <td>${ligne.Xi}</td>
                <td>${ligne.ri}</td>
                <td>${ligne.pi.toFixed(4)}</td>
                <td>${ligne.npi.toFixed(4)}</td>
                <td>${ligne.contribution.toFixed(4)}</td>
            </tr>
        `;
    }
    résultatsHtml(résultas) {
        return `
            </tbody>
            <tfoot>
                <tr>
                    <th scope="ligne" colspan="4">X² observé</th>
                    <td>${résultas[0]}</td>
                </tr>
                <tr>
                    <th scope="ligne" colspan="4">Valeur critique</th>
                    <td>${résultas[1]}</td>
                </tr>
            </tfoot>
        </table>
        `;
    }
    totalContributions(table) {
        let total = 0;
        table.forEach((ligne) => {
            total +=  ligne.contribution;
        })
        return total;
    }
    v(regroupé = false) {
        return regroupé ? this.tableRegroupé.length-1 : this.table.length-1;
    }
    getRésultats() {
        return this.résultas;
    }
    getRésultatsRegroupés() {
        return this.résultatsRegroupés;
    }
}