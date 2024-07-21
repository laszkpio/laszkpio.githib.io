let words = [];
const syllables = [];
let currentIndex = 0;

const correctSound = document.getElementById("correctSound");
const fanfareSound = document.getElementById("fanfareSound");
const incorrectSound = document.getElementById("incorrectSound");

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1200,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("bird", "sprites/red_bird_normal.png");
  fetch("words.json")
    .then((response) => response.json())
    .then((data) => {
      words = data.words;
    })
    .catch((error) => console.error("Error fetching words:", error));
}

function create() {
  createNewBirdsForRandomWord();
}

function createNewBirdsForRandomWord() {
  // Clear previous birds
  this.birdGroup.clear(true, true);
  this.birdGroup = this.add.group();
  syllables = getRandomSyllables(words);
  for (let i = 0; i < syllables.length; i++) {
    speak(syllables[i]);
  }


  for (let i = 0; i < syllables.length; i++) {
    let bird = this.add.sprite(100 + i * 200, 300, "bird").setInteractive();
    bird.syllable = syllables[i];
    bird.on("pointerdown", () => {
      speak(bird.syllable);
      if (bird.syllable === syllables[currentIndex]) {
        bird.setTint(0x00ff00); // Correct, turn green
        correctSound.play();
        currentIndex++;
        if (currentIndex === syllables.length) {
          fanfareSound.play();
          resetGame(this.birdGroup);
        }
      } else {
        incorrectSound.play();
      }
    });
    this.birdGroup.add(bird);
    bird.text = this.add.text(bird.x - 100, bird.y - 80, bird.syllable, {
      font: "32px Arial",
      fill: "#fff",
    });
    this.birdGroup.add(bird.text);
  }
}

function getRandomSyllables(words) {
  // Select a random word from the list
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex];

  // Split the word into syllables by the "-" sign and filter out any empty strings
  const syllables = randomWord
    .split("-")
    .filter((syllable) => syllable.length > 0);

  return syllables;
}

function update() {
  Phaser.Actions.IncX(this.birdGroup.getChildren(), 1);

  this.birdGroup.getChildren().forEach((bird) => {
    if (bird.x > 1600) {
      bird.x = 0;
      bird.text.x = -100;
    }
  });
}

function resetGame(birdGroup) {
  currentIndex = 0;
  birdGroup.getChildren().forEach((bird) => {
    bird.clearTint();
  });
  createNewBirdsForRandomWord();
}

function speak(text) {
  const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesisUtterance.lang = "pl-PL";
  window.speechSynthesis.speak(speechSynthesisUtterance);
}
