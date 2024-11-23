// src/phaserGame.ts
import Phaser from 'phaser';

const GAME_CONFIG = {
	DEFAULT_WIDTH: 1280,
	DEFAULT_HEIGHT: 960,
	DEFAULT_FONT: {
		fontFamily: 'The Strong Gamer',
		fontSize: '128px',
		color: '#ffffff',
	} as Phaser.Types.GameObjects.Text.TextStyle,
	MONO_FONT: {
		fontFamily: 'monospace',
		fontSize: '64px',
		color: '#ffffff',
	} as Phaser.Types.GameObjects.Text.TextStyle,
	CARD_FONT: {
		fontFamily: 'monospace',
		fontSize: '48px',
		color: '#000000',
	} as Phaser.Types.GameObjects.Text.TextStyle,
};

class TitleScene extends Phaser.Scene {
	constructor() {
		super('titleScene');
	}
	create() {
		const background = this.add.rectangle(
			0,
			0,
			GAME_CONFIG.DEFAULT_WIDTH,
			GAME_CONFIG.DEFAULT_HEIGHT,
			0x444444,
			0.5,
		);
		background.setOrigin(0, 0);
		background.setInteractive();
		const fullScreen = this.add
			.text(GAME_CONFIG.DEFAULT_WIDTH - 16, 16, 'Full Screen', {
				fontSize: '32px',
				fontFamily: 'The Strong Gamer',
			})
			.setOrigin(1, 0);
		fullScreen.setInteractive();
		fullScreen.on('pointerup', () => {
			if (this.scale.isFullscreen) {
				this.scale.stopFullscreen();
			} else {
				this.scale.startFullscreen();
			}
		});
		const title = this.add
			.text(
				GAME_CONFIG.DEFAULT_WIDTH / 2,
				GAME_CONFIG.DEFAULT_HEIGHT / 2 - 50,
				'8パズル',
				{ fontSize: '96px', fontFamily: 'monospace' },
			)
			.setOrigin(0.5, 0.5);
		const start = this.add
			.text(
				GAME_CONFIG.DEFAULT_WIDTH / 2,
				GAME_CONFIG.DEFAULT_HEIGHT / 2 + 100,
				'Tap to start',
				{ fontSize: '64px', fontFamily: 'The Strong Gamer' },
			)
			.setOrigin(0.5, 0.5)
			.setFontSize(32);
		// 画面のどこかをタップしたらゲーム画面へ
		background.on('pointerup', () => {
			this.scene.start('gameScene', {
				level: 1,
				visibleTime: 3000,
				missCount: 0,
			});
		});
		if (window.matchMedia?.('(max-device-width: 640px)').matches) {
			const background = this.add.rectangle(
				0,
				0,
				GAME_CONFIG.DEFAULT_WIDTH,
				GAME_CONFIG.DEFAULT_HEIGHT,
				0x444444,
			);
			background.setInteractive();
			background.setOrigin(0, 0);
			this.add
				.text(
					GAME_CONFIG.DEFAULT_WIDTH / 2,
					GAME_CONFIG.DEFAULT_HEIGHT / 2,
					'横画面にしてください',
					GAME_CONFIG.DEFAULT_FONT,
				)
				.setFontSize(32)
				.setOrigin(0.5);
			const fixScreen = this.add
				.text(
					GAME_CONFIG.DEFAULT_WIDTH / 2,
					GAME_CONFIG.DEFAULT_HEIGHT / 2 + 150,
					'横画面にしたらここをタップ',
					GAME_CONFIG.DEFAULT_FONT,
				)
				.setFontSize(32)
				.setOrigin(0.5);
			fixScreen.setInteractive();
			fixScreen.on('pointerup', () => {
				this.scale.startFullscreen();
				this.scene.start('titleScene');
			});
		}
	}
}

class GameScene extends Phaser.Scene {
	private tiles!: (Phaser.GameObjects.Image | null)[][];
	private correctTiles!: (Phaser.GameObjects.Image | null)[][];

	private gameWidth = GAME_CONFIG.DEFAULT_WIDTH;
	private gameHeight = GAME_CONFIG.DEFAULT_HEIGHT;

	private clearCount = 0;
	private clearCountText!: Phaser.GameObjects.Text;

	private timer = 60;
	private timeText!: Phaser.GameObjects.Text;

	private isShuffling = false;

	init(data: { clearCount: number; timer: number }) {
		if (data.clearCount) {
			this.clearCount = data.clearCount || 0;
		}
		if (data.timer) {
			this.timer = data.timer || 60;
		}
	}

	constructor() {
		super({ key: 'gameScene' });
	}

	preload() {
		const graphics = this.add.graphics();
		graphics.fillStyle(0x6666ff);
		graphics.fillRect(0, 0, 200, 200);
		graphics.lineStyle(4, 0x000000);
		graphics.strokeRect(0, 0, 200, 200);

		for (let i = 1; i <= 8; i++) {
			if (this.textures.exists(`tile${i}`)) {
				continue;
			}

			const number = this.add
				.text(100, 90, i.toString(), {
					color: '#000000',
					fontFamily: GAME_CONFIG.DEFAULT_FONT.fontFamily,
					fontSize: 100,
				})
				.setOrigin(0.5);
			const renderTexture = this.add.renderTexture(0, 0, 200, 200);
			renderTexture.draw(graphics);
			renderTexture.draw(number);
			renderTexture.saveTexture(`tile${i}`);
			renderTexture.destroy();
			number.destroy();
		}

		graphics.destroy();
	}

