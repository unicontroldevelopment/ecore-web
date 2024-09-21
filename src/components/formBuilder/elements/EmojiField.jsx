"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSmile } from "react-icons/fa";
import { z } from "zod";
import { cn } from "../../../lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  required: z.boolean().default(false),
  value: z.enum(["bad", "neutral", "good"]),
});

export const EmojiFieldFormElement = {
  type: "EmojiField",
  construct: (id) => ({
    id: id,
    type: "EmojiField",
    extraAtribbutes: {
      label: "Selecione seu humor",
      required: false,
      value: null,
    },
  }),
  designerBtnElement: {
    icon: FaSmile,
    label: "Emoji",
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
      return element.extraAtribbutes.value !== "";
    }
    return true;
  }
};

const DesignerComponent = ({ elementInstance }) => {
  const { label, required, value } = elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-black">
        {label}
        {required && "*"}
      </Label>
      <div className="flex justify-between">
        <EmojiOption emoji="😟" isSelected={value === "sad"} />
        <EmojiOption emoji="😐" isSelected={value === "neutral"} />
        <EmojiOption emoji="😄" isSelected={value === "happy"} />
      </div>
    </div>
  );
};

const FormComponent = ({ elementInstance, submitValue, isInvalid, defaultValue }) => {
  const [value, setValue] = useState(defaultValue || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required } = elementInstance.extraAtribbutes;

  const handleSelect = (emojiValue) => {
    setValue(emojiValue);
    submitValue(elementInstance.id, emojiValue);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex justify-between">
        <EmojiOption
          emoji="😟"
          isSelected={value === "sad"}
          onClick={() => handleSelect("sad")}
        />
        <EmojiOption
          emoji="😐"
          isSelected={value === "neutral"}
          onClick={() => handleSelect("neutral")}
        />
        <EmojiOption
          emoji="😄"
          isSelected={value === "happy"}
          onClick={() => handleSelect("happy")}
        />
      </div>
      {error && <p className="text-red-500">Este campo é obrigatório</p>}
    </div>
  );
};

const EmojiOption = ({ emoji, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      "text-3xl cursor-pointer p-2",
      isSelected ? "bg-blue-200 rounded-lg" : ""
    )}
  >
    {emoji}
  </div>
);


const PropertiesComponent = ({ elementInstance }) => {
  const element = elementInstance;
  const { updateElement } = useDesigner();
  
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAtribbutes.label,
      required: element.extraAtribbutes.required,
      value: element.extraAtribbutes.value || "neutral", // Defina um valor padrão
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
        required: values.required,
        value: values.value,  // Inclui o valor do emoji
      },
    });
  }

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3">
        {/* Campos existentes */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione um Emoji</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`emoji-button ${field.value === "bad" ? "selected" : ""}`}
                    onClick={() => field.onChange("bad")}
                  >
                    😠
                  </button>
                  <button
                    type="button"
                    className={`emoji-button ${field.value === "neutral" ? "selected" : ""}`}
                    onClick={() => field.onChange("neutral")}
                  >
                    😐
                  </button>
                  <button
                    type="button"
                    className={`emoji-button ${field.value === "good" ? "selected" : ""}`}
                    onClick={() => field.onChange("good")}
                  >
                    😃
                  </button>
                </div>
              </FormControl>
              <FormDescription>Selecione o emoji que representa o valor.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
