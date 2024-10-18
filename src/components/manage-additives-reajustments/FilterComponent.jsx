import {
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { Filter } from "../filter";
import { CustomInput } from "../input";

const FilterHeader = ({
  onClearFilters,
  toggleFilters,
  isExpanded,
  onModalCreate,
}) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2">
      <FilterOutlined style={{ fontSize: "24px" }} />
      <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
        Filtros
      </h1>
    </div>
    <div className="flex gap-2">
      <Button
        type="primary"
        onClick={() => onModalCreate(true)}
      >
        Adicionar Cliente
      </Button>
      <Button type="default" icon={<ReloadOutlined />} onClick={onClearFilters}>
        Limpar Filtros
      </Button>
      <Button
        type="link"
        onClick={toggleFilters}
        icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
      >
        {isExpanded ? "Recolher" : "Expandir"}
      </Button>
    </div>
  </div>
);

const FilterComponent = ({ filter, onFilterChange, signs, onClearFilters, onModalCreate, }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleFilters = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-6 p-4">
      <FilterHeader
        onClearFilters={onClearFilters}
        toggleFilters={toggleFilters}
        isExpanded={isExpanded}
        onModalCreate={onModalCreate}
      />

      {isExpanded && (
        <div className="flex flex-wrap gap-6">
          <CustomInput.Root columnSize={16}>
            <Filter.FilterInput
              label="Nome do Cliente"
              name="name"
              value={filter.name}
              onChange={onFilterChange}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={7}>
            <Filter.Select
              label="Franquia"
              name="franchise"
              value={filter.franchise}
              onChange={onFilterChange}
              options={signs.map((sign) => sign.socialReason)}
            />
          </CustomInput.Root>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
