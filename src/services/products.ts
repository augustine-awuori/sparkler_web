import axios from "axios";

import { Product } from "../hooks/useProducts";
import { getFailedResponse, processResponse } from "./client";

const endpoint = "/products";

const apiClient = axios.create({
  // baseURL: "https://amazing-api-production.up.railway.app/api",
  baseURL: "https://amazing-api.onrender.com/api",
});

const getUserProducts = async (email: string): Promise<Product[]> => {
  try {
    const res = processResponse(
      await apiClient.get(`${endpoint}/user/${email}`)
    );
    return res.ok ? (res.data as Product[]) : [];
  } catch (error) {
    return [];
  }
};

type NewOrder = {
  productId: string;
  name: string;
  email: string;
  profileImage: string;
  phoneNumber: string;
  shop: string;
  message: string;
};

const orderProduct = async (order: NewOrder) => {
  try {
    return processResponse(await apiClient.post(`/orders/sparkler`, order));
  } catch (error) {
    return getFailedResponse(error);
  }
};

export default { getUserProducts, orderProduct };
