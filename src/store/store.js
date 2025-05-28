import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import examReducer from "./Exam/reducers/examReducer.js";
import examManagementReducer from "./Exam/reducers/examManagementReducer.js";
import authReducer from "./Auth/reducers/authReducer.js";
import questionReducer from "./Question/reducers/questionReducer.js";
const reducer = combineReducers({
  examReducer: examReducer,
  examManagementReducer: examManagementReducer,
  authReducer: authReducer,
  questionReducer: questionReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
