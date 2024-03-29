/* eslint-disable react/prop-types */
import { Divider, Typography } from "antd";

const { Title } = Typography;

export const FormDivider = ({ title }) => {
  return (
    <Divider orientation="left" plain>
      <Title level={5}>{title}</Title>
    </Divider>
  );
};
