import axios from "axios";
import { attachAuthInterceptors } from "@/shared/lib/http/authInterceptors";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api/v1",
  timeout: 15000,
});

attachAuthInterceptors(httpClient);
