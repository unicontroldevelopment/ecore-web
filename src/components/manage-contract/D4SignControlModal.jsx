import {
    CloseOutlined,
    ControlFilled,
    DownloadOutlined,
    InfoCircleFilled,
    QuestionCircleOutlined,
    SendOutlined,
} from "@ant-design/icons";
import { Button, Modal, Popconfirm, Table, Tooltip } from "antd";
import { FaFileUpload } from "react-icons/fa";
import { ActionsContainer } from "./styles";

const D4SignControlModal = ({
  isVisible,
  onClose,
  contract,
  pagination,
  verifyColor,
  handleD4SignRegisterSign,
  handleSendD4SignToSign,
  handleD4signInfo,
  handleD4SignViewDocument,
  deleteDocumentOnD4Sign,
  cancelDelete,
  handleD4SignRegister
}) => {
  const d4SignOptions = [
    {
      key: "status",
      contract: contract.d4sign
        ? contract.d4SignData
        : "Não cadastrado",
      status: contract.d4sign
        ? contract.d4SignData
        : "Não cadastrado",
      exists: !!contract.d4sign,
    },
  ];

  const d4SignColumns = [
    {
      title: "Contrato",
      dataIndex: "contract",
      key: "contract",
      render: (text, row) =>
        row.contract.nameDoc && row.contract.nameDoc.length > 25 ? (
          <Tooltip title={row.contract.nameDoc.toUpperCase()}>
            <p
              style={{
                cursor: "pointer",
                ...(window.innerWidth > 768 ? {} : { fontSize: "0.8rem" }),
              }}
            >
              {row.contract.nameDoc.toUpperCase().substring(0, 25)}...
            </p>
          </Tooltip>
        ) : (
          <p style={{ cursor: "pointer" }}>
            {row.contract.nameDoc ? row.contract.nameDoc.toUpperCase() : ""}
          </p>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, row) => {
        return row.contract.statusName &&
          row.contract.statusName.length > 10 ? (
          <Tooltip title={row.contract.statusName.toUpperCase()}>
            <p
              style={{
                cursor: "pointer",
                backgroundColor: verifyColor(row.contract.statusId),
                color: "#ffffff",
                borderRadius: "5px",
                padding: "4px 15px",
                margin: "15px",
                display: "inline-block",
              }}
            >
              {row.contract.statusName.toUpperCase().substring(0, 10)}...
            </p>
          </Tooltip>
        ) : (
          <p
            style={{
              cursor: "pointer",
              backgroundColor: verifyColor(row.contract.statusId),
              color: "#ffffff",
              borderRadius: "5px",
              padding: "4px 15px",
              margin: "15px",
              display: "inline-block",
            }}
          >
            {row.contract.statusName
              ? row.contract.statusName.toUpperCase()
              : ""}
          </p>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <ActionsContainer>
          {record.exists && (
            <Button
              title="Controle de Assinatura"
              style={{ backgroundColor: "#7B68EE", color: "#fff" }}
              shape="circle"
              icon={<ControlFilled />}
              onClick={() => handleD4SignRegisterSign(record)}
            />
          )}
          {record.exists && (
            <Button
              title="Enviar para Assinar"
              style={{ backgroundColor: "#FF69B4", color: "#fff" }}
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleSendD4SignToSign(record)}
            />
          )}
          {record.exists && (
            <Button
              title="Informações do Documento"
              style={{ backgroundColor: "#808080", color: "#fff" }}
              shape="circle"
              icon={<InfoCircleFilled />}
              onClick={() => handleD4signInfo(record)}
            />
          )}
          {record.exists && (
            <Button
              title="Donwload do Documento"
              style={{ backgroundColor: "#26D0F0", color: "#fff" }}
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={() => handleD4SignViewDocument(record)}
            />
          )}
          {record.exists && (
            <Popconfirm
              title="Tem certeza?"
              description="Você quer cancelar este contrato?"
              onConfirm={() => deleteDocumentOnD4Sign(record)}
              onCancel={() => cancelDelete(record)}
              okText="Sim"
              cancelText="Não"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button
                title="Cancelar Documento"
                style={{ backgroundColor: "#c72424", color: "#fff" }}
                shape="circle"
                icon={<CloseOutlined />}
              />
            </Popconfirm>
          )}
          {!record.exists && (
            <Button
              title="Cadastrar Documento"
              style={{ backgroundColor: "#9400D3", color: "#fff" }}
              shape="circle"
              icon={<FaFileUpload />}
              onClick={() => handleD4SignRegister(record)}
            />
          )}
        </ActionsContainer>
      ),
    },
  ];

  return (
    <Modal
      title="Controle de assinaturas"
      open={isVisible}
      centered
      width={"90%"}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Voltar
        </Button>,
      ]}
    >
      <Table
        columns={d4SignColumns}
        dataSource={d4SignOptions}
        pagination={false}
        rowKey="id"
      />
    </Modal>
  );
};

export default D4SignControlModal;
