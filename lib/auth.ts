export interface LoginPayload {
  email: string;
  password: string;
  totpCode: string;
  pattern: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: {
    _id: string;
    name: string;
    email: string;
  };
}


export const saveToken = (token: string) => {
  localStorage.setItem("admin_token", token);
};

export const getToken = () => {
  return localStorage.getItem("admin_token");
};

export const logout = () => {
  localStorage.removeItem("admin_token");
};