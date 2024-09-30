"use client";

import { RiSeparator } from "react-icons/ri";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";

export const SeparatorFieldFormElement = {
  type: "SeparatorField",
  construct: (id) => ({
    id: id,
    type: "SeparatorField",
  }),
  designerBtnElement: {
    icon: RiSeparator,
    label: "Separador",
  },
  designerComponent: ({ elementInstance }) => (
    <DesignerComponent elementInstance={elementInstance} />
  ),
  formComponent: ({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
  }) => (
    <FormComponent
      elementInstance={elementInstance}
      submitValue={submitValue}
      isInvalid={isInvalid}
      defaultValue={defaultValue}
    />
  ),
  propertiesComponent: ({ elementInstance }) => (
    <PropertiesComponent elementInstance={elementInstance} />
  ),
  validate: () => true,
};

const DesignerComponent = ({ elementInstance }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-black text-muted-foreground">Separador</Label>
        <Separator />
    </div>
  );
};

const FormComponent = ({ elementInstance }) => {
  return <Separator />;
};

const PropertiesComponent = ({ elementInstance }) => {
  return <p>Sem propriedades para esse elemento</p>;
};
