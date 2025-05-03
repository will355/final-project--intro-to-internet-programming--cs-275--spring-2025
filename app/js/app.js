const size = parseInt(prompt(`Enter a number for the diamond size:`), 10);

if (!Number.isInteger(size) || size <= 0) {
    alert(`Please enter a positive integer.`);
    location.reload();
}

const createDiamond = (n) => {
    let diamond = ``;
    const midpoint = Math.floor(n / 2);
    for (let i = 0; i < n; i++) {
        const stars = i <= midpoint ? i * 2 + 1 : (n - i - 1) * 2 + 1;
        const spaces = Math.abs(midpoint - i);
        diamond += ` `.repeat(spaces) + `*`.repeat(stars) + `\n`;
    }
    return diamond;
};

const container = document.getElementById(`diamond-container`);
const pre = document.createElement(`pre`);
pre.textContent = createDiamond(size);
container.appendChild(pre);

//  wait for the browser to fully render
window.addEventListener(`load`, () => {
    let x = 0;
    let direction = 1;
    const speed = 2;

    const animate = () => {
        const containerWidth = container.offsetWidth;
        const screenWidth = window.innerWidth;

        // Reverse direction when bounds are hit
        if (x + containerWidth >= screenWidth) direction = -1;
        if (x <= 0) direction = 1;

        x += direction * speed;
        container.style.left = `${x}px`;

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
});
