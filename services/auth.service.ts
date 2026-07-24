import api from "@/lib/axios";
import { LoginPayload } from "@/types/auth";

export const login = async (data: LoginPayload) => {

  const response = await api.post(
    "/admin/api/auth/login",
    data
  );

  return response.data;
};