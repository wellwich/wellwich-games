import { render } from "hono/jsx/dom";
import Game from "./Game";

describe("ゲームコンポーネント", () => {
  it("レンダリングされるべき", async () => {
    const container = document.createElement("div");
    render(<Game name="test-game" />, container);

    // 非同期処理が完了するのを待つ
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(container).toMatchSnapshot();
  });

  it("タイトルが正常に表示されるべき", async () => {
    const container = document.createElement("div");
    render(<Game name="test-game" />, container);

    // 非同期処理が完了するのを待つ
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const title = container.querySelector("h2");
    expect(title?.textContent).toBe("テストゲーム");
  });
});
