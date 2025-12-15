import api from "./api";

export const resourceService = {
  getAllResources: async () => {
    return await api.get("/resources");
  },

  downloadResource: async (id) => {
    return await api.get(`/resources/download/${id}`);
  },
};
