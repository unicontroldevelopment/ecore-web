import { api } from "./api";

export default class {
  async valueExtensible(value) {
    try {
      const response = await api.post("/valueExtensible", value);
      return response;
    } catch (error) {
      return error;
    }
  }
  async uploadPDF(upload) {
    try {
      const response = await api.post("/upload", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async updatePDF(upload) {
    try {
      const response = await api.put("/updatePDF", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async uploadAdditivePDF(upload) {
    try {
      const response = await api.post("/uploadAdditive", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async updateAdditivePDF(upload) {
    try {
      const response = await api.put("/updateAdditivePDF", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async findCep(cep) {
    try {
      const response = await api.post("/cep", { cep });
      return response;
    } catch (error) {
      return error;
    }
  }
}
