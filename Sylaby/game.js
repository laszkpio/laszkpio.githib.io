const syllables = ['ba', 'na', 'na'];
let currentIndex = 0;

const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1200,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('bird', 'sprites/red_bird_normal.png');
}

function create() {
    this.birdGroup = this.add.group();

    for (let i = 0; i < syllables.length; i++) {
        let bird = this.add.sprite(100 + i * 200, 300, 'bird').setInteractive();
        bird.syllable = syllables[i];
        bird.on('pointerdown', () => {	
			speak(bird.syllable);
            if (bird.syllable === syllables[currentIndex]) {
                bird.setTint(0x00ff00);  // Correct, turn green	
                currentIndex++;
                if (currentIndex === syllables.length) {
                    alert('Correct word!');
                    resetGame(this.birdGroup);
                }
            } else {
                alert('Try again!');
                resetGame(this.birdGroup);
            }
        });
        this.birdGroup.add(bird);
        bird.text = this.add.text(bird.x - 100, bird.y - 80, bird.syllable, { font: '32px Arial', fill: '#fff' });
		this.birdGroup.add(bird.text);
    }
}

function update() {
    Phaser.Actions.IncX(this.birdGroup.getChildren(), 1);

    this.birdGroup.getChildren().forEach(bird => {
        if (bird.x > 1600) {
            bird.x = 0;
			bird.text.x = -100;
        }
    });
}

function resetGame(birdGroup) {
    currentIndex = 0;
    birdGroup.getChildren().forEach(bird => {
        bird.clearTint();
    });
}

function speak(text) {
      const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      speechSynthesisUtterance.lang = 'pl-PL';
      window.speechSynthesis.speak(speechSynthesisUtterance);
}
