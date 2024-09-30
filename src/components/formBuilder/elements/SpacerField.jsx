"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuSeparatorHorizontal } from "react-icons/lu";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement = {
  type: "SpacerField",
  construct: (id) => ({
    id: id,
    type: "SpacerField",
    extraAtribbutes: {
      height: 20,
    },
  }),
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Espaçador",
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
  const { height } = elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className=" text-muted-foreground">Espaçador: {height}px</Label>
      <LuSeparatorHorizontal className="h-20 w-8" />
    </div>
  );
};

const FormComponent = ({ elementInstance }) => {
  const { height } = elementInstance.extraAtribbutes;

  return <div style={{ height, width: "100%" }}></div>;
};

const PropertiesComponent = ({ elementInstance }) => {
  const element = elementInstance;
  const { updateElement } = useDesigner();
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height: element.extraAtribbutes.height,
    },
  });

  useEffect(() => {
    form.reset(element.extraAtribbutes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAtribbutes: {
        height: values.height,
      },
    });
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho: (px): {form.watch("height")} </FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
