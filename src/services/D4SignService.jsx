import { api } from "./api";

export default class {
  async createDocument(documentData) {
    try {
      const response = await api.post("/cadastrarDocumento", documentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getDocument(documentId) {
    try {
      const response = await api.get(`/buscarDocumentosDoCofrePorId?documentId=${encodeURIComponent(documentId)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getSignatures(documentId) {
    try {
      const response = await api.post(`/listarSignatariosDeDocumento?documentId=${encodeURIComponent(documentId)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async registerSignOnDocument(documentData) {
    try {
      const response = await api.post("/cadastrarAssinaturaNoDocumento", documentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async resendSignature(documentData) {
    try {
      const response = await api.post("/reenviarDocumentoParaAssinar", documentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async cancelSignature(documentData) {
    try {
      const response = await api.post("/removerAssinaturaDoDocumento", documentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async cancelDocument(documentData) {
    try {
      const response = await api.post("/cancelarDocumento", documentData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async sendToSignDocument(documentData) {
    try {
      const response = await api.post("/enviarDocumentoParaAssinar", documentData);
      return response;
    } catch (error) {
      return error;
    }
  }
}