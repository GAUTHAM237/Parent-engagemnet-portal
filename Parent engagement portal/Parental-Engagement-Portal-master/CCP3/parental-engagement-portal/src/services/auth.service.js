import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    return await api.post("/auth/register", userData);
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
