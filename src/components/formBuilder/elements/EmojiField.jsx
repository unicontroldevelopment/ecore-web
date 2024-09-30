"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSmile } from "react-icons/fa";
import { z } from "zod";
import happyEmoji from "../../../assets/form/emojis/happy.png"; // Substitua pelo caminho correto
import neutralEmoji from "../../../assets/form/emojis/neutral.png"; // Substitua pelo caminho correto
import sadEmoji from "../../../assets/form/emojis/sad.png";
import { cn } from "../../../lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  label: z.string().min(2, { message: "O campo deve ter pelo menos 2 caracteres" }).max(50, { message: "O campo deve ter no máximo 50 caracteres" }),
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
  },
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
        <EmojiOption imageSrc={happyEmoji} isSelected={value === "happy"} />
        <EmojiOption imageSrc={neutralEmoji} isSelected={value === "neutral"} />
        <EmojiOption imageSrc={sadEmoji} isSelected={value === "sad"} />
      </div>
    </div>
  );
};

const FormComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}) => {
  const [value, setValue] = useState(defaultValue || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required } = elementInstance.extraAtribbutes;

  const handleEmojiClick = (emojiValue) => {
    setValue(emojiValue);
    if (!submitValue) return;

    const valid = EmojiFieldFormElement.validate(elementInstance, emojiValue);
    setError(!valid);
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
          imageSrc={happyEmoji}
          isSelected={value === "happy"}
          onClick={() => handleEmojiClick("happy")}
        />
        <EmojiOption
          imageSrc={neutralEmoji}
          isSelected={value === "neutral"}
          onClick={() => handleEmojiClick("neutral")}
        />
        <EmojiOption
          imageSrc={sadEmoji}
          isSelected={value === "sad"}
          onClick={() => handleEmojiClick("sad")}
        />
      </div>
      {error && <p className="text-red-500">Este campo é obrigatório</p>}
    </div>
  );
};

const EmojiOption = ({ imageSrc, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      "cursor-pointer p-2 border-4",
      isSelected ? "bg-blue-200 rounded-lg" : ""
    )}
  >
    <img src={imageSrc} alt="emoji" className="w-30 h-20" />{" "}
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
      value: element.extraAtribbutes.value || "neutral",
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
        value: values.value,
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
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
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
