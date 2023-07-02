import React, { FC } from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { type LocationDescriptor } from "history";

import { Application } from "../../../src/client/Application";
import { CartApi } from "../../../src/client/api";
import { initStore } from "../../../src/client/store";
import { MockExampleApi } from "../mock/example-api";

interface IApp {
  initialEntries: LocationDescriptor<unknown>[];
  initialStore?: ReturnType<typeof initStore>;
}

export const App: FC<IApp> = ({ initialStore, initialEntries }) => {
  const api = new MockExampleApi("");
  const cart = new CartApi();

  const store = initialStore || initStore(api, cart);

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );
};
