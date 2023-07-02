const { assert } = require("chai");
const { CATALOG_URL } = require("./url");

describe("Проверка каталога", async function () {
  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async function () {
    await this.browser.url(CATALOG_URL);

    for await (const product of this.browser.$$(".ProductItem")) {
      const name = await product.$(".ProductItem-Name").getText();
      const price = await product.$(".ProductItem-Price").getText();
      const details = await product.$(".ProductItem-DetailsLink").getText();

      assert(name !== "", "Нет имени товара");
      assert(price !== "", "Нет цены товара");
      assert(details !== "Нет ссылки на детали товара");
    }
  });

  it("Содержимое корзины должно сохраняться между перезагрузками страницы", async function () {
    await this.browser.url(CATALOG_URL);

    await this.browser.$(".ProductItem-DetailsLink").click();
    await this.browser.$(".ProductDetails-AddToCart").click();

    await this.browser.refresh();

    const navbar = await this.browser.$(".navbar-nav");
    for await (const nav of navbar.$$(".nav-link")) {
      const navText = await nav.getText();
      if (navText.includes("Cart")) {
        assert.include(navText, "1");
      }
    }
  });
});
