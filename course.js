function init() {
    document.getElementById("userForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const alpha = Number(formData.get("alpha")) / 100;
        const a = Number(formData.get("a"));
        const m = Number(formData.get("m"));
        const c = Number(formData.get("c"));
        const x0 = Number(formData.get("x0"));
        const n = Number(formData.get("n"));

        valeurs = test_course(x0, a, c, m, n, alpha)
        variable_observe = valeurs[0]
        valeur_critique = valeurs[1]
        console.log(variable_observe, valeur_critique)
    });
}
window.onload = init

function generator(x0, a, c, m, n) {
    random_numbers = [x0]
    for (let i = 0;i < n-1; i++) {
        random_numbers.push((a*random_numbers[i]+c)%m)
    }
    return random_numbers
}
function test_course(x0, a, c, m, n, alpha) {
    random_numbers = generator(x0, a, c, m, n)
    ri = {}
    len = 1
    for (let i = 1; i < n; i++) {
        if (random_numbers[i-1] < random_numbers[i]) {
            len++
        }
        if (!(random_numbers[i-1] < random_numbers[i]) || i+1 == n) {
            if (ri.hasOwnProperty(len)) {
                ri[len]++
            } else {
                ri[len] = 1
            }
            len = 1
            i++
        }
    }
    variable_observe = 0
    for (prop in ri) {
        value = Number(prop)
        npi = n * (value/factorial((value+1)))
        variable_observe += ((ri[prop] - npi)**2) / npi
    }
    v = Object.keys(ri).length - 1
    return [variable_observe, jStat.studentt.inv(1 - alpha, v)];
}
const factorial = n =>
  n < 0 ? undefined : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);