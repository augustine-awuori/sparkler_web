import { createContext } from "react";

import { Product } from "../hooks/useProducts";

type Value = {
  product: Product | undefined;
  setProduct: (product: Product) => void;
};

const ProductContext = createContext<Value>({
  product: undefined,
  setProduct: () => {},
});

export default ProductContext;
