import { api } from "./api";

export default class DraftsService {
  async createDraft(draftData) {
    try {
      // Verificamos se draftData já é um FormData
      const formData = draftData instanceof FormData ? draftData : new FormData();

      // Se não for FormData, adicionamos os campos manualmente
      if (!(draftData instanceof FormData)) {
        formData.append('title', draftData.title);
        formData.append('value', draftData.value);
        formData.append('date', draftData.date);
        formData.append('contractId', draftData.contractId);
        if (draftData.file) {
          formData.append('file', draftData.file);
        }
      }

      const response = await api.post("/drafts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Erro do servidor:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Nenhuma resposta recebida:', error.request);
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
      }
      throw error;
    }
  }

  async getDraftsByContractId(contractId) {
    try {
      const response = await api.get(`/drafts/contract/${contractId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDraftById(draftId) {
    try {
      const response = await api.get(`/drafts/${draftId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateDraft(draftId, draftData) {
    try {
      const response = await api.put(`/drafts/${draftId}`, draftData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteDraft(draftId) {
    try {
      const response = await api.delete(`/drafts/${draftId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}