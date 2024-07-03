const syllables = ['ba', 'na', 'na'];
let currentIndex = 0;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('sheep', 'sheep.png');
}

function create() {
    this.sheepGroup = this.add.group();

    for (let i = 0; i < syllables.length; i++) {
        let sheep = this.add.sprite(100 + i * 200, 300, 'sheep').setInteractive();
        sheep.syllable = syllables[i];
        sheep.on('pointerdown', () => {
            if (sheep.syllable === syllables[currentIndex]) {
                sheep.setTint(0x00ff00);  // Correct, turn green
                currentIndex++;
                if (currentIndex === syllables.length) {
                    alert('Correct word!');
                    resetGame(this.sheepGroup);
                }
            } else {
                alert('Try again!');
                resetGame(this.sheepGroup);
            }
        });
        this.sheepGroup.add(sheep);
        this.add.text(sheep.x - 20, sheep.y - 70, sheep.syllable, { font: '32px Arial', fill: '#000' });
    }
}

function update() {
    Phaser.Actions.IncX(this.sheepGroup.getChildren(), 1);

    this.sheepGroup.getChildren().forEach(sheep => {
        if (sheep.x > 800) {
            sheep.x = 0;
        }
    });
}

function resetGame(sheepGroup) {
    currentIndex = 0;
    sheepGroup.getChildren().forEach(sheep => {
        sheep.clearTint();
    });
}
