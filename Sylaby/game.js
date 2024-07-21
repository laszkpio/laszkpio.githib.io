let words = [];
let syllables = [];
let currentIndex = 0;
let currentWord = null;

const correctSound = document.getElementById("correctSound");
const fanfareSound = document.getElementById("fanfareSound");
const incorrectSound = document.getElementById("incorrectSound");

class SylabyScene extends Phaser.Scene {
  preload() {
    this.load.image("bird", "sprites/red_bird_normal.png");
    fetch("words.json")
      .then((response) => response.json())
      .then((data) => {
        words = data.words;
      })
      .catch((error) => console.error("Error fetching words:", error));
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
    this.speak(currentWord);

    for (let i = 0; i < syllables.length; i++) {
      const permutations = this.generatePermutations(syllables[i]);
      for (let j = 0; j < permutations.length; j++) {
        let bird = this.add
          .sprite(100 + i * 250, 300 + j * 250, "bird")
          .setInteractive();
        bird.setScale(0.5);
        bird.syllable = permutations[j];
        bird.on("pointerdown", () => {
          this.speak(bird.syllable);
          if (bird.syllable === syllables[currentIndex]) {
            bird.setTint(0x00ff00); // Correct, turn green
            correctSound.play();
            currentIndex++;
            if (currentIndex === syllables.length) {
              fanfareSound.play();
              this.resetGame(this.birdGroup);
            }
          } else {
            bird.setTint(0xff0000); // incorrect, turn red
            incorrectSound.play();
          }
        });
        this.birdGroup.add(bird);
        bird.text = this.add.text(bird.x - 50, bird.y - 40, bird.syllable, {
          font: "24px Arial",
          fill: "#fff",
        });
        this.birdGroup.add(bird.text);
      }
    }
  };

  generatePermutations = function (syllable) {
    const permutations = new Set();
    const chars = (syllable+syllable).split("");

    while (permutations.size < 3) {   
      const permuted = chars.sort(() => 0.5 - Math.random()).join("").substring(0,syllable.length);
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

  addBird(x, y, syllable) {}

  update() {
    Phaser.Actions.IncX(this.birdGroup.getChildren(), 1);

    this.birdGroup.getChildren().forEach((bird) => {
      if (bird.x > 1600) {
        bird.x = 0;
        bird.text.x = -100;
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
