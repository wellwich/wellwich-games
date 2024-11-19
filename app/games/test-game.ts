import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  preload() {}

  create() {}
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: "テストゲーム",
  width: 800,
  height: 600,
  scale: {
    parent: "app",
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
};

export default function initPhaserGame(parent: HTMLElement) {
  if (config.scale) {
    config.scale.parent = parent;
    config.scale.fullscreenTarget = parent;
  }
  return new Phaser.Game(config);
}
