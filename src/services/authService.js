import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const authClient = axios.create({
  baseURL: API_BASE_URL,
});

export async function login(payload) {
  window.location.href = `${API_BASE_URL}/api/auth/github`
  return response.data;
}

export async function preRegisterUser(payload) {
  const response = await authClient.post("/auth/pre-register", payload);
  return response.data;
}

export async function verifyInvitation(payload) {
  const response = await authClient.post("/auth/verify/invitation", payload);
  return response.data;
}

export async function completeRegistration(payload) {
  const response = await authClient.post("/auth/complete/registration", payload);
  return response.data;
}

export async function requestPasswordReset(payload) {
  const response = await authClient.post("/auth/forgot/password", payload);
  return response.data;
}

export async function resendPasswordReset(payload) {
  const response = await authClient.post("/auth/forgot/password", payload);
  return response.data;
}

export async function resetPassword(payload) {
  const response = await authClient.post("/auth/reset/password", payload);
  return response.data;
}

export async function logoutUser(token) {
  const response = await authClient.post(
    "/auth/logout",
    {},
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    }
  );
  return response.data;
}
