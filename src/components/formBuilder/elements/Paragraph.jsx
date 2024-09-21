"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsTextParagraph } from "react-icons/bs";
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
import { Textarea } from "../../ui/textarea";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  text: z.string().min(2).max(1000),
});

export const ParagraphFieldFormElement = {
  type: "ParagraphField",
  construct: (id) => ({
    id: id,
    type: "ParagraphField",
    extraAtribbutes: {
      text: "Texto aqui",
    },
  }),
  designerBtnElement: {
    icon: BsTextParagraph,
    label: "Parágrafo",
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
  const { text } = elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-black text-muted-foreground">Parágrafo</Label>
      <p className="p-4">{text}</p>
    </div>
  );
};

const FormComponent = ({ elementInstance }) => {
  const { text } = elementInstance.extraAtribbutes;

  return (
    <div className="flex justify-center mt-4">
      <p className="p-4">{text}</p>
    </div>
  );
};

const PropertiesComponent = ({ elementInstance }) => {
  const element = elementInstance;
  const { updateElement } = useDesigner();
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text: element.extraAtribbutes.text,
    },
  });

  useEffect(() => {
    form.reset(element.extraAtribbutes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAtribbutes: {
        text: values.text,
      },
    });
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parágrafo</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
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
