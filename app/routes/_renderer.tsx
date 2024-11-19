import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { Link } from "honox/server";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <Script src="/app/client.ts" async />
        <Link href="/app/style.css" rel="stylesheet" />
      </head>
      <body class="max-w-4xl mx-auto">{children}</body>
    </html>
  );
});
