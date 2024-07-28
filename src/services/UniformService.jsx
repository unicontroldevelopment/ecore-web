import { api } from "./api";

export default class {
  async create(uniformData) {
    try {
      const response = await api.post("/uniform", uniformData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(uniformId) {
    try {
      const response = await api.get(`/uniform/${uniformId}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getuniforms() {
    try {
      const response = await api.get(`/uniforms`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(uniformId) {
    try {
      const response = await api.delete(`/uniform/${uniformId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(uniformId, uniformData) {
    try {
      const response = await api.put(`/uniform/${uniformId}`, uniformData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
