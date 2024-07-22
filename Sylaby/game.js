let words = [];
let syllables = [];
let currentIndex = 0;
let currentWord = null;
let xTextDecrement = 50;
let yTextDecrement = 50;
let xBirdDistance = 500;
let ScreenWidth = 1600;
let screenHeight = 1200;

const correctSound = document.getElementById("correctSound");
const fanfareSound = document.getElementById("fanfareSound");
const incorrectSound = document.getElementById("incorrectSound");

fetch("words.json")
      .then((response) => response.json())
      .then((data) => {
        words = data.words;
      })
      .catch((error) => {
        console.error("Error fetching words:", error);
        words = [
          "zu-zia",
          "ko-cham",
          "zu-zia-ko-cha-ma-mę",
          "to-ja-zu-zia",
          "ty-gry-sek-da-niel",
          "naj-ko-tek-",
          "pa-pry-ka-chi-li",
          "po-mi-dor",
        ];
      });

class SylabyScene extends Phaser.Scene {
  preload() {
    this.load.image("bird", "sprites/red_bird_normal.png");
    
  }

  create() {
    this.createNewBirdsForRandomWord();
  }

  getRandomSyllables = function (words) {
    // Select a random word from the list
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];

    // Split the word into syllables by the "-" sign and filter out any empty strings
    const syllables = randomWord
      .split("-")
      .filter((syllable) => syllable.length > 0);

    currentWord = randomWord.replace("/-/g", "");

    return syllables;
  };

  createNewBirdsForRandomWord = function () {
    this.birdGroup = this.add.group();
    syllables = this.getRandomSyllables(words);

    for (let i = 0; i < syllables.length; i++) {
      const permutations = this.generatePermutations(syllables[i]);
      for (let j = 0; j < permutations.length; j++) {
        let bird = this.add
          .sprite(ScreenWidth + i * xBirdDistance + Math.random() * 200, 300 + j * 250 + Math.random() * 50,
            "bird"
          )
          .setInteractive();
        bird.setScale(0.5);

        bird.syllable = permutations[j];
        bird.on("pointerdown", () => {
          this.speak(bird.syllable);
          if (bird.syllable === syllables[currentIndex]) {
            console.log("bird guessed: " + currentIndex + " " + bird.syllable);
            bird.guessed = true;
            bird.text.guessed = true;
            bird.setTint(0x00ff00); // Correct, turn green
            correctSound.play();
            let positionX = 100 + currentIndex * 200;
            let positionY = 50;
            bird.x = positionX;
            bird.y = positionY;
            bird.text.x = positionX - xTextDecrement;
            bird.text.y = positionY - yTextDecrement;
            currentIndex++;
            if (currentIndex === syllables.length) {
              fanfareSound.play();
              setTimeout(() => {
                this.resetGame(this.birdGroup);
              }, 5000);  
            }
          } else {
            bird.setTint(0xff0000); // incorrect, turn red
            incorrectSound.play();
          }
        });
        this.birdGroup.add(bird);
        bird.text = this.add.text(
          bird.x - xTextDecrement,
          bird.y - yTextDecrement,
          bird.syllable,
          {
            font: "28px Arial",
            fill: "#fff",
          }
        );

        bird.guessed = false;
        bird.text.guessed = false;
        this.birdGroup.add(bird.text);
      }
    }
    this.speak(currentWord);
  };

  generatePermutations = function (syllable) {
    const permutations = new Set();
    const chars = (syllable + syllable).split("");

    while (permutations.size < 3) {
      const permuted = chars
        .sort(() => 0.5 - Math.random())
        .join("")
        .substring(0, syllable.length);
      console.log(permuted);

      // Add only unique permutations different from the original syllable
      if (permuted !== syllable) {
        permutations.add(permuted);
      }
    }
    permutations.add(syllable);
    console.log(permutations);

    // Convert the set to an array and shuffle it
    const permArray = Array.from(permutations);
    for (let i = permArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [permArray[i], permArray[j]] = [permArray[j], permArray[i]]; // Swap elements
    }

    console.log(permArray);

    return permArray;
  };

  update() {
    const nonGuessedBirds = this.birdGroup
      .getChildren()
      .filter((object) => !object.guessed);
    Phaser.Actions.IncX(nonGuessedBirds, -3);

    nonGuessedBirds.forEach((bird) => {
      if (bird.text.x < 0) {
        bird.x = Math.max(ScreenWidth, syllables.length * xBirdDistance) + Math.random() * 200;
        bird.text.x = bird.x - xTextDecrement;
      }
    });
  }

  resetGame = function (birdGroup) {
    currentIndex = 0;
    birdGroup.clear(true, true);
    this.createNewBirdsForRandomWord();
  };

  speak = function (text) {
    const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = "pl-PL";
    window.speechSynthesis.speak(speechSynthesisUtterance);
  };
}

const config = {
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 1200,
  },
  scene: SylabyScene,
};

const game = new Phaser.Game(config);
