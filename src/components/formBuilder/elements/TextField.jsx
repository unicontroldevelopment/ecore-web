"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdTextFields } from "react-icons/md";
import { z } from "zod";
import { cn } from "../../../lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  disabled: z.boolean().default(false),
});

export const TextFieldFormElement = {
  type: "TextField",
  construct: (id) => ({
    id: id,
    type: "TextField",
    extraAtribbutes: {
      label: "Texto",
      helperText: "Texto para Ajuda",
      required: false,
      placeHolder: "Valores aqui...",
    },
  }),
  designerBtnElement: {
    icon: MdTextFields,
    label: "Texto",
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
  validate: (formElement, currentValue) => {
    const element = formElement;
    if (element.extraAtribbutes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

const DesignerComponent = ({ elementInstance }) => {
  const { label, required, placeHolder, helperText } =
    elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-black">
        {label}
        {required && "*"}
      </Label>
      <Input
        readOnly
        disabled={elementInstance.extraAtribbutes.disabled}
        placeholder={placeHolder}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
};

const FormComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, placeHolder, helperText } =
    elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-ful">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;

          const valid = TextFieldFormElement.validate(
            elementInstance,
            e.target.value
          );
          setError(!valid);

          if (!valid) return;

          submitValue(elementInstance.id, e.target.value);
        }}
        value={value}
        disabled={elementInstance.extraAtribbutes.disabled}
      />
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            error && "text-red-500"
          )}
        >
          {helperText}
        </p>
      )}
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
      label: element.extraAtribbutes.label,
      helperText: element.extraAtribbutes.helperText,
      required: element.extraAtribbutes.required,
      placeHolder: element.extraAtribbutes.placeHolder,
    },
  });

  useEffect(() => {
    form.reset(element.extraAtribbutes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAtribbutes: {
        label: values.label,
        helperText: values.helperText,
        required: values.required,
        placeHolder: values.placeHolder,
        disabled: values.disabled,
      },
    });
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                O Titulo do campo <br /> Irá aparecer acima do campo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto dentro do campo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                Texto que aparece dentro do campo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de Ajuda</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                Texto de ajuda <br /> Irá aparecer abaxio do campo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y0.5">
                <FormLabel>Requer?</FormLabel>
                <FormDescription>
                  O Titulo do campo <br /> Irá aparecer acima do campo
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y0.5">
                <FormLabel>Desabilitar Campo?</FormLabel>
                <FormDescription>
                  Marque se deseja desabilitar o campo de entrada
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
