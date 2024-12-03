import { Button, DatePicker, Form, Input, InputNumber, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const DraftForm = ({ draft, onSubmit, contractId }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
  
    useEffect(() => {
      if (draft) {
        console.log(draft);
  
        form.setFieldsValue({
          ...draft,
          date: draft.date ? moment(draft.date, "DD/MM/YYYY") : "24-04-20",
        });
      } else {
        form.resetFields();
      }
      setFile(null); 
    }, [draft, form]);
  
    const handleSubmit = async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("value", values.value);
      formData.append("date", values.date ? values.date.format("YYYY-MM-DD") : ""); // Corrige a formatação na submissão
      formData.append("contractId", contractId);
      if (file) {
        formData.append("file", file);
      }
  
      await onSubmit(formData);
    };
  
    const handleFileChange = (e) => {
      const fileEvent = e.target.files[0];
      if (fileEvent) {
        setFile(fileEvent);
      }
    };
  
    return (
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "Por favor, insira o título" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="value"
          label="Valor"
          rules={[{ required: true, message: "Por favor, insira o valor" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/R\$\s?|(,*)/g, "")}
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="Data"
          rules={[{ required: true, message: "Por favor, selecione a data" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY" // Exibe o formato desejado
          />
        </Form.Item>
        <Form.Item name="file" label="Arquivo">
          <Upload
            beforeUpload={(file) => {
              handleFileChange({ target: { files: [file] } });
              return false;
            }}
            accept=".pdf"
            maxCount={1}
            showUploadList={false}
          >
            <Button
              title="Anexar Minuta"
              style={{ backgroundColor: "#ed9121", color: "#fff" }}
              shape="default"
            >
              Anexar Minuta
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {draft ? "Atualizar" : "Criar"} Minuta
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default DraftForm;
