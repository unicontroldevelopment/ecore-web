import qs from "qs";
import { api } from "./api";

export default class {
  async create(serverAccessData) {
    try {
      const response = await api.post("/serverAccess", serverAccessData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(serverAccessId) {
    try {
      const response = await api.get(`serverAccess/${serverAccessId}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getServerAccess(name) {
    const query = {
      name
    };

    try {
      const response = await api.get(`/serverAccessGetAll?${qs.stringify(query)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(serverAccessId) {
    try {
      const response = await api.delete(`serverAccess/${serverAccessId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(serverAccessId, serverAccessData) {
    try {
      console.log("id", serverAccessId);
      console.log("data", serverAccessData);
      const response = await api.put(`serverAccess/${serverAccessId}`, serverAccessData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
