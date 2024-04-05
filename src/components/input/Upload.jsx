/* eslint-disable react/prop-types */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";

const uploadButtonStyle = {
  width: "100%",
  backgroundColor: "#69c0ff",
  borderColor: "#69c0ff",
  color: "white",
};

const props = {
  name: "file",
  action: "https://run.mocky.io/v3/bd75ef14-ac59-47ad-a168-f014b43900d1", // Substitua com a URL que você obteve de mocky.io
  headers: {
    authorization: "authorization-text",
  },
};

export function CustomUpload({ onFileUpload }) {
  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} Arquivo Carregado com sucesso!`);
      console.log("URL do arquivo:", info.file.response.url);
      onFileUpload(info.file.response.url);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} Erro ao carregar arquivo.`);
    }
  };

  return (
    <Upload
      {...props}
      listType=".pdf"
      onChange={handleUploadChange}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Button style={uploadButtonStyle} icon={<UploadOutlined />}>
        Anexar PDF da Proposta
      </Button>
    </Upload>
  );
}
