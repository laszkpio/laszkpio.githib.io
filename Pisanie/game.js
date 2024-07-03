let words = [];
let currentWordIndex = 0;
let score = 0;

const wordDisplay = document.getElementById("wordDisplay");
const wordInput = document.getElementById("wordInput");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("scoreDisplay");
const correctSound = document.getElementById("correctSound");
const fanfareSound = document.getElementById("fanfareSound");
const keys = document.querySelectorAll(".key");
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");

startButton.addEventListener("click", startGame);
wordInput.addEventListener("input", checkInput);

fetch('words.json')
    .then(response => response.json())
    .then(data => {
        words = data.words;
    })
    .catch(error => console.error('Error fetching words:', error));

function startGame() {
    score = 0;
    currentWordIndex = 0;
    wordInput.value = "";
    wordInput.disabled = false;
    wordInput.focus();
    scoreDisplay.textContent = `Wynik: ${score}`;
    displayNextWord();
}

function displayNextWord() {
    if (currentWordIndex < words.length) {
        wordDisplay.innerHTML = generateWordDisplay(words[currentWordIndex], "");
        highlightNextKey();
		speak(words[currentWordIndex]);
    } else {
        endGame();
    }
}

function generateWordDisplay(word, typed) {
    let display = "";
    for (let i = 0; i < word.length; i++) {
        if (i < typed.length) {
            if (word[i].toLowerCase() === typed[i].toLowerCase()) {
                display += `<span style="color: green;">${word[i]}</span>`;
            } else {
                display += `<span style="color: red;">${word[i]}</span>`;
            }
        } else if (i === typed.length) {
            display += `<span style="background-color: yellow;">${word[i]}</span>`;
        } else {
            display += `<span>${word[i]}</span>`;
        }
    }
    return display;
}

function checkInput() {
    const typedValue = wordInput.value;
    const currentWord = words[currentWordIndex];
    
    wordDisplay.innerHTML = generateWordDisplay(currentWord, typedValue);
    
    if (typedValue.toLowerCase() === currentWord.toLowerCase()) {
		// Play fanfare sound
        fanfareSound.currentTime = 0;
		fanfareSound.onended  = function() {
			score++;
			currentWordIndex++;
			wordInput.value = "";
			scoreDisplay.textContent = `Wynik: ${score}`;			
		  };
        fanfareSound.play();
        
    } else if (typedValue.length <= currentWord.length) {
        if (typedValue[typedValue.length - 1]?.toLowerCase() === currentWord[typedValue.length - 1]?.toLowerCase()) {
            correctSound.play();
        } else {
			incorrectSound.play();
		}
        highlightNextKey();
    }
}

function highlightNextKey() {
    const currentWord = words[currentWordIndex];
    const typedValue = wordInput.value;
    const nextLetter = currentWord[typedValue.length];

    keys.forEach(key => {
        key.classList.remove("highlight");
        if (key.textContent.toUpperCase() === nextLetter?.toUpperCase() || (nextLetter === " " && key.textContent.trim().toLowerCase() === "space")) {
            key.classList.add("highlight");
        }
    });
}

function endGame() {
    wordDisplay.textContent = "Świetna robota Zuza!";
    wordInput.disabled = true;
    keys.forEach(key => key.classList.remove("highlight"));
}

function speak(text) {
      const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      speechSynthesisUtterance.lang = 'pl-PL';
      window.speechSynthesis.speak(speechSynthesisUtterance);
}