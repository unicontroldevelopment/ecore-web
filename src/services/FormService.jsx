import { api } from "./api";

export default class {
  async create(formData) {
    try {
      const response = await api.post("/form", formData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(formId) {
    try {
      const response = await api.get(`/form/${formId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getByUrl(formUrl) {
    try {
      const response = await api.get(`/formUrl/${formUrl}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(formId) {
    try {
      const response = await api.delete(`/form/${formId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(formId, formData) {
    try {
      const response = await api.put(`/form/${formId}`, formData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async updateContent(formId, contentData) {
    try {
      const response = await api.put(`/formContent/${formId}`, contentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async publishForm(formId) {
    try {
      const response = await api.put(`/publishForm/${formId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async submitForm(formUrl, contentData, name) {
    try {
      const response = await api.put(`/submitForm/${formUrl}`, {contentData, name});
      return response;
    } catch (error) {
      return error;
    }
  }
  async getForms() {
    try {
      const response = await api.get(`/forms`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getSubmissions(formId) {
    try {
      const response = await api.get(`/formSubmissions/${formId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
}
