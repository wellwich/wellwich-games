import { createRoute } from "honox/factory";
import Header from "../components/Header";

export default createRoute((c) => {
  const name = c.req.query("name") ?? "Hono";
  return c.render(
    <div>
      <Header />
    </div>,
    { title: name }
  );
});
