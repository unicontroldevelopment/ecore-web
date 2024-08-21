import { DateInput } from "./DateInput";
import { Input } from "./Input";
import { InputRoot } from "./InputRoot";
import { InputSelect } from "./InputWithSelect";
import { LongInputExpanded } from "./LongInputExpanded";
import { LongInput } from "./LongInputW";
import { LongText } from "./LongText";
import { CustomSelect } from "./Select";
import { CustomUpload } from "./Upload";

export const CustomInput = {
  Select: CustomSelect,
  Input: Input,
  Root: InputRoot,
  LongText: LongText,
  LongInput: LongInput,
  LongExpanded: LongInputExpanded,
  DateInput: DateInput,
  Upload: CustomUpload,
  InputWithSelect: InputSelect
};
