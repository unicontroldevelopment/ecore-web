/* eslint-disable react/prop-types */
import { Typography } from "antd";


const { Title } = Typography;

export const Root = ({ children, title }) => {
    return (
      <>
        <Title level={2}>{title}</Title>
        {children}
      </>
    );
  };