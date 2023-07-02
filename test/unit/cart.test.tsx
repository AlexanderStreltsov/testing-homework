import React from "react";

import {
  render,
  waitFor,
  screen,
  getByText,
  getAllByText,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import { LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { type CartState } from "../../src/common/types";
import { productDetail } from "./mock/product-detail";
import { App } from "./utils/app";

it("Если корзина пустая, должна отображаться ссылка на каталог товаров", async () => {
  render(<App initialEntries={["/cart"]} />);
  const page = await waitFor(() => screen.findByTestId("check-page"));
  expect(getByText(page, "catalog").closest("a")).toBeInTheDocument();
});

describe("Проверка корзины магазина", () => {
  beforeEach(() => {
    const cart: CartState = {};
    cart[productDetail.id] = {
      name: productDetail.name,
      count: 10,
      price: productDetail.price,
    };
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  });

  it("Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", async () => {
    render(<App initialEntries={["/cart"]} />);
    const page = await waitFor(() => screen.findByTestId("check-page"));

    expect(
      getByText(page, productDetail.name).closest("td")
    ).toBeInTheDocument();

    expect(getByText(page, 10).closest("td")).toBeInTheDocument();

    expect(
      getByText(page, `$${productDetail.price}`).closest("td")
    ).toBeInTheDocument();

    const total = await waitFor(() =>
      getAllByText(page, `$${productDetail.price * 10}`)
    );

    total.forEach((element) =>
      expect(
        getByText(element, `$${productDetail.price * 10}`)
      ).toBeInTheDocument()
    );
  });

  it("В корзине должна быть кнопка 'Очистить корзину', по нажатию на которую все товары должны удаляться", async () => {
    render(<App initialEntries={["/cart"]} />);

    const page = await waitFor(() => screen.findByTestId("check-page"));
    expect(getByText(page, "Order price:").closest("td")).toBeInTheDocument();

    const button = await waitFor(() => screen.findByTestId("clear-cart"));
    button.click();
    expect(getByText(page, "catalog").closest("a")).toBeInTheDocument();
  });
});
