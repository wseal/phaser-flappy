import Phaser from "phaser";
import PlayScene from "./game/scenes/PlayScene";

const WIDTH = 800;
const HEIGHT = 600;
const SHARE = {
  width: WIDTH,
  height: HEIGHT,
  startPos: { x: WIDTH / 5, y: HEIGHT / 2 },
};

const config = {
  type: Phaser.AUTO,
  physics: {
    // Arcade physics plugin, manages physics simulation
    default: "arcade",
    arcade: {
      debug: true,
      // gravity: { y: 200 },
    },
  },
  ...SHARE,

  scene: [new PlayScene(SHARE)],
};

document.addEventListener("DOMContentLoaded", () => {
  new Phaser.Game({ ...config, parent: "game-container" });
});
