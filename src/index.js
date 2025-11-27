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
//
function create() {
  let sky = this.add.image(config.width / 2, config.height * 0.5, "sky");
  sky.setOrigin(0.5, 0.5);

  bird = this.physics.add
    .sprite(config.width / 3, config.height / 4, "bird")
    .setOrigin(0);

  bird.body.velocity.x = 200;
  // bird.body.gravity.y = 100;
  // debugger
}

function update(time, delta) {
  // console.log("hello");
  if (bird.x > config.width - bird.width) {
    bird.body.velocity.x = -200;
  } else if (bird.x < 0) {
    bird.body.velocity.x = 200;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Phaser.Game({ ...config, parent: "game-container" });
});
