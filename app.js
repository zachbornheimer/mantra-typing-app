/**
 * @file Mantra typing app
 * @author Zachary Bornheimer (with ChatGPT)
 * @license MIT
 */

// Define the list of mantras
let mantras = [
    "I am worthy of my own time.",
    "Every day and in every way, I'm getting better and better, stronger and stronger, more prosperous, wise, and loving",
    "I am a success story.",
    "This day is a glorious day that I will live absolutely fully, radiating positivity, maximizing my productivity, and savoring life's beauty.",
    "I love myself.",
    "I am living this blessing of a day with a fully focused mind, a wide-opened heart, and increasingly fit body and noble spirit: making magic, materializing my dreams, and making the world a brighter place",
    "I am worthy of my own time.",
];


// Get the query parameters
const queryParams = new URLSearchParams(window.location.search);
const mantra = queryParams.get('mantra');

// set constants
const pushSpeed = 10;
const displayOffset = 350;

// Add the mantra to the list
if (mantra) {
    mantras = new URLSearchParams(window.location.search).getAll("mantra");
}

// Initialize the current mantra and word indices
let currentMantraIndex = 0;
let currentWordIndex = 0;

// Get the necessary elements from the HTML
const mantraText = document.getElementById("mantra-text");
const mantraInput = document.getElementById("mantra-input");
const completeMessage = document.getElementById("complete-message");

/**
 * Gets the next word to be typed.
 * @returns {string} The next word.
 */
const getNextWord = () => {
    if (currentMantraIndex < mantras.length) {
        const words = mantras[currentMantraIndex].split(/\s+/);
        if (currentWordIndex < words.length) {
            return words[currentWordIndex];
        } else {
            return mantras[currentMantraIndex];
        }
    } else {
        return "";
    }
};

/**
 * Shows the next mantra to be typed.
 */
const getNextMantra = () => {
    currentMantraIndex++;
    if (currentMantraIndex < mantras.length) {
        currentWordIndex = 0;
        mantraInput.value = "";
        mantraInput.placeholder = "Type your mantra...";
        completeMessage.textContent = "";
        const currentMantra = mantras[currentMantraIndex];
        const words = currentMantra.split(" ");
        const text = words.map((word, index) => {
            const color = index < currentWordIndex ? "var(--mantra-typed)" : "var(--mantra)";
            return `<span style="color:${color}">${word} </span>`;
        }).join("");
        mantraText.innerHTML = text;
    } else {
        mantraInput.disabled = true;
        mantraInput.value = '';
        mantraInput.placeholder = '';
        mantraText.innerHTML = 'Have a fantastic day.';
        mantraInput.style.display = 'none';

        const completedMantras = document.querySelectorAll(".completed-mantra");
        completedMantras.forEach((mantra, index) => {
            mantra.style.transition = "all 0.5s ease-in-out";
            mantra.style.opacity =  "0";
        });

    }
};




