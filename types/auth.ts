export interface LoginPayload {
  email: string;
  password: string;
  totpCode: string;
  captcha?: string;
  pattern: string;
}
