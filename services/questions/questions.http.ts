import { axiosHeaderConfig } from "../api";
import { axiosWithToken } from "../axios-with-token";

import axios, { AxiosPromise } from "axios";
import { backEndRoutes } from "../backend-routes";

export type IQuestions = {
  id: number;
  type: "choice" | "free-text" | "password" | "text" | "textarea";
  title: string;
  name?: string;
  description: string;
  user_property: boolean;
  position: number;
  is_multiple?: boolean;
  is_searchable?: boolean;
  searchable_title?: string;
  search_type?: "choice" | "range";
  answers?: {
    id: number;
    real_id: number;
    title: string;
    question_id: number;
    active: boolean;
  }[];
};

class _Questions {
  getQuestions = (): AxiosPromise<IQuestions[]> => {
    return axios.get(backEndRoutes.questions.getQuestions());
  };

  saveAnswers = (answers: any): AxiosPromise => {
    return axios.post(backEndRoutes.questions.saveAnswers(), answers);
  };

  updateAnswers = (answers: any): AxiosPromise => {
    return axiosWithToken.patch(
      backEndRoutes.questions.updateAnswers(),
      answers
    );
  };

  checkPhone = (phone: any): AxiosPromise => {
    return axios.post(backEndRoutes.questions.checkPhone(), { phone });
  };

  checkSmsCode = (data: { phone: string; code: any }): AxiosPromise => {
    return axios.post(backEndRoutes.questions.checkSmsCode(), data);
  };
}

export const Questions = new _Questions();
