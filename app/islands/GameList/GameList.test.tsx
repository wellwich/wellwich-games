import { render } from 'hono/jsx/dom';
import games from '../../game-info';
import GameList from './GameList';
import { waitForElement } from '../../util';

describe('ゲームリストコンポーネント', () => {
	it('レンダリングされるべき', async () => {
		const container = document.createElement('div');
		render(<GameList />, container);

		await waitForElement(container, 'ul');

		expect(container).toMatchSnapshot();
	});

	it('ゲームリストが正常に表示されるべき', async () => {
		const container = document.createElement('div');
		render(<GameList />, container);

		await waitForElement(container, 'li');

		const gameList = container.querySelectorAll('li');
		expect(gameList.length).toBe(games.length);
	});
});
