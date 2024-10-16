/* eslint-disable react/prop-types */
import { Table } from "antd";
  
  export const CustomTableClean = ({
    data,
    columns,
    pagination = false,
  }) => {
    const columnsAndActions = [
      ...columns.map((column, index) => ({
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.key || 1 + index,
        sorter: column.sorter,
        render: column.render,
      })),
    ];

    return (
      <Table
        columns={columnsAndActions}
        dataSource={data}
        pagination={pagination}
        rowKey="id"
      />
    );
  };
  