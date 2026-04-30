import axios from "axios";
import { attachAuthInterceptors } from "@/shared/lib/http/authInterceptors";

export const fulfillmentClient = axios.create({
  baseURL: import.meta.env.VITE_FULFILLMENT_API_BASE_URL || "http://localhost:4003/api/v1",
  timeout: 15000,
});

attachAuthInterceptors(fulfillmentClient);
