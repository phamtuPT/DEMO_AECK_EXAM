import { produce } from "immer";
import actionTypes from "../actions/actionTypes";
const initialState = {
  answers: [],
  questionSelected: 0,
  groupQuestionSelected: 1,
  score: 0,
  time: 0,
  nameOfExam: "",
  timeOfExam: 0,
  numberOfQuestion: 0,
};

const reducer = (state = initialState, { type, payload }) => {
  return produce(state, (draft) => {
    if (type === actionTypes.CHOOSE_ANSWER) {
      draft.answers = payload;
    } else if (type === actionTypes.SELECT_QUESTION) {
      draft.questionSelected = payload;
    } else if (type === actionTypes.SELECT_GROUP_QUESTION) {
      draft.groupQuestionSelected = payload;
    } else if (type === actionTypes.SUBMIT_ANSWER) {
      draft.score = payload;
    } else if (type === actionTypes.TIME_TODO) {
      draft.time = payload;
    } else if (type === actionTypes.CHOOSE_EXAM) {
      draft.nameOfExam = payload;
    } else if (type === actionTypes.CHOOSE_EXAM_TIME) {
      draft.timeOfExam = payload;
    } else if (type === actionTypes.NUMBER_OF_QUESTION) {
      draft.numberOfQuestion = payload;
    } else if (type === actionTypes.CLEAR_DATA) {
      return (draft = initialState);
    }
    return draft;
  });
};
export default reducer;
