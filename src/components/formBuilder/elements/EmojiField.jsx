"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSmile } from "react-icons/fa";
import { z } from "zod";
import happyEmoji from "../../../assets/form/emojis/happy.png";
import neutralEmoji from "../../../assets/form/emojis/neutral.png";
import sadEmoji from "../../../assets/form/emojis/sad.png";
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
import { Separator } from "../../ui/separator";
import { Switch } from "../../ui/switch";
import useDesigner from "../hooks/useDesigner";

const propertiesSchema = z.object({
  label: z
    .string()
    .min(2, { message: "O campo deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O campo deve ter no máximo 50 caracteres" }),
  required: z.boolean().default(false),
  emoji: z.enum(["bad", "neutral", "good"]).nullable(),
});

export const EmojiFieldFormElement = {
  type: "EmojiField",
  construct: (id) => ({
    id: id,
    type: "EmojiField",
    extraAtribbutes: {
      label: "Selecione seu humor",
      required: false,
      emoji: null,
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
      return (
        currentValue === "bad" ||
        currentValue === "neutral" ||
        currentValue === "good"
      );
    }
    return true;
  },
};

const DesignerComponent = ({ elementInstance }) => {
  const { label, required, emoji } = elementInstance.extraAtribbutes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-black">
        {label}
        {required && "*"}
      </Label>
      <div className="flex justify-between">
        <EmojiOption imageSrc={happyEmoji} isSelected={emoji === "good"} />
        <EmojiOption imageSrc={neutralEmoji} isSelected={emoji === "neutral"} />
        <EmojiOption imageSrc={sadEmoji} isSelected={emoji === "bad"} />
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
          isSelected={value === "good"}
          onClick={() => handleEmojiClick("good")}
        />
        <EmojiOption
          imageSrc={neutralEmoji}
          isSelected={value === "neutral"}
          onClick={() => handleEmojiClick("neutral")}
        />
        <EmojiOption
          imageSrc={sadEmoji}
          isSelected={value === "bad"}
          onClick={() => handleEmojiClick("bad")}
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
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAtribbutes.label,
      required: element.extraAtribbutes.required,
      emoji: element.extraAtribbutes.emoji,
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
        emoji: values.emoji,
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
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y0.5">
                <FormLabel>Requer?</FormLabel>
                <FormDescription>Este campo é obrigatório?</FormDescription>
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
