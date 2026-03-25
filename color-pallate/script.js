const shuffleBtn = document.getElementById("random")
const cards = document.querySelectorAll(".card");
function genratecolors(){
    const chars = "0123456789ABCDEF";
    let color = "#"
    for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }

    return color;
}

function generatePalette() {
    cards.forEach(card => {
        const color = genratecolors();

        const display = card.querySelector(".display");
        const hexText = card.querySelector(".hex-value");

        display.style.backgroundColor = color;
        hexText.textContent = color;
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
    
        })
        .catch(err => {
            console.error("Copy failed", err);
        });
}

cards.forEach(card => {
    card.addEventListener("click", () => {
        const hex = card.querySelector(".hex-value").textContent;
        copyToClipboard(hex);
    });
});

shuffleBtn.addEventListener("click", generatePalette);

generatePalette();