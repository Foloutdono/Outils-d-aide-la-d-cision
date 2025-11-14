export default class TableRésultats {
    constructor(nameTest) {
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