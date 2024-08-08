/* eslint-disable react/prop-types */
import { Row } from "antd";
import { FormDivider } from "./FormDivider";

export const Fragment = ({ children, section }) => {
  return (
    <>
      {section && <FormDivider title={section} />}
      <Row gutter={[12, 12]}>{children}</Row>
    </>
  );
};
