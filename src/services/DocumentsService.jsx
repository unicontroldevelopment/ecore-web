import qs from "qs";
import { api } from "./api";

export default class {
  async createService(serviceData) {
    try {
      const response = await api.post("/service", serviceData);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getServices(type) {
    const query = {
        type
    };

    try {
      const response = await api.get(`/services?${qs.stringify(query)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async deleteService(serviceId) {
    try {
      const response = await api.delete(`/service/${serviceId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateService(serviceId, serviceData) {
    try {
      const response = await api.put(`/service/${serviceId}`, serviceData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async createContract(contractData) {
    try {
      const response = await api.post("/contract", contractData);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getContracts(type) {
    const query = {
        type
    };

    try {
      const response = await api.get(`/contracts?${qs.stringify(query)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async deleteContract(contractId) {
    try {
      const response = await api.delete(`/contract/${contractId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateContract(contractId, contractData) {
    try {
      const response = await api.put(`/contract/${contractId}`, contractData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
