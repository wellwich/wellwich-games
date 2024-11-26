import { createRoute } from 'honox/factory';
import Header from '../components/Header';
import GameList from '../islands/GameList/GameList';

export default createRoute((c) => {
	const name = 'wellwich Games';
	return c.render(
		<div>
			<Header />
			<div class="max-w-lg mx-auto">
				<p class="p-4">
					このサイトは、wellwichが作成したゲームを公開しているサイトです。
				</p>
				<GameList />
			</div>
		</div>,
		{ title: name },
	);
});