	create() {
		this.timeText = this.add.text(10, 10, `Time: ${this.timer}`, {
			color: '#ffffff',
			fontFamily: GAME_CONFIG.DEFAULT_FONT.fontFamily,
			fontSize: 30,
		});
		this.timeText.setOrigin(0, 0);
		this.timeText.setScrollFactor(0);
		this.timeText.setDepth(1);
		this.timeText.setInteractive();
		this.timeText.on('pointerdown', () => {
			this.scene.start('gameScene', { clearCount: 0, timer: 60 });
		});

		this.clearCountText = this.add.text(10, 50, `Clear: ${this.clearCount}`, {
			color: '#ffffff',
			fontFamily: GAME_CONFIG.DEFAULT_FONT.fontFamily,
			fontSize: 30,
		});
		this.clearCountText.setOrigin(0, 0);
		this.clearCountText.setScrollFactor(0);
		this.clearCountText.setDepth(1);

		this.time.addEvent({
			delay: 1000,
			callback: () => {
				this.timer--;
				this.timeText.setText(`Time: ${this.timer}`);
				if (this.timer <= 0) {
					this.clearCount = 0; // 追加
					this.scene.start('gameScene', {
						clearCount: this.clearCount,
						timer: 60,
					});
				}
			},
			loop: true,
		});

		const tiles: (Phaser.GameObjects.Image | null)[][] = [];
		const correctTiles: Array<Array<Phaser.GameObjects.Image | null>> = [];
		const offsetX = this.gameWidth / 2 - 200;
		const offsetY = this.gameHeight / 2 - 200;
		for (let i = 0; i < 3; i++) {
			tiles[i] = [];
			correctTiles[i] = [];
			for (let j = 0; j < 3; j++) {
				if (i === 2 && j === 2) {
					tiles[i].push(null);
					correctTiles[i].push(null);
				} else {
					const tile = this.add
						.image(offsetX + 200 * i, offsetY + 200 * j, `tile${i + j * 3 + 1}`)
						.setInteractive()
						.setOrigin(0.5);
					tiles[i].push(tile);
					correctTiles[i].push(tile);
				}
			}
		}
		tiles[2][2] = null;
		correctTiles[2][2] = null;
		this.tiles = tiles;
		this.correctTiles = correctTiles;
		this.shuffleTiles();
		this.input.on(
			'gameobjectdown',
			(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
				const tile = gameObject;
				const x = Math.floor((tile.x - offsetX) / 200);
				const y = Math.floor((tile.y - offsetY) / 200);
				if (this.canMoveTile(x, y)) {
					this.moveTile(x, y);
				}
			},
		);
	}

	moveTile(x: number, y: number) {
		const emptyTile = this.findEmptyTile();
		this.tiles[emptyTile.x][emptyTile.y] = this.tiles[x][y];
		this.tiles[x][y] = null;
		this.tweens.add({
			targets: this.tiles[emptyTile.x][emptyTile.y],
			x: emptyTile.x * 200 + this.gameWidth / 2 - 200,
			y: emptyTile.y * 200 + this.gameHeight / 2 - 200,
			duration: 100,
		});
		this.checkWin();
	}

	canMoveTile(x: number, y: number) {
		const emptyTile = this.findEmptyTile();
		return (
			(x === emptyTile.x && Math.abs(y - emptyTile.y) === 1) ||
			(y === emptyTile.y && Math.abs(x - emptyTile.x) === 1)
		);
	}

	findEmptyTile() {
		for (let i = 0; i < this.tiles.length; i++) {
			for (let j = 0; j < this.tiles[i].length; j++) {
				if (this.tiles[i][j] == null) {
					return { x: i, y: j };
				}
			}
		}
		return { x: -1, y: -1 };
	}

	checkWin() {
		if (this.isShuffling) {
			return;
		}
		for (let i = 0; i < this.tiles.length; i++) {
			for (let j = 0; j < this.tiles[i].length; j++) {
				if (this.tiles[i][j] !== this.correctTiles[i][j]) {
					return;
				}
			}
		}
		this.clearCount++;
		this.scene.start('gameScene', {
			clearCount: this.clearCount,
			timer: 60 - this.clearCount,
		});
	}

	shuffleTiles() {
		this.isShuffling = true;
		const directions = [
			{ x: -1, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: -1 },
			{ x: 0, y: 1 },
		];

		for (let i = 0; i < 1000; i++) {
			const emptyTile = this.findEmptyTile();
			const validDirections = directions.filter((direction) =>
				this.isValidTile(emptyTile.x + direction.x, emptyTile.y + direction.y),
			);
			if (validDirections.length === 0) {
				break;
			}
			const direction = Phaser.Utils.Array.GetRandom(validDirections);
			this.moveTile(emptyTile.x + direction.x, emptyTile.y + direction.y);
		}
		this.isShuffling = false;
	}

	isValidTile(x: number, y: number) {
		return x >= 0 && x < 3 && y >= 0 && y < 3;
	}

	update(time: number, delta: number) {}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	title: '8パズル',
	width: GAME_CONFIG.DEFAULT_WIDTH,
	height: GAME_CONFIG.DEFAULT_HEIGHT,
	scene: [TitleScene, GameScene],
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.FIT,
		fullscreenTarget: 'phaser-game',
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		zoom: Phaser.Scale.MAX_ZOOM,
	},
};

export default function initPhaserGame(parent: HTMLElement) {
	if (config.scale) {
		config.scale.parent = parent;
		config.scale.fullscreenTarget = parent;
	}
	return new Phaser.Game(config);
}
