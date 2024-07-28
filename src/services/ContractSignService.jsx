import { api } from "./api";

export default class {
  async create(contractSignData) {
    try {
      const response = await api.post("/contractSign", contractSignData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(contractSignId) {
    try {
      const response = await api.get(`/contractSign/${contractSignId}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getcontractSigns() {
    try {
      const response = await api.get(`/contractSigns`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(contractSignId) {
    try {
      const response = await api.delete(`/contractSign/${contractSignId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(contractSignId, contractSignData) {
    try {
      const response = await api.put(`/contractSign/${contractSignId}`, contractSignData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
