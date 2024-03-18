/* eslint-disable react/prop-types */
import { Row } from "antd";
import { FilterDivider } from "./FilterDivider";

export const Fragment = ({ children, section }) => {
  return (
    <>
      {section && <FilterDivider title={section} />}
      <Row gutter={[12, 12]}>{children}</Row>
    </>
  );
};