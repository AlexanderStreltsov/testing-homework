import React from "react";

import { render, waitFor, screen, getByText } from "@testing-library/react";
import "@testing-library/jest-dom";

import { CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { type CartState } from "../../src/common/types";
import { MockExampleApi } from "./mock/example-api";
import { App } from "./utils/app";
import { catalogProducts } from "./mock/catalog-products";
import { productDetail } from "./mock/product-detail";

describe("Проверка продуктов в каталоге", () => {
  it("В каталоге должны отображаться товары, список которых приходит с сервера", async () => {
    render(<App initialEntries={["/catalog"]} />);

    const productList = await waitFor(() =>
      screen.findAllByTestId(/catalog-[0-9]/)
    );

    expect(productList).toHaveLength(catalogProducts.length);
  });

  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    render(<App initialEntries={["/catalog"]} />);

    const productList = await waitFor(() =>
      screen.findAllByTestId(/product-[0-9]/)
    );

    productList.forEach((item, index) => {
      expect(
        getByText(item, catalogProducts[index]["name"]).closest("h5")
      ).toBeInTheDocument();

      expect(
        getByText(
          item,
          new RegExp(`${catalogProducts[index]["price"]}`)
        ).closest("p")
      ).toBeInTheDocument();

      expect(getByText(item, "Details").closest("a")).toHaveAttribute(
        "href",
        `/catalog/${catalogProducts[index]["id"]}`
      );
    });
  });

  it("На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка 'Add to Cart'", async () => {
    render(<App initialEntries={[`/catalog/${productDetail.id}`]} />);

    const product = await waitFor(() =>
      screen.findByTestId(`detail-${productDetail.id}`)
    );

    expect(
      getByText(product, productDetail.name).closest("h1")
    ).toBeInTheDocument();

    expect(
      getByText(product, productDetail.description).closest("p")
    ).toBeInTheDocument();

    expect(
      getByText(product, new RegExp(`${productDetail.price}`)).closest("p")
    ).toBeInTheDocument();

    expect(
      getByText(product, productDetail.color).closest("dd")
    ).toBeInTheDocument();

    expect(
      getByText(product, productDetail.material).closest("dd")
    ).toBeInTheDocument();

    expect(
      getByText(product, "Add to Cart").closest("button")
    ).toBeInTheDocument();
  });
});

describe("Проверка работы в связке каталога и корзины", () => {
  beforeEach(() => {
    const cart: CartState = {};
    cart[productDetail.id] = {
      name: productDetail.name,
      count: 1,
      price: productDetail.price,
    };
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  });

  it("Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async () => {
    render(<App initialEntries={["/catalog"]} />);

    const catalogProduct = await waitFor(() =>
      screen.findByTestId(`product-${productDetail.id}`)
    );
    expect(getByText(catalogProduct, "Item in cart")).toBeInTheDocument();

    getByText(catalogProduct, "Details").closest("a").click();
    const product = await waitFor(() =>
      screen.findByTestId(`detail-${productDetail.id}`)
    );
    expect(getByText(product, "Item in cart")).toBeInTheDocument();
  });

  it("Если товар уже добавлен в корзину, повторное нажатие кнопки 'Add to Cart' должно увеличивать его количество", async () => {
    const store = initStore(new MockExampleApi(""), new CartApi());

    render(
      <App
        initialStore={store}
        initialEntries={[`/catalog/${productDetail.id}`]}
      />
    );

    const product = await waitFor(() =>
      screen.findByTestId(`detail-${productDetail.id}`)
    );
    getByText(product, "Add to Cart").closest("button").click();

    const { cart } = store.getState();

    expect(cart[productDetail.id].count).toEqual(2);
  });
});
