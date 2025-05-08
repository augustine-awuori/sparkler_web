import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useProduct } from "../../hooks";
import Categories from "../Categories";
import CategoryButton from "../CategoryButton";
import LoadingIndicator from "../LoadingIndicator";
import paginate, { shuffleArray } from "../../utils/funcs";
import Pagination from "../Pagination";
import ProductCard from "./ProductCard";
import useProducts, { Product, ProductType } from "../../hooks/useProducts";

interface Props {
  email: string;
}

const allProductType: ProductType = { _id: "", label: "All" };

export default function ProfileProducts({ email }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType>(allProductType);
  const { getUserProducts } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const { setProduct } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    const uniqueProductTypes = (types: ProductType[]): ProductType[] => {
      const ids = new Set<string>();
      const result: ProductType[] = [allProductType];

      types.forEach((type) => {
        if (!ids.has(type._id)) {
          ids.add(type._id);
          result.push(type);
        }
      });

      return result;
    };

    const initProducts = async () => {
      setLoading(true);
      const products = await getUserProducts(email);
      setLoading(false);

      setProducts(products);
      setProductTypes(uniqueProductTypes(products.map((p) => p.type)));
    };

    initProducts();
  }, [email]);

  const handleProductClick = (product: Product) => {
    setProduct(product);
    navigate(`products/${product._id}`);
  };

  const filtered = selectedProductType?._id
    ? products.filter((p) => p.type._id === selectedProductType._id)
    : products;

  const paginated = paginate<Product>(filtered, currentPage, pageSize);

  return (
    <>
      {productTypes.length > 1 && (
        <Categories>
          {productTypes.map((type) => (
            <CategoryButton
              key={type._id}
              $isActive={selectedProductType._id === type._id}
              onClick={() => setSelectedProductType(type)}
            >
              {type.label}
            </CategoryButton>
          ))}
        </Categories>
      )}

      {loading && <LoadingIndicator />}

      <ProductGrid>
        {shuffleArray(paginated).map((product) => (
          <ProductCard
            product={product}
            onClick={() => handleProductClick(product)}
            key={product._id}
          />
        ))}
      </ProductGrid>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        totalItems={filtered.length}
      />
    </>
  );
}

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;
