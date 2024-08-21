import { api } from "./api";

export default class {
  async createAdditive(additiveData) {
    try {
      const response = await api.post("/additive", additiveData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async deleteAdditive(additiveId) {
    try {
      const response = await api.delete(`/additive/${additiveId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateAdditive(additiveId, additiveData) {
    try {
      const response = await api.put(`/additive/${additiveId}`, additiveData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async createReajustment(reajustmentData) {
    try {
      const response = await api.post("/reajustment", reajustmentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async deleteReajustment(reajustmentId) {
    try {
      const response = await api.delete(`/reajustment/${reajustmentId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateReajustment(reajustmentId, reajustmentData) {
    try {
      const response = await api.put(`/reajustment/${reajustmentId}`, reajustmentData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
