import { createRoute } from "honox/factory";
import Header from "../../../components/Header";
import Game from "../../../islands/Game";
import gameInfoList from "../../../game-info";

export default createRoute((c) => {
  const param = c.req.param("name");
  const game = gameInfoList.find((g) => g.path === param);
  console.log(gameInfoList);
  return c.render(
    <div>
      <Header />
      <Game name={param} />
    </div>,
    { title: game?.name ?? "Game" }
  );
});
