"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdCalculate } from "react-icons/md";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "../../ui/switch";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  calculationType: z.enum(["add", "subtract", "multiply", "divide", "percentage"]),
});

const calculationTypes = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b !== 0 ? a / b : "Error"),
  percentage: (a, b) => (a * b) / 100,
};

export const CalculatorFieldFormElement = {
  type: "CalculatorField",
  construct: (id) => ({
    id,
    type: "CalculatorField",
    extraAttributes: {
      label: "Calculadora",
      helperText: "Entre dois números para fazer um calculo",
      required: false,
      calculationType: "add",
    },
  }),
  designerBtnElement: {
    icon: MdCalculate,
    label: "Calculadora",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement;
    if (element.extraAttributes.required) {
      return currentValue.input1 !== "" && currentValue.input2 !== "";
    }
    return true;
  },
};

function DesignerComponent({ elementInstance }) {
  const { label, helperText, calculationType } = elementInstance.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input readOnly placeholder="Primeiro Valor" />
        <Input readOnly placeholder="Segundo Valor" />
      </div>
      <Input readOnly placeholder="Resultado" />
      {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>
  );
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }) {
  const [value1, setValue1] = useState(defaultValue?.input1 || "");
  const [value2, setValue2] = useState(defaultValue?.input2 || "");
  const [result, setResult] = useState("");
  const [error, setError] = useState(false);

  const { label, required, helperText, calculationType } = elementInstance.extraAttributes;

  useEffect(() => {
    setError(isInvalid);
  }, [isInvalid]);

  useEffect(() => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);
    if (!isNaN(num1) && !isNaN(num2)) {
      const calculationFunction = calculationTypes[calculationType];
      setResult(calculationFunction(num1, num2).toString());
    } else {
      setResult("");
    }
  }, [value1, value2, calculationType]);

  const handleBlur = () => {
    if (!submitValue) return;
    const valid = CalculatorFieldFormElement.validate(
      elementInstance,
      { input1: value1, input2: value2 }
    );
    setError(!valid);
    if (!valid) return;
    submitValue(elementInstance.id, { input1: value1, input2: value2, result });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex gap-2">
        <Input
          className={cn(error && "border-red-500")}
          placeholder="Primeiro Valor"
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          onBlur={handleBlur}
        />
        <Input
          className={cn(error && "border-red-500")}
          placeholder={calculationType === "percentage" ? "Porcentagem" : "Segundo Valor"}
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <Input readOnly value={result} placeholder="Result" />
      {helperText && (
        <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>
          {helperText}
        </p>
      )}
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const { updateElement } = useDesigner();
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: elementInstance.extraAttributes.label,
      helperText: elementInstance.extraAttributes.helperText,
      required: elementInstance.extraAttributes.required,
      calculationType: elementInstance.extraAttributes.calculationType,
    },
  });

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [elementInstance, form]);

  function applyChanges(values) {
    updateElement(elementInstance.id, {
      ...elementInstance,
      extraAttributes: values,
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
              <FormLabel>Titulo do campo</FormLabel>
              <FormControl>
                <Input {...field} onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }} />
              </FormControl>
              <FormDescription>O titulo do campo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de ajuda</FormLabel>
              <FormControl>
                <Input {...field} onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }} />
              </FormControl>
              <FormDescription>Texto de ajuda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Requer?</FormLabel>
                <FormDescription>
                  Esse campo é obrigatório?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="calculationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Calculo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de calculo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="add">Adição</SelectItem>
                  <SelectItem value="subtract">Subtração</SelectItem>
                  <SelectItem value="multiply">Multipliação</SelectItem>
                  <SelectItem value="divide">Divisão</SelectItem>
                  <SelectItem value="percentage">Porcentagem</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>O tipo de calculo a ser feito</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}