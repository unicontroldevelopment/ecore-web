import { Button, Modal, Upload } from "antd";
import React from "react";
import { Form } from "../form";
import { CustomInput } from "../input";

const EditContractModal = ({
  isVisible,
  onClose,
  onUpdate,
  contract,
  handleChange,
  handleFormatChange,
  handleSignChange,
  handleServiceChange,
  handleAddClick,
  handleClauseChange,
  toggleExpand,
  handleDeleteClause,
  handleFileChange,
  signs,
  services,
  Options,
}) => {
  const isContractReady =
    contract && contract.signOnContract && contract.signOnContract[0];

  return (
    <Modal
      title="Editar Contrato"
      open={isVisible}
      centered
      style={{ top: 20 }}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="submit" type="primary" onClick={() => onUpdate(contract)}>
          Atualizar
        </Button>,
        <Button key="back" onClick={onClose}>
          Voltar
        </Button>,
      ]}
    >
      {isContractReady ? (
        <>
          <Form.Fragment section="Contratante">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome"
                type="text"
                name="name"
                value={contract.name}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CPF ou CNPJ"
                type="text"
                name="cpfcnpj"
                value={contract.cpfcnpj}
                onChange={handleFormatChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={contract.cep}
                onChange={handleFormatChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Rua"
                type="text"
                name="road"
                value={contract.road}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="number"
                value={contract.number}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Complemento"
                type="text"
                name="complement"
                value={contract.complement}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Bairro"
                type="text"
                name="neighborhood"
                value={contract.neighborhood}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Cidade"
                type="text"
                name="city"
                value={contract.city}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="UF"
                type="text"
                name="state"
                value={contract.state}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>

          <Form.Fragment section="Contratado">
            <CustomInput.Select
              label="Assinaturas"
              name="signOnContract"
              value={
                contract.signOnContract[0].Contract_Signature.socialReason
                  ? contract.signOnContract[0].Contract_Signature.socialReason
                  : "Social"
              }
              options={signs.map((sign) => sign.socialReason)}
              onChange={handleSignChange}
            />
          </Form.Fragment>
          <Form.Fragment section="Contrato">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="contractNumber"
                value={contract.contractNumber}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.DateInput
                label="Data de Início"
                value={contract.date}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Valor"
                type="text"
                name="value"
                value={contract.value}
                onChange={handleFormatChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Índice"
                type="text"
                name="index"
                value={contract.index}
                onChange={handleChange}
                options={Options.IndexContract()}
              />
            </CustomInput.Root>
            <CustomInput.Select
              label="Serviços"
              name="contracts_Service"
              value={
                contract.contracts_Service?.map(
                  (service) => service.Services?.description
                ) ?? []
              }
              onChange={handleServiceChange}
              multiple={true}
              options={services.map((service) => service.description)}
            />
          </Form.Fragment>
          <Form.Fragment section="Clausulas">
            <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                style={{ marginBottom: "20px" }}
                color="primary"
                onClick={handleAddClick}
              >
                Adicionar Cláusula
              </Button>
              {contract.clauses.map((clause, index) => (
                <CustomInput.LongText
                  key={clause.id}
                  label={`Cláusula Nº${index + 1}`}
                  value={clause.description}
                  isExpanded={clause.isExpanded}
                  onChange={(e) =>
                    handleClauseChange(clause.id, e.target.value)
                  }
                  onExpandToggle={() => toggleExpand(clause.id)}
                  onDelete={() => handleDeleteClause(clause.id)}
                />
              ))}
            </div>
            <Upload
              beforeUpload={(file) => {
                handleFileChange({ target: { files: [file] } });
                return false;
              }}
              accept=".pdf"
              maxCount={1}
              showUploadList={false}
            >
              <Button
                title="Anexar Proposta"
                style={{ backgroundColor: "#ed9121", color: "#fff" }}
                shape="default"
              >
                Anexar Proposta
              </Button>
            </Upload>
          </Form.Fragment>
        </>
      ) : (
        <p>Carregando dados do contrato...</p>
      )}
    </Modal>
  );
};

export default React.memo(EditContractModal);
