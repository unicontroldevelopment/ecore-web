import { Separator } from "../ui/separator";
import FormElements from "./FormElements";
import SiderBarBtnElement from "./SidebarBtnElement";

function FormElementsSidebar() {
  return (
    <div>
      <p className="text-sm text-foreground/70">Drag and Drop Elementos</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 space-y place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">Elementos para Layout</p>
        <SiderBarBtnElement formElement={FormElements.TitleField} />
        <SiderBarBtnElement formElement={FormElements.SubTitleField} />
        <SiderBarBtnElement formElement={FormElements.ParagraphField} />
        <SiderBarBtnElement formElement={FormElements.SeparatorField} />
        <SiderBarBtnElement formElement={FormElements.SpacerField} />
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">Elementos para Preencher</p>
        <SiderBarBtnElement formElement={FormElements.TextField} />
        <SiderBarBtnElement formElement={FormElements.NumberField} />
        <SiderBarBtnElement formElement={FormElements.TextAreaField} />
        <SiderBarBtnElement formElement={FormElements.DateField} />
        <SiderBarBtnElement formElement={FormElements.SelectField} />
        <SiderBarBtnElement formElement={FormElements.CheckboxField} />
        <SiderBarBtnElement formElement={FormElements.EmojiField} />
        <SiderBarBtnElement formElement={FormElements.ImagesField} />
      </div>
    </div>
  );
}

export default FormElementsSidebar;
