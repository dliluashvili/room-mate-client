export interface TranslatableItem {
  translations: Translation[];
}

export interface Translation {
  lang: string;
  sex?: string;
  name?: string;
  title?: string;
}

export interface QuestionItemType extends TranslatableItem {
  id: string;
  translations: Translation[];
}

export interface FormDataType {
  [key: string]: any;
  age: string;
  genderId: string;
  countryId: string;
  code: string;
  phone: string;
}

export interface AnswerType extends TranslatableItem {
  id: string;
  translations: Translation[];
}

export interface Question extends TranslatableItem {
  id: string;
  uiFieldInfo: {
    input_type: {
      type: string;
    };
    required: boolean;
  };
  answers: AnswerType[];
}
