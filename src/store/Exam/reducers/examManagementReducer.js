import { produce } from "immer";
import examActionTypes from "../actions/examActionTypes";

const initialState = {
  exams: [],
  selectedExam: null,
  filters: {
    status: "",
    difficulty: "",
    subject: ""
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

const examManagementReducer = (state = initialState, { type, payload }) => {
  return produce(state, (draft) => {
    switch (type) {
      // Create Exam
      case examActionTypes.CREATE_EXAM_REQUEST:
        draft.loading.create = true;
        draft.errors.create = null;
        draft.success.create = false;
        break;
        
      case examActionTypes.CREATE_EXAM_SUCCESS:
        draft.loading.create = false;
        draft.exams.push(payload);
        draft.success.create = true;
        break;
        
      case examActionTypes.CREATE_EXAM_FAILURE:
        draft.loading.create = false;
        draft.errors.create = payload;
        draft.success.create = false;
        break;

      // Get Exams
      case examActionTypes.GET_EXAMS_REQUEST:
        draft.loading.read = true;
        draft.errors.read = null;
        break;
        
      case examActionTypes.GET_EXAMS_SUCCESS:
        draft.loading.read = false;
        draft.exams = payload;
        break;
        
      case examActionTypes.GET_EXAMS_FAILURE:
        draft.loading.read = false;
        draft.errors.read = payload;
        break;

      // Update Exam
      case examActionTypes.UPDATE_EXAM_REQUEST:
        draft.loading.update = true;
        draft.errors.update = null;
        draft.success.update = false;
        break;
        
      case examActionTypes.UPDATE_EXAM_SUCCESS:
        draft.loading.update = false;
        const updateIndex = draft.exams.findIndex(exam => exam.id === payload.id);
        if (updateIndex !== -1) {
          draft.exams[updateIndex] = payload;
        }
        draft.success.update = true;
        break;
        
      case examActionTypes.UPDATE_EXAM_FAILURE:
        draft.loading.update = false;
        draft.errors.update = payload;
        draft.success.update = false;
        break;

      // Delete Exam
      case examActionTypes.DELETE_EXAM_REQUEST:
        draft.loading.delete = true;
        draft.errors.delete = null;
        draft.success.delete = false;
        break;
        
      case examActionTypes.DELETE_EXAM_SUCCESS:
        draft.loading.delete = false;
        draft.exams = draft.exams.filter(exam => exam.id !== payload);
        draft.success.delete = true;
        break;
        
      case examActionTypes.DELETE_EXAM_FAILURE:
        draft.loading.delete = false;
        draft.errors.delete = payload;
        draft.success.delete = false;
        break;

      // Question Management
      case examActionTypes.ADD_QUESTION_TO_EXAM:
        const examToAddQuestion = draft.exams.find(exam => exam.id === payload.examId);
        if (examToAddQuestion && !examToAddQuestion.questionIds.includes(payload.questionId)) {
          examToAddQuestion.questionIds.push(payload.questionId);
          examToAddQuestion.totalQuestions = examToAddQuestion.questionIds.length;
        }
        break;
        
      case examActionTypes.REMOVE_QUESTION_FROM_EXAM:
        const examToRemoveQuestion = draft.exams.find(exam => exam.id === payload.examId);
        if (examToRemoveQuestion) {
          examToRemoveQuestion.questionIds = examToRemoveQuestion.questionIds.filter(
            id => id !== payload.questionId
          );
          examToRemoveQuestion.totalQuestions = examToRemoveQuestion.questionIds.length;
        }
        break;

      // UI States
      case examActionTypes.SET_SELECTED_EXAM:
        draft.selectedExam = payload;
        break;
        
      case examActionTypes.SET_EXAM_FILTER:
        draft.filters = { ...draft.filters, ...payload };
        break;
        
      case examActionTypes.CLEAR_EXAM_ERRORS:
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

export default examManagementReducer;
