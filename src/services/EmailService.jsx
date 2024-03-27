import qs from "qs";
import { api } from "./api";

export default class {
  async create(emailData) {
    try {
      const response = await api.post("/email", emailData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(emailId) {
    try {
      const response = await api.get(`/email/${emailId}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getEmails(type) {
    const query = {
        type
    };

    try {
      const response = await api.get(`/emails?${qs.stringify(query)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(emailId) {
    try {
      const response = await api.delete(`/email/${emailId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(emailId, emailData) {
    try {
      const response = await api.put(`/email/${emailId}`, emailData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
