import { createRoute } from 'honox/factory';
import Header from '../../components/Header';
import GameList from '../../islands/GameList/GameList';

export default createRoute((c) => {
	const name = c.req.param('name');
	return c.render(
		<div>
			<Header />
			<h2 class="text-4xl font-bold">{name}</h2>
			<div class="max-w-lg mx-auto">
				<GameList />
			</div>
		</div>,
		{ title: name },
	);
});
