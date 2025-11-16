export default class TableRésultats {
    constructor(nameTest) {
        this.table = [];
        this.nameTest = nameTest;
    }
    addRow(row) {
        this.table.push(row);
    }
    regroupTable(table) {
        let result = [];
        let i = 0;
        let done = false;

        while (i < table.length && !done) {
            if (table[i].npi >= 5) {
                result.push(table[i]);
                i++;
            } else {
                let riSum = table[i].ri;
                let npiSum = table[i].npi;
                let XiList = [table[i].Xi];
                let n = table[i].npi / table[i].pi;

                i++;
                while (i < table.length && npiSum < 5) {
                    riSum += table[i].ri;
                    npiSum += table[i].npi;
                    XiList.push(table[i].Xi);
                    i++;
                }
                if (npiSum < 5) {
                    let prev = result.pop();

                    prev.ri += riSum;
                    prev.npi += npiSum;
                    prev.Xi = "[" + prev.Xi + "," + XiList.join(",") + "]";
                    prev.pi = prev.npi / n;
                    prev.contribution = ((prev.ri - prev.npi) ** 2) / prev.npi;

                    result.push(prev);
                    done = true;
                } else {
                    let row = {
                        Xi: "[" + XiList.join(",") + "]",
                        ri: riSum,
                        pi: parseFloat((npiSum / n).toFixed(4)),
                        npi: parseFloat(npiSum.toFixed(4)),
                        contribution: parseFloat(((riSum - npiSum) ** 2 / npiSum).toFixed(4))
                    };
                    result.push(row);
                }
            }
        }
        this.tableRegrouped = result;
    }
    getTableHtml(alpha, regrouped = false) {
        let innerHTML = `
        <table>
            <caption>Résultats du ${this.nameTest}</caption>
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
        if (regrouped) {
            this.regroupTable(this.table);
            this.tableRegrouped.forEach((row) => {
                innerHTML+= this.rowHtml(row);
            });
            résultats = [this.totalContributions(this.tableRegrouped) ,jStat.chisquare.inv(1 - alpha, this.v(regrouped))];
            this.résultatsRegroupés = résultats;
        } else {
            this.table.forEach((row) => {
                innerHTML+= this.rowHtml(row);
            });
            résultats = [this.totalContributions(this.table) ,jStat.chisquare.inv(1 - alpha, this.v(regrouped))];
            this.résultas = résultats;
        }
        innerHTML+= this.résultatsHtml(résultats);
        return innerHTML;
    }
    rowHtml(row) {
        return `
            <tr>
                <td>${row.Xi}</td>
                <td>${row.ri}</td>
                <td>${row.pi.toFixed(4)}</td>
                <td>${row.npi.toFixed(4)}</td>
                <td>${row.contribution.toFixed(4)}</td>
            </tr>
        `;
    }
    résultatsHtml(résultas) {
        return `
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="4">X² observé</th>
                    <td>${résultas[0]}</td>
                </tr>
                <tr>
                    <th scope="row" colspan="4">Valeur critique</th>
                    <td>${résultas[1]}</td>
                </tr>
            </tfoot>
        </table>
        `;
    }
    totalContributions(table) {
        let total = 0;
        table.forEach((row) => {
            total +=  row.contribution;
        })
        return total;
    }
    v(regrouped = false) {
        return regrouped ? this.tableRegrouped.length-1 : this.table.length-1;
    }
    getRésultats() {
        return this.résultas;
    }
    getRésultatsRegroupés() {
        return this.résultatsRegroupés;
    }
}