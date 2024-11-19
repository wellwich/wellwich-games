function waitForElement(
	container: HTMLElement,
	selector: string,
): Promise<void> {
	return new Promise<void>((resolve) => {
		const observer = new MutationObserver((_mutations, obs) => {
			const element = container.querySelector(selector);
			if (element) {
				obs.disconnect();
				resolve();
			}
		});
		observer.observe(container, { childList: true, subtree: true });
	});
}

export { waitForElement };
