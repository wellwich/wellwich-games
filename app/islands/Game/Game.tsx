import { useEffect, useRef, useState } from 'hono/jsx';

const Game = ({ name }: { name: string }) => {
	const gameArea = useRef<HTMLDivElement>(null);
	const [gameTitle, setGameTitle] = useState('Game');
	let phaserInstance: Phaser.Game | null = null;

	useEffect(() => {
		const gameAreaElement = gameArea.current;
		if (!gameAreaElement) {
			console.error('gameAreaElement is null');
			return;
		}

		const makeGame = async () => {
			try {
				const phaser = await import(`../../games/${name}.ts`);
				phaserInstance = phaser.default(gameAreaElement);
				if (!phaserInstance) {
					console.error('phaserInstance is null');
					return;
				}
				setGameTitle(phaserInstance.config.gameTitle);

				const canvas = gameAreaElement.querySelector('canvas');
				if (canvas) {
					canvas.addEventListener('contextmenu', (e) => e.preventDefault());
				} else {
					console.error('Canvas element not found');
				}
			} catch (error) {
				console.error('Error loading Phaser game:', error);
			}
		};

		makeGame();

		return () => {
			if (phaserInstance) {
				phaserInstance.destroy(true);
				phaserInstance = null;
			}

			const canvas = gameAreaElement.querySelector('canvas');
			if (canvas) {
				canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
			}
		};
	}, [name]);

	return (
		<div>
			<h2 class="text-2xl font-bold">{gameTitle}</h2>
			<div ref={gameArea} />
		</div>
	);
};

export default Game;
