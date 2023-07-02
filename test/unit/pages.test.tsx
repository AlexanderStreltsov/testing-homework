import React from "react";

import { render, waitFor, screen, getByText } from "@testing-library/react";
import "@testing-library/jest-dom";

import { App } from "./utils/app";

describe("Проверка страниц магазина", () => {
  it("В магазине должна быть главная страница", async () => {
    render(<App initialEntries={["/"]} />);
    const page = await waitFor(() => screen.findByTestId("check-page"));
    expect(getByText(page, "Welcome to Example store!")).toBeInTheDocument();
  });

  it("В магазине должен быть каталог", async () => {
    render(<App initialEntries={["/catalog"]} />);
    const page = await waitFor(() => screen.findByTestId("check-page"));
    expect(getByText(page, "Catalog")).toBeInTheDocument();
  });

  it("В магазине должна быть страница доставки", async () => {
    render(<App initialEntries={["/delivery"]} />);
    const page = await waitFor(() => screen.findByTestId("check-page"));
    expect(getByText(page, "Delivery")).toBeInTheDocument();
  });

  it("В магазине должна быть страница контактов", async () => {
    render(<App initialEntries={["/contacts"]} />);
    const page = await waitFor(() => screen.findByTestId("check-page"));
    expect(getByText(page, "Contacts")).toBeInTheDocument();
  });
});
