import examActionTypes from "../actions/examActionTypes";
import mockDatabase from "../../../data/mockDatabase.js";

export const createExam = (examData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: examActionTypes.CREATE_EXAM_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const exams = mockDatabase.getExams();
      const newExam = {
        ...examData,
        id: mockDatabase.getNextId('exam'),
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: "admin",
        totalQuestions: examData.questionIds?.length || 0,
      };

      exams.push(newExam);
      mockDatabase.saveExams(exams);

      dispatch({
        type: examActionTypes.CREATE_EXAM_SUCCESS,
        payload: newExam
      });

      return { success: true, data: newExam };
    } catch (error) {
      dispatch({
        type: examActionTypes.CREATE_EXAM_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const getExams = (filters = {}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: examActionTypes.GET_EXAMS_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      let exams = mockDatabase.getExams();

      // Apply filters
      if (filters.status) {
        exams = exams.filter(exam => exam.status === filters.status);
      }
      if (filters.difficulty) {
        exams = exams.filter(exam => exam.difficulty === filters.difficulty);
      }
      if (filters.subject) {
        exams = exams.filter(exam => exam.subject === filters.subject);
      }

      dispatch({
        type: examActionTypes.GET_EXAMS_SUCCESS,
        payload: exams
      });

      return { success: true, data: exams };
    } catch (error) {
      dispatch({
        type: examActionTypes.GET_EXAMS_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const updateExam = (id, examData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: examActionTypes.UPDATE_EXAM_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const exams = mockDatabase.getExams();
      const examIndex = exams.findIndex(exam => exam.id === id);
      if (examIndex === -1) {
        throw new Error("Đề thi không tồn tại");
      }

      exams[examIndex] = {
        ...exams[examIndex],
        ...examData,
        totalQuestions: examData.questionIds?.length || exams[examIndex].totalQuestions,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      mockDatabase.saveExams(exams);

      dispatch({
        type: examActionTypes.UPDATE_EXAM_SUCCESS,
        payload: exams[examIndex]
      });

      return { success: true, data: exams[examIndex] };
    } catch (error) {
      dispatch({
        type: examActionTypes.UPDATE_EXAM_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const deleteExam = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: examActionTypes.DELETE_EXAM_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const exams = mockDatabase.getExams();
      const examIndex = exams.findIndex(exam => exam.id === id);
      if (examIndex === -1) {
        throw new Error("Đề thi không tồn tại");
      }

      exams.splice(examIndex, 1);
      mockDatabase.saveExams(exams);

      dispatch({
        type: examActionTypes.DELETE_EXAM_SUCCESS,
        payload: id
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: examActionTypes.DELETE_EXAM_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const addQuestionToExam = (examId, questionId) => ({
  type: examActionTypes.ADD_QUESTION_TO_EXAM,
  payload: { examId, questionId }
});

export const removeQuestionFromExam = (examId, questionId) => ({
  type: examActionTypes.REMOVE_QUESTION_FROM_EXAM,
  payload: { examId, questionId }
});

export const setSelectedExam = (exam) => ({
  type: examActionTypes.SET_SELECTED_EXAM,
  payload: exam
});

export const setExamFilter = (filters) => ({
  type: examActionTypes.SET_EXAM_FILTER,
  payload: filters
});

export const clearExamErrors = () => ({
  type: examActionTypes.CLEAR_EXAM_ERRORS
});
