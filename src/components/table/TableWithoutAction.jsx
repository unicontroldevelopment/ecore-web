/* eslint-disable react/prop-types */
import { Table } from "antd";
  
  export const CustomTableClean = ({
    data,
    columns,
  }) => {
    const columnsAndActions = [
      ...columns.map((column, index) => ({
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.key || 1 + index,
        render: column.render,
      })),
    ];
  
    const paginationConfig = {
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "15", "20", "30", "50"],
    };
  
    return (
      <Table
        columns={columnsAndActions}
        dataSource={data}
        pagination={paginationConfig}
        rowKey="id"
      />
    );
  };
  