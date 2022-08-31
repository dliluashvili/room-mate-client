import { axiosHeaderConfig } from "../api";
import { axiosWithToken } from "../axios-with-token";
import axios, { AxiosPromise } from "axios";
import { backEndRoutes } from "../backend-routes";

export interface ISearchItems {
  age: number;
  firstname: string;
  id: number;
  payed: boolean;
  suitableDistricts: string[];
  suitablePrices: string[];
  users_is_locked_communication: boolean;
  isFavourite: boolean;
  about_me: string;
  profile_image: string;
  favourite_id?: number;
}

interface IMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
}
export interface ISearchResults {
  data: ISearchItems[];
  meta: IMeta;
}

export interface IUserProfile {
  about_me: string;
  age: number;
  email: string | null;
  phone: string | null;
  social_network: string | null;
  firstname: string;
  lastname: string;
  id: number;
  payed: boolean;
  is_locked_communication?: boolean;
  profile_image?: string;
  answeredAnswers: {
    answer_id: number;
    id: number;
    question_id: number;
    user_id: number;
  }[];
}

export interface INotificationReceiver {
  id: number;
  sender_firstname?: string;
  sender_lastname?: string;
  status: number;
  sender_id?: number;
}

export interface INotificationSent {
  id: number;
  receiver_firstname?: string;
  receiver_lastname?: string;
  status: number;
  receiver_id?: number;
}
class _ProfileService {
  getUser = (token: string): AxiosPromise => {
    return axiosWithToken.get(backEndRoutes.profile.getUser(token));
  };

  search = (data: any): AxiosPromise<ISearchResults> => {
    return axiosWithToken.get(backEndRoutes.profile.search(), {
      params: data,
    });
  };

  getUserById = (id: string): AxiosPromise<IUserProfile> => {
    return axiosWithToken.get(backEndRoutes.profile.getUserById(id));
  };

  getFavorites = ({
    lang,
  }): AxiosPromise<{ data: ISearchItems[]; meta: IMeta }> => {
    return axiosWithToken.get(backEndRoutes.profile.getFavorites(), {
      params: {
        locale: lang,
      },
    });
  };

  getSentNotifications = (): AxiosPromise<INotificationSent[]> => {
    return axiosWithToken.get(backEndRoutes.profile.getSentNotifications());
  };

  getReceivedNotifications = (): AxiosPromise<INotificationReceiver[]> => {
    return axiosWithToken.get(backEndRoutes.profile.getReceivedNotifications());
  };

  addRemoveFavorites = (id: number): AxiosPromise<IUserProfile> => {
    return axiosWithToken.post(backEndRoutes.profile.addRemoveFavorites(), {
      favourite_id: id,
    });
  };

  addContactRequest = (id: number): AxiosPromise<IUserProfile> => {
    return axiosWithToken.post(backEndRoutes.profile.addContactRequest(id), {
      favourite_id: id,
    });
  };

  deleteContactRequest = (id: number): AxiosPromise<IUserProfile> => {
    return axiosWithToken.delete(
      backEndRoutes.profile.removeContactRequest(id)
    );
  };

  approveRejectContact = (
    id: number,
    data: { senderId: number; answer: 2 | 3 }
  ): AxiosPromise<any> => {
    return axiosWithToken.post(
      backEndRoutes.profile.approveRejectContact(id),
      data
    );
  };

  updateLockCommunication = (locked: boolean): AxiosPromise<any> => {
    return axiosWithToken.patch(
      backEndRoutes.profile.updateLockCommunication(),
      {
        locked,
      }
    );
  };

  updateAvailable = (available: boolean): AxiosPromise<any> => {
    return axiosWithToken.patch(backEndRoutes.profile.updateAvailable(), {
      available,
    });
  };

  uploadImage = (data: any): AxiosPromise<any> => {
    return axiosWithToken.patch(backEndRoutes.profile.uploadImage(), data);
  };

  contactForm = (data: {
    firstname: string;
    lastname: string;
    email: string;
    text: string;
  }): AxiosPromise<any> => {
    return axios.post(backEndRoutes.profile.contactForm(), data);
  };
}

export const ProfileService = new _ProfileService();
