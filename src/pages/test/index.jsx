/* eslint-disable react/prop-types */
import { Button, Upload } from 'antd';
import * as React from "react";
import { Toast } from '../../components/toasts';
import Utils from '../../services/Utils';

const FileUpload = () => {
  const service = new Utils();

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await service.uploadPDF(formData);
      if (response.status === 500) {
        Toast.Error("DEU ERRO!");
      } else {
        Toast.Success("Arquivo anexado com sucesso!");
      }
    } catch (error) {
      console.error('Error uploading file', error);
      Toast.Error("Erro ao anexar o arquivo!");
    }
  };

  return (
    <div>
      <Upload
        beforeUpload={(file) => {
          handleUpload({ file });
          return false;
        }}
        accept=".pdf"
        showUploadList={false}
      >
        <Button>Upload PDF</Button>
      </Upload>
    </div>
  );
};

export default FileUpload;