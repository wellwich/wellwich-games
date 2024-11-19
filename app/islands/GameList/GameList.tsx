import { useEffect, useState } from 'hono/jsx';
import games from '../../game-info';

const GameList = () => {
	const [gameList, setGameList] = useState<
		{ name: string; path: string; description: string; image: string }[]
	>([]);

	useEffect(() => {
		setGameList(games);
	}, []);

	return (
		<ul class="grid grid-cols-2 gap-4">
			{gameList.map((game) => (
				<li key={game.name} class="m-4 hover:bg-gray-200">
					<a href={`/games/${game.path}`}>
						<div class="p-4 border-solid border-2 border-gray-400 h-64">
							<img
								src={game.image}
								alt={game.name}
								class="w-full h-32 object-cover border-solid border-2 border-gray-400"
							/>
							<h4 class="text-xl font-bold">{game.name}</h4>
							<p class="overflow-hidden text-ellipsis line-clamp-3">
								{game.description}
							</p>
						</div>
					</a>
				</li>
			))}
		</ul>
	);
};

export default GameList;
