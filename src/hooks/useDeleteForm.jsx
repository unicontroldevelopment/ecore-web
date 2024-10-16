import { useState } from 'react';
import { Toast } from '../components/toasts';
import FormService from '../services/FormService';

export function useDeleteForm(formId, onDelete) {
  const [loading, setLoading] = useState(false);
  const service = new FormService();

  const deleteForm = async () => {
    setLoading(true);
    try {
      await service.delete(formId);
      Toast.Success("Formulário deletado!");
      onDelete();
    } catch (error) {
      Toast.Error("Erro ao deletar formulário!");
    } finally {
      setLoading(false);
    }
  };

  return { deleteForm, loading };
}