import { type Product } from "../../../src/common/types";
import { catalogProducts } from "./catalog-products";

export const productDetail: Product = {
  ...catalogProducts[0],
  description: "test description",
  color: "test-color",
  material: "test-material",
};
