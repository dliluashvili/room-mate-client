import { EActionTypes } from "../action-types";

export interface SET_USER_ACTION {
  type: EActionTypes.SET_USER_ACTION;
  payload: any;
}

export interface LOGOUT {
  type: EActionTypes.LOGOUT;
}

// export interface SEARCH_REPOSITORIES_SUCCESS_ACTION {
//   type: EActionTypes.SEARCH_REPOSITORIES_SUCCESS_ACTION;
//   payload: string[];
// }

// export interface SEARCH_REPOSITORIES_ERROR_ACTION {
//   type: EActionTypes.SEARCH_REPOSITORIES_ERROR_ACTION;
//   payload: string;
// }

export type TActions = SET_USER_ACTION | LOGOUT;
// | SET_USER_ACTION
// | SEARCH_REPOSITORIES_SUCCESS_ACTION
// | SEARCH_REPOSITORIES_ERROR_ACTION;
