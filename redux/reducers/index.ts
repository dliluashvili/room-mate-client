import { combineReducers } from "redux";
import { profileReducer } from "./profileReducer";
import { loadingReducer } from "./loadingReducer";

const reducers = combineReducers({
  profile: profileReducer,
  loading: loadingReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
