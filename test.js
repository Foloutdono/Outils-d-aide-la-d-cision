import TableRésultats from "./tableRésultats.js";
export default class Test {
    constructor(nomTest, type, fonction, params) {
        this.div = document.createElement("div");
        this.div.classList.add("test");
        this.div.innerHTML += `<h1>${nomTest}</h1>`;
        this.fonction = fonction;
        this.params = params;
        this.nomTest = nomTest;
        this.type = type;
        this.makeThetest();
    }
    makeThetest() {
        this.étape1();
        this.étape2();
        this.étape3();
        this.étape4();
        this.étape5();
        this.étape6();
        this.étape7();
        document.body.appendChild(this.div);
    }
    étape1() {
        let H0 = "";
        let H1 = "";
        switch (this.type) {
            case "fréquences":
                H0 = `Les yn suivent une distribution uniforme sur l'ensemble {0, 1, 2, ..., 9}. Autrement dit, chaque chiffre
                de 0 à 9 a la même probabilité d'apparaître, soit p = 0,1.`;
                H1 = `Les yn ne suivent pas une distribution uniforme sur {0, 1, 2, ..., 9}.`
            break;
            case "courses":
                H0 = `La suite des xn est indépendante. 
                Autrement dit, le nombre de courses (suites croissantes ou décroissantes) observé correspond à celui attendu si les xn sont générés aléatoirement et sans corrélation entre eux.`;
                H1 = `La suite des xn n'est pas indépendante. 
                Autrement dit, le nombre de courses observé s'écarte significativement de celui attendu, ce qui indique l'existence d'une corrélation ou d'une structure dans la suite.`;
            break;
            case "poker":
                H0 = `Les yn suivent une répartition conforme à celle attendue pour un générateur aléatoire. 
                Autrement dit, les fréquences des différentes combinaisons (paires, brelans, carrés, etc.) correspondent aux probabilités théoriques.`;
                H1 = `Les yn ne suivent pas la répartition théorique des combinaisons du poker. 
                Autrement dit, les fréquences observées des combinaisons s'écartent des probabilités attendues.`;
            break;
            case "sauts":
                H0 = `Les yn suivent une répartition conforme à celle attendue pour un générateur aléatoire. 
                Autrement dit, les longueurs des sauts entre deux occurrences d'une valeur donnée respectent les probabilités théoriques.`;
                H1 = `Les yn ne suivent pas la répartition théorique des longueurs de sauts. 
                Autrement dit, les distances observées entre deux occurrences d'une même valeur s'écartent des probabilités attendues.`;
            break;
            case "carré":
                H0 = `Les un sont répartis uniformément sur l'intervalle [0, 1]. 
                Autrement dit, les fréquences observées dans les subdivisions du carré-unité correspondent aux probabilités théoriques.`;
                H1 = `Les un ne sont pas répartis uniformément sur [0, 1]. 
                Autrement dit, les fréquences observées dans les subdivisions du carré-unité s'écartent des probabilités attendues.`;
            break;
        }
        this.div.innerHTML += `<h3>Etape 1 : Formulation des Hypothèses</h3>
            <h4>Hypothèse nulle (H0) :</h4>
            <p>${H0}</p>
            <h4>Hypothèse alternative (H1) :</h4>
            <p>${H1}</p>
        `;
    }
    étape2() {
        this.div.innerHTML += `<h3>Etape 2 : Niveau de Signification</h3>
            <p>Nous choisissons un niveau de signification de α = ${this.params.alpha * 100}%. 
            Cela signifie que nous acceptons un risque de 
            ${this.params.alpha * 100}% de rejeter H0 alors qu'elle est vraie.</p>
        `;
    }
    étape3() {
        const résultats = new TableRésultats(this.nomTest);
        this.fonction(this.params, résultats);
        this.div.innerHTML += `<h3>Etape 3 : Calcul des Fréquences Observées et Théoriques</h3>
            ${résultats.getTableHtml(this.params.alpha, false)}
        `;
    }
    étape4() {
        const résultats = new TableRésultats(this.nomTest);
        this.fonction(this.params, résultats);
        this.div.innerHTML += `<h3>Etape 4 : Vérification des npi</h3>
            ${résultats.getTableHtml(this.params.alpha, true)}
        `;
        this.résultats = résultats.getRésultatsRegroupés();
        this.v = résultats.v(true);
    }
    étape5() {
        this.div.innerHTML += `<h3>Etape 5 : Détermination des Degrés de Liberté et de la Valeur Critique</h3>
            <h4>Nombre de Degrés de Liberté (v)</h4>
            <ul><li><strong>v</strong> = ${this.v+1} - 1 = ${this.v}</li></ul>
            <h4>Valeur Critique</h4>
            <p>Pour un niveau de signification α = ${this.params.alpha * 100}% 
            et degrés de liberté v = ${this.v} :</p>
            <ul><li><strong>valeur critique</strong> = ${this.résultats[1]}</li></ul>
        `;
    }
    étape6() {
        this.différence = this.résultats[0] - this.résultats[1];
        this.div.innerHTML += `<h3>Etape 6 : Prise de Décision</h3>
            <h4>Nous comparons la valeur de X²observé à la valeur critique :</h4>
            <ul>
                <li>Si X²observé ≤ valeur critique, nous ne rejetons pas l'hypothèse nulle H0.</li>
                <li>Si X²observé > valeur critique, nous rejetons l'hypothèse nulle H0.</li>
            </ul>
            <p>Dans notre cas :</p>
            <p>X²observé = ${this.résultats[0]} ${this.différence <= 0 ? "≤": ">"} ${this.résultats[1]} = valeur critique</p>
            <h4>Conclusion :</h4>
            <p>Puisque X²observé est 
            ${this.différence < 0 ? "inférieur": (this.différence > 0 ? "supérieur": "égale")}
             à la valeur critique, nous 
            ${this.différence <= 0 ? "ne rejetons pas": "rejetons"}
             l'hypothèse nulle</p>
        `;
    }
    étape7() {
        this.div.innerHTML += `<h3>Etape 7 : Conclusion</h3>
            <p>Le test du khi-deux 
            ${this.différence <= 0 ? "n'a pas": "a"} mis en évidence 
            ${this.différence <= 0 ? "de": "une"} différence statistiquement significative entre les
            fréquences observées des chiffres générés par le générateur pseudo-aléatoire et les fréquences
            théoriques attendues pour une distribution uniforme.
            </p>
            <p>Ainsi, au niveau de signification de ${this.params.alpha * 100}%, 
            nous concluons que la suite de nombres pseudoaléatoires 
            ${this.différence <= 0 ? "est": "n'est pas"} acceptable pour ce test.
            </p>

        `;
    }

}