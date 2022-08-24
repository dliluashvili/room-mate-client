import { combineReducers } from "redux";
import { profileReducer } from "./profileReducer";

const reducers = combineReducers({
  profile: profileReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
