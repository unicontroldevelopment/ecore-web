import { api } from "./api";

export default class {
  async createDocument(documentData) {
    try {
      const formData = new FormData();
      
      // Envie a string base64 diretamente
      formData.append('file', documentData.file);

      if (documentData.file_anexo) {
        formData.append('file_anexo', documentData.file_anexo);
      }
  
      // Adiciona outros dados
      formData.append('name', documentData.name);
      formData.append('contractId', documentData.contractId);
  
      const response = await api.post("/cadastrarDocumento", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error; // Lança o erro para tratamento adicional, se necessário
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
  async downloadDocument(documentId) {
    try {
      const response = await api.post("/downloadDeDocumento", documentId);
      return response;
    } catch (error) {
      return error;
    }
  }
}