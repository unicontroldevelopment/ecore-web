import { Button, Modal } from "antd";
import React from "react";
import { Form } from "../form";
import { CustomInput } from "../input";

const CreateClientModal = ({
  isVisible,
  onClose,
  onCreate,
  contract,
  handleChange,
  handleFormatChange,
  handleSignChange,
  signs,
  formatCpfOrCnpj,
  formatCep
}) => {
  const isContractReady =
    contract && contract.signOnContract && contract.signOnContract[0];

  return (
    <Modal
      title="Adicionar novo Cliente"
      open={isVisible}
      centered
      style={{ top: 20 }}
      onCancel={() => onClose(false)}
      width={800}
      footer={[
        <Button key="back" onClick={() => onClose(false)}>
          Voltar
        </Button>,
        <Button key="submit" type="primary" onClick={onCreate}>
          Adicionar
        </Button>,
      ]}
    >
      {isContractReady ? (
        <>
          <Form.Fragment section="Dados">
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
                value={formatCpfOrCnpj}
                onChange={handleFormatChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={formatCep}
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
          <Form.Fragment section="Franquia">
            <CustomInput.Select
              label="Assinaturas"
              name="signOnContract"
              value={contract.signOnContract[0]?.Contract_Signature.socialReason}
              options={signs.map((sign) => sign.socialReason)}
              onChange={handleSignChange}
            />
          </Form.Fragment>
        </>
      ) : (
        <p>Carregando dados do contrato...</p>
      )}
    </Modal>
  );
};

export default React.memo(CreateClientModal);
