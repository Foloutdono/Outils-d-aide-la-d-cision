// 20 = (21 * x + 57) % 100

let i = 0
while (((7 * i + 3) % 100) != 20) {
	i++;
}
console.log(i)

for (let i = 0; i < 100; i++) {
	console.log(i, ((i*100) +17) /41)
} 