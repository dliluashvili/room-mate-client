import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers/index";

// const composeEnhancers =
//   ((window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//     (window as any).__REDUX_DEVTOOLS_EXTENSION__()) ||
//   compose;

export const store = createStore(
  reducers,

  composeWithDevTools(applyMiddleware(thunk))
);
