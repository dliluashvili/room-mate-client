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
  is_editable?: boolean;
  search_type?: "choice" | "range";
  answers?: {
    id: number;
    real_id: number;
    title: string;
    question_id: number;
    active: boolean;
    searchable_title?: string;
  }[];
};

class _Flats {
  getFlatFilters = ({ lang }: { lang: any }): AxiosPromise<any> => {
    return axios.get(backEndRoutes.flats.flatFilters(), {
      params: {
        locale: lang,
      },
    });
  };

  getFlats = (data: any): AxiosPromise<any> => {
    return axiosWithToken.get(backEndRoutes.flats.getFlats(), {
      params: {
        ...data,
      },
    });
  };

  getById = ({ lang, id }: { lang: any; id: number }): AxiosPromise<any> => {
    return axios.get(backEndRoutes.flats.getById(id), {
      params: {
        locale: lang,
      },
    });
  };

  showNumber = ({ user_id, flat_id }): AxiosPromise<any> => {
    return axios.post(backEndRoutes.flats.showNumber(), {
      type: "show_number",
      data: { user_id, flat_id },
    });
  };

  saveRemoveFlat = (flat_id): AxiosPromise<any> => {
    return axiosWithToken.post(backEndRoutes.flats.saveRemoveFlat(), {
      flat_id,
    });
  };

  getFavoriteFlats = (): AxiosPromise<any> => {
    return axiosWithToken.get(backEndRoutes.flats.getFavoriteFlats());
  };

  //   saveAnswers = (answers: any): AxiosPromise => {
  //     return axios.post(backEndRoutes.questions.saveAnswers(), answers);
  //   };

  //   updateAnswers = (answers: any): AxiosPromise => {
  //     return axiosWithToken.patch(
  //       backEndRoutes.questions.updateAnswers(),
  //       answers
  //     );
  //   };

  //   checkPhone = (phone: any): AxiosPromise => {
  //     return axios.post(backEndRoutes.questions.checkPhone(), { phone });
  //   };

  //   checkSmsCode = (data: { phone: string; code: any }): AxiosPromise => {
  //     return axios.post(backEndRoutes.questions.checkSmsCode(), data);
  //   };
}

export const Flats = new _Flats();
