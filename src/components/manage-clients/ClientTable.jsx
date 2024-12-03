import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import React from "react";
import { ActionsContainer } from "./styles";

const ClientTable = ({
  contracts,
  loading,
  onView,
  onUpdate,
  confirm,
  cancel,
  handleD4Sign,
  handleButtonClick,
  verifycolor,
}) => {
  const columns = [
    {
      title: "Cliente",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "CPF/CNPJ",
      dataIndex: "cpfcnpj",
      key: "cpfcnpj",
      sorter: (a, b) => a.cpfcnpj - b.cpfcnpj,
    },
    {
      title: "Complementos",
      key: "actions",
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Minutas"
            style={{ backgroundColor: "#5F9EA0", color: "#fff" }}
            shape="circle"
            onClick={() => handleButtonClick(record, "minuta")}
            icon={<FileTextOutlined />}
          />
          <Button
            title="Aditivo/Reajuste"
            style={{ backgroundColor: "#FF7F50", color: "#fff" }}
            shape="circle"
            onClick={() => handleButtonClick(record, "aditivo")}
            icon={<EllipsisOutlined />}
          />
        </ActionsContainer>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Visualizar"
            style={{ backgroundColor: "#3f8ece", color: "#fff" }}
            onClick={() => onView(record)}
            icon={<EyeOutlined />}
            shape="circle"
          />
          <Button
            title="Editar"
            style={{ backgroundColor: "#36db6a", color: "#fff" }}
            onClick={() => onUpdate(record)}
            icon={<EditOutlined />}
            shape="circle"
          />
          <Popconfirm
            title="Tem certeza?"
            description="Você quer deletar esta informação?"
            onConfirm={() => confirm(record)}
            onCancel={() => cancel(record)}
            okText="Sim"
            cancelText="Não"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              title="Deletar"
              style={{ backgroundColor: "#da4444", color: "#fff" }}
              icon={<DeleteOutlined />}
              shape="circle"
            />
          </Popconfirm>
        </ActionsContainer>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    return;
  };

  const paginationConfig = {
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "15", "20", "30", "50"],
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <Table
        columns={columns}
        dataSource={contracts}
        pagination={paginationConfig}
        rowKey="id"
        loading={loading}
        className="min-w-full"
      />
    </div>
  );
};

export default React.memo(ClientTable);
