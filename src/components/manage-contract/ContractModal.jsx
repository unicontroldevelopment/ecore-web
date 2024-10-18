import { Button, DatePicker, Form, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

const ContractModal = ({ visible, contract, onClose, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (contract) {
      form.setFieldsValue({
        ...contract,
        date: dayjs(contract.date),
      });
    }
  }, [contract, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onUpdate({ ...contract, ...values });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={visible}
      title="Detalhes do Contrato"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Cancelar
        </Button>,
        <Button key="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Atualizar
        </Button>,
      ]}
      className="max-w-lg"
    >
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item name="name" label="Nome" className="mb-4">
          <Input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>
        <Form.Item name="contractNumber" label="Número do Contrato" className="mb-4">
          <Input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>
        <Form.Item name="value" label="Valor" className="mb-4">
          <Input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>
        <Form.Item name="date" label="Data" className="mb-4">
          <DatePicker className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(ContractModal);