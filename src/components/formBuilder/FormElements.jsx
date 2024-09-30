import { CheckboxFieldFormElement } from "./elements/CheckboxField";
import { DateFieldFormElement } from "./elements/DateField";
import { EmojiFieldFormElement } from "./elements/EmojiField";
import { NumberFieldFormElement } from "./elements/NumberField";
import { ParagraphFieldFormElement } from "./elements/Paragraph";
import { SelectFieldFormElement } from "./elements/SelectField";
import { SeparatorFieldFormElement } from "./elements/SeparatorField";
import { SpacerFieldFormElement } from "./elements/SpacerField";
import { SubTitleFieldFormElement } from "./elements/SubtitleField";
import { TextAreaFieldFormElement } from "./elements/TextAreaField";
import { TextFieldFormElement } from "./elements/TextField";
import { TitleFieldFormElement } from "./elements/TitleField";

const FormElements = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  EmojiField: EmojiFieldFormElement,
};

export default FormElements;
