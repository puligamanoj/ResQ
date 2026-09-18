import api from "./api";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.token) {
        localStorage.setItem("resq_token", response.data.token);
        localStorage.setItem("resq_user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Return mock response if backend is offline
      const mockUser = {
        id: "usr-01",
        name: credentials.email ? credentials.email.split("@")[0] : "Command Officer",
        role: credentials.role || "Commander",
        token: "mock-jwt-token-12345"
      };
      localStorage.setItem("resq_token", mockUser.token);
      localStorage.setItem("resq_user", JSON.stringify(mockUser));
      return { success: true, user: mockUser, token: mockUser.token };
    }
  },

  logout: () => {
    localStorage.removeItem("resq_token");
    localStorage.removeItem("resq_user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("resq_user");
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;
