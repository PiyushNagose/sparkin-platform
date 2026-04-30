import axios from "axios";
import { attachAuthInterceptors } from "@/shared/lib/http/authInterceptors";

export const businessClient = axios.create({
  baseURL: import.meta.env.VITE_BUSINESS_API_BASE_URL || "http://localhost:4002/api/v1",
  timeout: 15000,
});

attachAuthInterceptors(businessClient);
