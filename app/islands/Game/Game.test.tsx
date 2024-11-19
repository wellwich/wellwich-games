import Game from './Game';
import { render } from 'hono/jsx/dom';
import { waitForElement } from '../../util';

describe('ゲームコンポーネント', () => {
	it('レンダリングされるべき', async () => {
		const container = document.createElement('div');
		render(<Game name="test-game" />, container);

		await waitForElement(container, 'div');

		expect(container).toMatchSnapshot();
	});

	it('タイトルが正常に表示されるべき', async () => {
		const container = document.createElement('div');
		render(<Game name="test-game" />, container);

		await waitForElement(container, 'h2');

		const title = container.querySelector('h2');
		expect(title?.textContent).toBe('テストゲーム');
	});
});
