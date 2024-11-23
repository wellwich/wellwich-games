import Phaser from 'phaser';

const GAME_CONFIG = {
	DEFAULT_WIDTH: 640,
	DEFAULT_HEIGHT: 480,
	DEFAULT_FONT: {
		fontFamily: 'The Strong Gamer',
		fontSize: '128px',
		color: '#ffffff',
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
				fontSize: '16px',
				fontFamily: '"font"',
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
				'カラータイル',
				{ fontSize: '64px', color: '#fff', fontFamily: 'monospace' },
			)
			.setOrigin(0.5, 0.5);
		const start = this.add
			.text(
				GAME_CONFIG.DEFAULT_WIDTH / 2,
				GAME_CONFIG.DEFAULT_HEIGHT / 2 + 100,
				'Tap to start',
				{ fontSize: '16px', fontFamily: '"font"' },
			)
			.setOrigin(0.5, 0.5);
		// 画面のどこかをタップしたらゲーム画面へ
		background.on('pointerup', () => {
			this.scene.start('gameScene');
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
				this.scene.start('titleScene');
			});
		}
	}
}

class GameScene extends Phaser.Scene {
	constructor() {
		super('gameScene');
	}

	private blankTileColor = 0x999999;
	private redTileColor = 0xff0000;
	private greenTileColor = 0x00ff00;
	private blueTileColor = 0x00c9e8;
	private yellowTileColor = 0xeeee00;
	private purpleTileColor = 0x800080;
	private pinkTileColor = 0xff44ff;
	private colorArray: number[] = [
		this.redTileColor,
		this.greenTileColor,
		this.blueTileColor,
		this.yellowTileColor,
		this.purpleTileColor,
		this.pinkTileColor,
		this.blankTileColor,
	];
	private tiles!: Phaser.GameObjects.Group;

	preload() {
		this.load.audio('miss', 'https://assets.wellwich.com/sounds/miss.mp3');
		this.load.audio(
			'correct',
			'https://assets.wellwich.com/sounds/correct.mp3',
		);
	}

	create() {
		// ズームレベルを2に設定
		this.cameras.main.setBackgroundColor(0x999999);

		let score = 0;
		const scoreText = this.add
			.text(8, 8, `${score}`, {
				fontSize: '32px',
				fontFamily: GAME_CONFIG.DEFAULT_FONT.fontFamily,
				color: '#ffffff',
			})
			.setDepth(1);

		const missSound = this.sound.add('miss');
		const correctSound = this.sound.add('correct');

		// 空白ありでタイルcolorArray内の色でマス目状にランダムに配置
		this.tiles = this.add.group();
		const tileSize = 26;
		const tileSpacing = 2;
		const tileWidth = tileSize + tileSpacing;
		const tileHeight = tileSize + tileSpacing;
		const rows = 13;
		const cols = 20;
		// タイル全体のサイズを計算
		const totalWidth = cols * tileWidth; // 最後のスペーシングは不要
		const totalHeight = rows * tileHeight; // 最後のスペーシングは不要
		// タイルグループの開始位置を計算
		const startX = (GAME_CONFIG.DEFAULT_WIDTH - totalWidth) / 2;
		const startY = (GAME_CONFIG.DEFAULT_HEIGHT - totalHeight) / 2 + 8;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const tile = this.add.rectangle(
					startX + j * tileWidth,
					startY + i * tileHeight,
					tileSize,
					tileSize,
					Phaser.Math.RND.pick(this.colorArray),
				);
				tile.setData('color', tile.fillColor);
				tile.setData('row', i);
				tile.setData('col', j);
				tile.setInteractive();
				tile.on('pointerup', () => {
					// タップされた空白のタイルの行と列を取得
					if (tile.getData('color') === this.blankTileColor) {
						const row = tile.getData('row');
						const col = tile.getData('col');
						// 上下左右のタイルを取得
						const tileUp = this.getTileToMove(row, col, -1, 0);
						const tileDown = this.getTileToMove(row, col, 1, 0);
						const tileLeft = this.getTileToMove(row, col, 0, -1);
						const tileRight = this.getTileToMove(row, col, 0, 1);
						// 上下左右の組み合わせ全パターンをチェックして、同じ色のタイルがあれば空白のタイルと入れ替え
						const deletableTiles: Phaser.GameObjects.Rectangle[] = [];
						if (tileUp) {
							if (tileDown) {
								if (tileUp.getData('color') === tileDown.getData('color')) {
									deletableTiles.push(tileUp, tileDown);
								}
							}
							if (tileLeft) {
								if (tileUp.getData('color') === tileLeft.getData('color')) {
									deletableTiles.push(tileUp, tileLeft);
								}
							}
							if (tileRight) {
								if (tileUp.getData('color') === tileRight.getData('color')) {
									deletableTiles.push(tileUp, tileRight);
								}
							}
						}
						if (tileDown) {
							if (tileLeft) {
								if (tileDown.getData('color') === tileLeft.getData('color')) {
									deletableTiles.push(tileDown, tileLeft);
								}
							}
							if (tileRight) {
								if (tileDown.getData('color') === tileRight.getData('color')) {
									deletableTiles.push(tileDown, tileRight);
								}
							}
						}
						if (tileLeft && tileRight) {
							if (tileLeft.getData('color') === tileRight.getData('color')) {
								deletableTiles.push(tileLeft, tileRight);
							}
						}
						if (deletableTiles.length > 0) {
							for (const t of deletableTiles) {
								t.setData('color', this.blankTileColor);
								t.fillColor = this.blankTileColor;
							}
						}
						if (deletableTiles.length > 0) {
							score += 100;
							scoreText.setText(`${score}`);
							correctSound.play();
						} else {
							score -= 100;
							scoreText.setText(`${score}`);
							missSound.play();
						}
					}
				});
				this.tiles.add(tile);
			}
		}
		this.tiles.setOrigin(0, 0);
	}

	// 空白のみ進める直線状で最初にぶつかる空白じゃないタイルを取得
	private getTileToMove(
		row: number,
		col: number,
		rowDir: number,
		colDir: number,
	): Phaser.GameObjects.Rectangle | null {
		let currentRow = row + rowDir;
		let currentCol = col + colDir;
		while (
			currentRow >= 0 &&
			currentRow < 13 &&
			currentCol >= 0 &&
			currentCol < 20
		) {
			const tile = this.tiles
				.getChildren()
				.find(
					(t: Phaser.GameObjects.GameObject) =>
						t.getData('row') === currentRow && t.getData('col') === currentCol,
				) as Phaser.GameObjects.Rectangle;
			if (tile.getData('color') !== this.blankTileColor) {
				return tile;
			}
			currentRow += rowDir;
			currentCol += colDir;
		}
		return null;
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	title: 'カラータイル',
	width: GAME_CONFIG.DEFAULT_WIDTH,
	height: GAME_CONFIG.DEFAULT_HEIGHT,
	scene: [TitleScene, GameScene],
	render: {
		pixelArt: true,
	},
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
