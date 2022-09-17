import { EActionTypes } from "../action-types";
import { TActions } from "../actions";

interface IAnsweredAnswers {
  answer_id: number;
  id: number;
  question_id: number;
  user_id: number;
}

interface IUser {
  age?: number;
  email?: string | null;
  firstname?: string;
  lastname?: string;
  id?: number;
  about_me?: string;
  available?: boolean;
  payed?: boolean;
  phone?: string;
  profile_image?: string;
  notifications?: number;
  social_network?: string;
  is_locked_communication?: boolean;
  answeredAnswers: IAnsweredAnswers[];
  socials?: string[];
  has_flat?: boolean;
}

interface ISearchReducer {
  user: IUser | null;
}

const InitState: ISearchReducer = {
  user: null,
};

export const profileReducer = (
  state: ISearchReducer = InitState,
  action: TActions
): ISearchReducer => {
  switch (action.type) {
    case EActionTypes.SET_USER_ACTION:
      return { user: action.payload ? { ...action.payload } : null };

    case EActionTypes.LOGOUT:
      return {
        user: null,
      };

    default:
      return state;
  }
};
