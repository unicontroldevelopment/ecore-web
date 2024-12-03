import { Table, Tabs, Typography, message } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;
const { TabPane } = Tabs;

const EmployeeStock = () => {
  const [charlesStock, setCharlesStock] = useState([]);
  const [rodineiStock, setRodineiStock] = useState([]);

  useEffect(() => {
    generateRandomStockData();
  }, []);

  const generateRandomStockData = () => {
    const products = ['Raticida', 'Inseticida', 'Armadilha', 'Repelente', 'Veneno'];

    const generateRandomStock = () => {
      return products.map((product, index) => ({
        id: index + 1,
        nom_ins: product,
        quantidade: Math.floor(Math.random() * 100) + 1,
      }));
    };

    try {
      setCharlesStock(generateRandomStock());
      setRodineiStock(generateRandomStock());
    } catch (error) {
      console.error("Erro ao gerar dados aleatórios do estoque:", error);
      message.error("Falha ao carregar dados do estoque dos colaboradores");
    }
  };

  const columns = [
    { title: 'Nome do Produto', dataIndex: 'nom_ins', key: 'nom_ins' },
    { title: 'Quantidade', dataIndex: 'quantidade', key: 'quantidade' },
  ];

  return (
    <div>
      <Title level={2}>Estoque de Colaboradores</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Charles Luis da Rosa Gaspary" key="1">
          <Table 
            dataSource={charlesStock} 
            columns={columns} 
            rowKey="id"
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Rodinei Costa de Rezendes" key="2">
          <Table 
            dataSource={rodineiStock} 
            columns={columns} 
            rowKey="id"
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmployeeStock;