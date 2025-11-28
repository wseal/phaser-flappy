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
let pipe = null;

const flapVelocityY = 200;
const initalPos = { x: config.width * 0.1, y: config.height / 2 };

const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [400, 450];

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

  pipe = this.physics.add.group();
  // pipe.velocity.x = -200;

  for (let i = 0; i < 4; i++) {
    const upperPipe = pipe.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipe.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipe.setVelocityX(-200);
  console.log(pipe);
  // debugger;

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

  recyclePipe();
}

function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  const pipHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );
  const pipVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipVerticalPos = Phaser.Math.Between(
    20,
    config.height - 20 - pipVerticalDistance
  );

  uPipe.x = rightMostX + pipHorizontalDistance;
  uPipe.y = pipVerticalPos;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipVerticalDistance;

  // lPipe.body.velocity.x = -200;
  // uPipe.body.velocity.x = -200;
}

function getRightMostPipe() {
  let rightMoxtx = 0;
  pipe.getChildren().forEach(function (pipe) {
    rightMoxtx = Math.max(pipe.x, rightMoxtx);
  });

  return rightMoxtx;
}

function recyclePipe() {
  const tmpPipes = [];
  pipe.getChildren().forEach((ch) => {
    if (ch.getBounds().right < 0) {
      tmpPipes.push(ch);
      if (tmpPipes.length == 2) {
        placePipe(...tmpPipes);
      }
    }
  });
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
