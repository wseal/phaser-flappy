import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("back", "assets/back.png");
    // this.load.image("upArrow", "assets/up-arrow.png");
    // this.load.image("downArrow", "assets/down-arrow.png");
  }

  create() {
    console.log("PreloadScene: create");
    this.anims.create({
      key: "flyy",
      frames: this.anims.generateFrameNumbers("bird", { start: 9, end: 15 }),
      // 24 fps default, it will play animation consisting of 24 frames in 1 second
      // in case of framerate 2 and sprite of 8 frames animations will play in
      // 4 sec; 8 / 2 = 4
      frameRate: 8,
      // repeat infinitely
      repeat: -1,
    });
    this.scene.start("MenuScene");
  }
}

export default PreloadScene;
