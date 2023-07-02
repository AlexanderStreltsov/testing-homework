import { type AxiosResponse } from "axios";

import { ExampleApi } from "../../../src/client/api";
import { type ProductShortInfo, type Product } from "../../../src/common/types";
import { catalogProducts } from "./catalog-products";
import { productDetail } from "./product-detail";

export class MockExampleApi extends ExampleApi {
  async getProducts() {
    return Promise.resolve({
      data: catalogProducts,
    }) as Promise<AxiosResponse<ProductShortInfo[]>>;
  }

  async getProductById(id: number) {
    return Promise.resolve({ data: productDetail }) as Promise<
      AxiosResponse<Product>
    >;
  }

  async checkout(form: any, cart: any) {
    return {} as any;
  }
}
