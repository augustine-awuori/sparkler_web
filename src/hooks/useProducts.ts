import { toast } from "react-toastify";

import api from "../services/products";
import useUser from "./useUser";

interface OtherAccounts {
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  youtube?: string;
}

interface User {
  _id: string;
  aboutMe?: string;
  expoPushToken?: string;
  avatar?: string;
  chatToken?: string;
  feedToken?: string;
  email: string;
  chatIds?: { [email: string]: string };
  isAdmin: boolean;
  isVerified: boolean;
  name: string;
  otherAccounts?: OtherAccounts;
  pushTokens?: { [token: string]: string };
  timestamp: number;
}

type NewShopTypes = {
  [id: string]: string;
};

type Common = {
  location: string;
  name: string;
};

type ShopBase = {
  _id: string;
  deliveryInfo?: string;
  feedToken: string;
  image: string;
  isVerified: boolean;
  types: NewShopTypes;
  views: number;
};

interface ProductShop extends Common, ShopBase {
  author: string;
}

interface Item {
  _id: string;
  icon?: React.JSX.Element;
  label: string;
  onClick?: () => void;
  rightIcon?: React.JSX.Element;
  route?: string;
}

export interface ProductType extends Item {}

export interface Product {
  _id: string;
  activityId?: string;
  author: User;
  description: string;
  images: string[];
  isNegotiable?: boolean;
  name: string;
  price: number;
  shop: ProductShop;
  timestamp: number;
  type: ProductType;
}

export default function useProducts() {
  const { user } = useUser();

  function getUserProducts(email: string): Promise<Product[]> {
    return api.getUserProducts(email);
  }

  async function orderProduct(
    product: Product,
    { message, phoneNumber }: { message: string; phoneNumber: string }
  ) {
    if (!user) return;

    const { email, name, profileImage } = user;
    const res = await api.orderProduct({
      email,
      name,
      phoneNumber,
      productId: product._id,
      profileImage,
      shop: product.shop._id,
      message,
    });

    if (res.ok) toast.success("Order placed successfully!");
    else toast.error("Something failed. Order not placed");
  }

  return { getUserProducts, orderProduct };
}
