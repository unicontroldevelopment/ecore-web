"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { z } from "zod";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Switch } from "../../ui/switch";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
});

export const DateFieldFormElement = {
  type: "DateField",
  construct: (id) => ({
    id: id,
    type: "DateField",
    extraAtribbutes: {
      label: "Data",
      helperText: "Escolha uma data",
      required: false,
    },
  }),
  designerBtnElement: {
    icon: BsFillCalendarDateFill,
    label: "Data",
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
  const { label, required, helperText } = elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-black">
        {label}
        {required && "*"}
      </Label>
      <Button
        variant={"outline"}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>Escolha uma data</span>
      </Button>
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
  const [date, setDate] = useState(
    defaultValue ? new Date(defaultValue) : undefined
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, helperText } =
    elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);

              if (!submitValue) return;
              const value = date?.toUTCString() || "";
              const valid = DateFieldFormElement.validate(
                elementInstance,
                value
              );
              setError(!valid);
              submitValue(elementInstance.id, value);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
      </form>
    </Form>
  );
};
