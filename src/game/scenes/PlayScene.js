import Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.bird = null;
    this.pipe = null;
    this.isPaused = false;

    this.flapVelocityY = 350;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 450];

    this.score = 0;
    this.scoreText = null;
  }

  create() {
    super.create();

    this.createBG();
    this.createBird();
    this.createPipe();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInput();
    this.listenToEvents();

    this.bird.play("flyy");
  }

  update(time, delta) {
    this.checkBirdStatus();

    this.recyclePipe();
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          "Fly in: " + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in: " + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPos.x, this.config.startPos.y, "bird")
      .setFlipX(true)
      .setCollideWorldBounds(true)
      .setOrigin(0);
    // bird.body.velocity.x = 200;
    this.bird.body.setSize(this.bird.width, this.bird.height - 8);
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

  createColliders() {
    this.physics.add.collider(this.bird, this.pipe, () => {
      this.gameOver();
    });
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

  createPause() {
    const pauseBtn = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(3)
      .setOrigin(1);

    pauseBtn.setInteractive();
    this.isPaused = false;
    pauseBtn.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation();

      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();

      this.scene.launch("PauseScene");
    });
  }

  handleInput() {
    this.input.on("pointerdown", (pointer, localX, localY, event) => {
      console.log("handle pointerdown clicked");
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
    console.log("flap----------------->", this.isPaused);
    if (this.isPaused) {
      return;
    }

    this.bird.body.velocity.y = -this.flapVelocityY;
  }

  increaseScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