const handleInput = () => {
    const typedWords = mantraInput.value.trim().toLowerCase().split(/\s+/);
    const currentWord = getNextWord().toLowerCase();
    let typedWord = typedWords[currentWordIndex];
    try {
        typedWord = typedWord.trim();
    } catch(e) {}

    if (typedWord === "" || currentWord.startsWith(typedWord)) {
        const textWords = mantras[currentMantraIndex].split(/\s+/);
        let html = "";
        for (let i = 0; i < textWords.length; i++) {
            const word = textWords[i];
            let color = "var(--mantra-untyped)";
            if (i === currentWordIndex) {
                color = "var(--mantra)";
            } else if (i < currentWordIndex) {
                color = "var(--mantra-typed)";
            }
            html += `<span class="${color}" style="color: ${color};">${word}</span> `;
        }
        mantraText.innerHTML = html;
        if (typedWord === currentWord) {
            currentWordIndex++;
            if (currentWordIndex === textWords.length) {
                // Clone the completed mantra and position it
                const completedMantra = document.createElement("div");
                completedMantra.className = "completed-mantra";
                completedMantra.setAttribute('id', `completedMantra${currentMantraIndex}`);
                completedMantra.textContent = mantras[currentMantraIndex];

                document.getElementById('completed-mantras').appendChild(completedMantra);
                const inputRect = mantraInput.getBoundingClientRect();
                const textRect = mantraText.getBoundingClientRect();
                completedMantra.style.top = `${mantraText.offsetTop}px`;
                completedMantra.style.left = `${mantraText.offsetLeft}px`;
                completedMantra.style.width = `${mantraText.offsetWidth}px`;
                completedMantra.style.textAlign = 'center';
                const completedMantras = document.querySelectorAll(".completed-mantra");
                completedMantras.forEach((mantra, index) => {
                    mantra.style.transition = "all 0.5s ease-in-out";
                    if (index !== completedMantras.length - 1) mantra.style.opacity =  "0";
                });
                let interval = setInterval(() => {
                    let completedMantraDiv = document.getElementById(`completedMantra${currentMantraIndex}`);
                    let top = parseInt(completedMantraDiv.style.top.replace(/\D/, ''));
                    completedMantraDiv.style.top = `${top + pushSpeed}px`;
                    if (top == document.getElementById("mantra-input").offsetTop) {
                        document.getElementById("mantra-input").value = '';
                        document.getElementById("mantra-input").disabled = true;
                    }
                    if (top + pushSpeed >= displayOffset + document.getElementById("mantra-text").offsetTop) {
                        document.getElementById("mantra-input").disabled = false;

                        clearInterval(interval);
                        getNextMantra();
                        completedMantraDiv.style.fontSize = '5vw';
                        completedMantraDiv.style.opacity = '0.08';
                    }
                }, pushSpeed);
            }
        }
    } else if (typedWord === " ") {
        // User typed a space, highlight the next word
        currentWordIndex++;
        if (currentWordIndex === mantras[currentMantraIndex].split(/\s+/).length) {
            // Clone the completed mantra and position it
            const completedMantra = document.createElement("div");
            completedMantra.className = "completed-mantra";
            completedMantra.textContent = mantras[currentMantraIndex];
            document.body.appendChild(completedMantra);
            const inputRect = mantraInput.getBoundingClientRect();
            const textRect = mantraText.getBoundingClientRect();
            completedMantra.style.top = `${textRect.top + textRect.height + 50}px`;
            completedMantra.style.left = `${textRect.left}px`;

            // Delay the appearance of the next mantra
            setTimeout(() => {
                getNextMantra();
            }, 1000);
        }
        mantraInput.value = "";
        handleInput();
    } else if (typedWord !== "") {
        // Reset the input value to the last valid word
        //mantraInput.value = typedWords.slice(0, currentWordIndex).join(" ");
    }
};


/**
 * Animates the current mantra and shows the completed message.
 */
const animateMantra = () => {
    // Create a new element to hold the completed mantra
    const completedMantra = document.createElement("div");
    completedMantra.textContent = mantras[currentMantraIndex];

    // Add a class to style the completed mantra
    completedMantra.classList.add("completed-mantra");

    // Add the completed mantra to the container element
    const container = document.querySelector(".container");
    container.appendChild(completedMantra);

    // Animate the current mantra and the completed message
    mantraText.classList.add("pushed-down");
    completeMessage.classList.add("fade-in");

    // Wait for the animation to finish, then remove the current mantra and reset the animation
    setTimeout(() => {
        mantraText.classList.remove("pushed-down");
        completeMessage.classList.remove("fade-in");
        container.removeChild(completedMantra);
        getNextMantra();
    }, 2000);
};


// Initialize the app with the first mantra
mantraText.innerHTML = mantras[currentMantraIndex].replace(/\S+/g, "<span>$&</span> ");
mantraInput.addEventListener("input", handleInput);

