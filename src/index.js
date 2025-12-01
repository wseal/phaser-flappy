import Phaser from "phaser";
import PlayScene from "./game/scenes/PlayScene";
import PreloadScene from "./game/scenes/PreloadScene";
import PauseScene from "./game/scenes/PauseScene";
import MenuScene from "./game/scenes/MenuScene";

const WIDTH = 800;
const HEIGHT = 600;
const SHARE = {
  width: WIDTH,
  height: HEIGHT,
  startPos: { x: WIDTH / 5, y: HEIGHT / 2 },
};

const Scenes = [PreloadScene, PauseScene, MenuScene, PlayScene];
const createScene = (Scene) => new Scene(SHARE);
const initScenes = () => Scenes.map(createScene);

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

  scene: initScenes(),
};

document.addEventListener("DOMContentLoaded", () => {
  new Phaser.Game({ ...config, parent: "game-container" });
});
