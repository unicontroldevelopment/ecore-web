"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsCardImage } from "react-icons/bs";
import { z } from "zod";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
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
  multiple: z.boolean().default(false),
});

export const ImagesFieldFormElement = {
  type: "ImagesField",
  construct: (id) => ({
    id: id,
    type: "ImagesField",
    extraAtribbutes: {
      label: "Imagens",
      helperText: "Carregue suas imagens aqui",
      required: false,
      multiple: false,
    },
  }),
  designerBtnElement: {
    icon: BsCardImage,
    label: "Imagens",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const { required } = formElement.extraAtribbutes;
    if (required) {
      return currentValue && currentValue.length > 0;
    }
    return true;
  },
};

function DesignerComponent({ elementInstance }) {
  const { label, required, helperText } = elementInstance.extraAtribbutes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Button variant="outline" className="w-full justify-start text-left font-normal h-64">
        <BsCardImage className="h-4 w-4 mr-2" />
        Carregar imagens
      </Button>
      {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>
  );
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }) {
    const [images, setImages] = useState(defaultValue ? JSON.parse(defaultValue) : []);
    const { label, required, helperText, multiple } = elementInstance.extraAtribbutes;
    const fileInputRef = useRef(null);
  
    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ data: reader.result, name: file.name });
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(readers).then((results) => {
        const newImages = multiple ? [...images, ...results] : results;
        setImages(newImages);
        submitValue(elementInstance.id, JSON.stringify(newImages));
      });
    };
  
    const removeImage = (index) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      submitValue(elementInstance.id, JSON.stringify(newImages));
    };
  
    return (
      <div className="flex flex-col gap-2 w-full">
        <Label className={cn(isInvalid && "text-red-500")}>
          {label}
          {required && "*"}
        </Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img.data} alt={img.name} className="w-20 h-20 object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-20 h-20 flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <BsCardImage className="h-6 w-6" />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleImageChange}
          className="hidden"
        />
        {helperText && (
          <p className={cn("text-muted-foreground text-[0.8rem]", isInvalid && "text-red-500")}>
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
      label: elementInstance.extraAtribbutes.label,
      helperText: elementInstance.extraAtribbutes.helperText,
      required: elementInstance.extraAtribbutes.required,
      multiple: elementInstance.extraAtribbutes.multiple,
    },
  });

  useEffect(() => {
    form.reset(elementInstance.extraAtribbutes);
  }, [elementInstance, form]);

  function applyChanges(values) {
    updateElement(elementInstance.id, {
      ...elementInstance,
      extraAtribbutes: values,
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
                <Input {...field} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
              </FormControl>
              <FormDescription>O título do campo. Aparecerá acima do campo.</FormDescription>
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
                <Input {...field} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
              </FormControl>
              <FormDescription>Texto de ajuda. Aparecerá abaixo do campo.</FormDescription>
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
                <FormLabel>Obrigatório?</FormLabel>
                <FormDescription>O campo será obrigatório no formulário</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="multiple"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Múltiplas imagens?</FormLabel>
                <FormDescription>Permitir o upload de múltiplas imagens</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}