/* eslint-disable react/prop-types */
import { FormDivider } from "./FormDivider";
import { Row } from "antd";

export const Fragment = ({ children, section }) => {
  return (
    <>
      {section && <FormDivider title={section} />}
      <Row gutter={[12, 12]}>{children}</Row>
    </>
  );
};
