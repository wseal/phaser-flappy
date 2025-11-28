import Phaser from "phaser";

export default class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.config = config;
    console.log(this.config);

    this.bird = null;
    this.pipe = null;

    this.flapVelocityY = 200;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 450];
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBG();
    this.createBird();
    this.createPipe();
    this.handleInput();
  }

  update(time, delta) {
    this.checkBirdStatus();

    this.recyclePipe();
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPos.x, this.config.startPos.y, "bird")
      .setOrigin(0);
    // bird.body.velocity.x = 200;
    this.bird.body.gravity.y = 400;
  }

  createPipe() {
    this.pipe = this.physics.add.group();
    for (let i = 0; i < 4; i++) {
      const upperPipe = this.pipe.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipe.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipe.setVelocityX(-this.flapVelocityY);
    // console.log(this.pipe);
    // debugger;
  }

  handleInput() {
    this.input.on("pointerdown", () => {
      this.flap();
    });
    this.input.keyboard.on("keydown-SPACE", () => {
      this.flap();
    });
  }
  checkBirdStatus() {
    if (
      this.bird.y > this.config.height ||
      this.bird.y < -this.bird.height / 2
    ) {
      this.restartGame();
    }
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostPipe();
    const pipHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );
    const pipVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistanceRange
    );
    const pipVerticalPos = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipVerticalDistance
    );

    uPipe.x = rightMostX + pipHorizontalDistance;
    uPipe.y = pipVerticalPos;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipVerticalDistance;
  }

  getRightMostPipe() {
    let rightMoxtx = 0;
    this.pipe.getChildren().forEach(function (pipe) {
      rightMoxtx = Math.max(pipe.x, rightMoxtx);
    });

    return rightMoxtx;
  }

  recyclePipe() {
    const tmpPipes = [];
    this.pipe.getChildren().forEach((ch) => {
      if (ch.getBounds().right < 0) {
        tmpPipes.push(ch);
        if (tmpPipes.length == 2) {
          this.placePipe(...tmpPipes);
        }
      }
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocityY;
  }

  restartGame() {
    this.bird.x = this.config.startPos.x;
    this.bird.y = this.config.startPos.y;
    this.bird.body.velocity.y = 0;
  }
}
