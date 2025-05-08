import { useContext } from "react";

import { ProductContext } from "../contexts";

export default function useProduct() {
  return useContext(ProductContext);
}
