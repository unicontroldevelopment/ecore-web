import {
    ControlFilled,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import React from "react";
import { ActionsContainer } from "./styles";

const ContractTable = ({
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
      title: "Nº Contrato",
      dataIndex: "contractNumber",
      key: "contractNumber",
      sorter: (a, b) => a.contractNumber - b.contractNumber,
    },
    {
      title: "D4Sign",
      key: "d4sign",
      dataIndex: "d4sign",
      render: (text, row) => {
        const hasD4Sign = row.d4SignData;

        const backgroundColor = hasD4Sign
          ? verifycolor(row.d4SignData.statusId)
          : "#836FFF";
        const statusText = hasD4Sign
          ? row.d4SignData.statusName.toUpperCase()
          : "NÃO CADASTRADO";

        return (
          <Tooltip title={statusText}>
            <p
              style={{
                cursor: "pointer",
                backgroundColor: backgroundColor,
                color: "#ffffff",
                borderRadius: "5px",
                padding: "4px 15px",
                margin: "15px",
                display: "inline-block",
              }}
            >
              {statusText === "NÃO CADASTRADO" || statusText.length <= 10
                ? statusText
                : `${statusText.substring(0, 10)}...`}
            </p>
          </Tooltip>
        );
      },
    },
    {
      title: "D4Sign/Opções",
      key: "actions",
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Controle D4Sign"
            style={{ backgroundColor: "#836FFF", color: "#fff" }}
            shape="circle"
            icon={<ControlFilled />}
            onClick={() => handleD4Sign(record)}
          />
          <Button
            title="Aditivo/Reajuste"
            style={{ backgroundColor: "#FF7F50", color: "#fff" }}
            shape="circle"
            onClick={() => handleButtonClick(record)}
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

export default React.memo(ContractTable);
