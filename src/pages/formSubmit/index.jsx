import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Toast } from "../../components/toasts";

const PublicForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      Toast.Success(`Formulário enviado com sucesso!`);
    } catch (error) {
      Toast.Error("Erro ao enviar o formulário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Formulário Público</h1>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="message" label="Mensagem">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PublicForm;