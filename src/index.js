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
      gravity: { y: 200 },
    },
  },

  scene: {
    preload,
    create,
    update,
  },
};

// load assets, such as images, music, animations ...
function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

let bird = null;
const flapVelocityY = 200;
const initalPos = { x: config.width * 0.1, y: config.height / 2 };
//
function create() {
  let sky = this.add.image(initalPos.x, initalPos.y, "sky");
  sky.setOrigin(0.5, 0.5);

  bird = this.physics.add
    .sprite(config.width / 3, config.height / 4, "bird")
    .setOrigin(0);

  // bird.body.velocity.x = 200;
  // bird.body.gravity.y = 100;
  // debugger

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
