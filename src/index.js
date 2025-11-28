import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    // Arcade physics plugin, manages physics simulation
    default: "arcade",
    arcade: {
      debug: true,
      // gravity: { y: 200 },
    },
  },

  scene: {
    preload,
    create,
    update,
  },
};

let bird = null;
let upperPipe = null;
let lowerPipe = null;
const flapVelocityY = 200;
const initalPos = { x: config.width * 0.1, y: config.height / 2 };

let pipHorizontalDistance = 10;
const pipeVerticalDistanceRange = [150, 250];

// load assets, such as images, music, animations ...
function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

//
function create() {
  this.add.image(0, 0, "sky").setOrigin(0);

  bird = this.physics.add.sprite(initalPos.x, initalPos.y, "bird").setOrigin(0);
  // bird.body.velocity.x = 200;
  bird.body.gravity.y = 400;
  // debugger

  for (let i = 0; i < 4; i++) {
    upperPipe = this.physics.add.image(0, 0, "pipe").setOrigin(0, 1);
    lowerPipe = this.physics.add.image(400, 0, "pipe").setOrigin(0, 0);
    placePipe(upperPipe, lowerPipe);
  }

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown-SPACE", flap);
}

function update(time, delta) {
  // console.log("hello");
  // if (bird.x > config.width - bird.width) {
  //   bird.body.velocity.x = -200;
  // } else if (bird.x < 0) {
  //   bird.body.velocity.x = 200;
  // }
  if (bird.y > config.height || bird.y < -bird.height / 2) {
    restartGame();
  }
}

function placePipe(uPipe, lPipe) {
  pipHorizontalDistance += 400;
  const pipVerticalDistance = Phaser.Math.Between(
    pipeVerticalDistanceRange[0],
    pipeVerticalDistanceRange[1]
  );
  const pipVerticalPos = Phaser.Math.Between(
    20,
    config.height - 20 - pipVerticalDistance
  );

  uPipe.x = pipHorizontalDistance;
  uPipe.y = pipVerticalPos;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipVerticalDistance;

  lPipe.body.velocity.x = -200;
  uPipe.body.velocity.x = -200;
}

function flap() {
  bird.body.velocity.y = -flapVelocityY;
}

function restartGame() {
  bird.x = initalPos.x;
  bird.y = initalPos.y;
  bird.body.velocity.y = 0;
}

document.addEventListener("DOMContentLoaded", () => {
  new Phaser.Game({ ...config, parent: "game-container" });
});
