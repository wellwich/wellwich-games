import honox from 'honox/vite';
import { defineConfig } from 'vite';
import adapter from '@hono/vite-dev-server/cloudflare';
import build from '@hono/vite-build/cloudflare-pages';
import ssg from '@hono/vite-ssg';

const entry = './app/server.ts';

export default defineConfig({
	plugins: [
		honox({
			client: {
				input: ['/app/style.css'],
			},
			devServer: { adapter },
		}),
		build(),
		ssg({
			entry,
		}),
	],
});
