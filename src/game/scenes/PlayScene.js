import Phaser from "phaser";

export default class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.config = config;
    console.log(this.config);

    this.bird = null;
    this.pipe = null;

    this.flapVelocityY = 350;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 450];

    this.score = 0;
    this.scoreText = null;
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
    this.createColliders();
    this.createScore();
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
      .setCollideWorldBounds(true)
      .setOrigin(0);
    // bird.body.velocity.x = 200;
    this.bird.body.gravity.y = 600;
  }

  createPipe() {
    this.pipe = this.physics.add.group();
    for (let i = 0; i < 4; i++) {
      const upperPipe = this.pipe
        .create(0, 0, "pipe")
        .setImmovable(true) // 没有碰撞物理特性
        .setOrigin(0, 1);

      const lowerPipe = this.pipe
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipe.setVelocityX(-this.flapVelocityY);
    // console.log(this.pipe);
    // debugger;
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });

    const bestScore = localStorage.getItem("bestScore");
    this.add.text(16, 52, `Best Score: ${bestScore || 0}`, {
      fontSize: "20px",
      fill: "#000",
    });
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipe, () => {
      this.gameOver();
    });
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
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
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
          this.score += 1;
          this.scoreText.setText(`Score: ${this.score}`);
        }
      }
    });
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText ? bestScoreText + 0 : 0;
    if (this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
      //
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.saveBestScore();

    // delay event
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocityY;
  }

  increaseScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
