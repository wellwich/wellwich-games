import { render } from 'hono/jsx/dom';
import games from '../../game-info';
import { waitForElement } from '../../util';
import GameList from './GameList';

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
