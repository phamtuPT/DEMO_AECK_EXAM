import { produce } from "immer";
import actionTypes from "../actions/actionTypes";

const initialState = {
  questions: [],
  selectedQuestion: null,
  filters: {
    subject: "",
    difficulty: "",
    type: ""
  },
  loading: {
    create: false,
    read: false,
    update: false,
    delete: false
  },
  errors: {
    create: null,
    read: null,
    update: null,
    delete: null
  },
  success: {
    create: false,
    update: false,
    delete: false
  }
};

const reducer = (state = initialState, { type, payload }) => {
  return produce(state, (draft) => {
    switch (type) {
      // Create Question
      case actionTypes.CREATE_QUESTION_REQUEST:
        draft.loading.create = true;
        draft.errors.create = null;
        draft.success.create = false;
        break;
        
      case actionTypes.CREATE_QUESTION_SUCCESS:
        draft.loading.create = false;
        draft.questions.push(payload);
        draft.success.create = true;
        break;
        
      case actionTypes.CREATE_QUESTION_FAILURE:
        draft.loading.create = false;
        draft.errors.create = payload;
        draft.success.create = false;
        break;

      // Get Questions
      case actionTypes.GET_QUESTIONS_REQUEST:
        draft.loading.read = true;
        draft.errors.read = null;
        break;
        
      case actionTypes.GET_QUESTIONS_SUCCESS:
        draft.loading.read = false;
        draft.questions = payload;
        break;
        
      case actionTypes.GET_QUESTIONS_FAILURE:
        draft.loading.read = false;
        draft.errors.read = payload;
        break;

      // Update Question
      case actionTypes.UPDATE_QUESTION_REQUEST:
        draft.loading.update = true;
        draft.errors.update = null;
        draft.success.update = false;
        break;
        
      case actionTypes.UPDATE_QUESTION_SUCCESS:
        draft.loading.update = false;
        const updateIndex = draft.questions.findIndex(q => q.id === payload.id);
        if (updateIndex !== -1) {
          draft.questions[updateIndex] = payload;
        }
        draft.success.update = true;
        break;
        
      case actionTypes.UPDATE_QUESTION_FAILURE:
        draft.loading.update = false;
        draft.errors.update = payload;
        draft.success.update = false;
        break;

      // Delete Question
      case actionTypes.DELETE_QUESTION_REQUEST:
        draft.loading.delete = true;
        draft.errors.delete = null;
        draft.success.delete = false;
        break;
        
      case actionTypes.DELETE_QUESTION_SUCCESS:
        draft.loading.delete = false;
        draft.questions = draft.questions.filter(q => q.id !== payload);
        draft.success.delete = true;
        break;
        
      case actionTypes.DELETE_QUESTION_FAILURE:
        draft.loading.delete = false;
        draft.errors.delete = payload;
        draft.success.delete = false;
        break;

      // UI States
      case actionTypes.SET_SELECTED_QUESTION:
        draft.selectedQuestion = payload;
        break;
        
      case actionTypes.SET_QUESTION_FILTER:
        draft.filters = { ...draft.filters, ...payload };
        break;
        
      case actionTypes.CLEAR_QUESTION_ERRORS:
        draft.errors = {
          create: null,
          read: null,
          update: null,
          delete: null
        };
        draft.success = {
          create: false,
          update: false,
          delete: false
        };
        break;

      default:
        break;
    }
    
    return draft;
  });
};

export default reducer;
