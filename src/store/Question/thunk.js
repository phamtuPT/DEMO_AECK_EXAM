import actionTypes from "./actions/actionTypes";
import mockDatabase from "../../data/mockDatabase.js";

// Mock data for demo
let mockQuestions = [
  {
    id: 1,
    type: "SingleAnswer",
    question: "Giải phương trình: $2x + 5 = 15$",
    options: {
      a: "$x = 5$",
      b: "$x = 7$",
      c: "$x = 8$",
      d: "$x = 10$"
    },
    correctAnswer: "a",
    difficulty: "easy",
    subject: "math_thinking",
    createdAt: "2024-01-15",
    createdBy: "admin"
  },
  {
    id: 2,
    type: "SingleAnswer",
    question: "Tính đạo hàm của hàm số: $f(x) = 3x^2 + 2x + 1$",
    options: {
      a: "$f'(x) = 6x + 2$",
      b: "$f'(x) = 6x + 1$",
      c: "$f'(x) = 3x^2 + 2x$",
      d: "$f'(x) = 6x$"
    },
    correctAnswer: "a",
    difficulty: "medium",
    subject: "math_thinking",
    createdAt: "2024-01-14",
    createdBy: "admin"
  }
];

let nextId = 3;

export const createQuestion = (questionData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.CREATE_QUESTION_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const questions = mockDatabase.getQuestions();
      const newQuestion = {
        ...questionData,
        id: mockDatabase.getNextId('question'),
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: "admin"
      };

      questions.push(newQuestion);
      mockDatabase.saveQuestions(questions);

      dispatch({
        type: actionTypes.CREATE_QUESTION_SUCCESS,
        payload: newQuestion
      });

      return { success: true, data: newQuestion };
    } catch (error) {
      dispatch({
        type: actionTypes.CREATE_QUESTION_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const getQuestions = (filters = {}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.GET_QUESTIONS_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      let questions = mockDatabase.getQuestions();

      // Apply filters
      if (filters.subject) {
        questions = questions.filter(q => q.subject === filters.subject);
      }
      if (filters.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty);
      }
      if (filters.type) {
        questions = questions.filter(q => q.type === filters.type);
      }

      dispatch({
        type: actionTypes.GET_QUESTIONS_SUCCESS,
        payload: questions
      });

      return { success: true, data: questions };
    } catch (error) {
      dispatch({
        type: actionTypes.GET_QUESTIONS_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const updateQuestion = (id, questionData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.UPDATE_QUESTION_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const questionIndex = mockQuestions.findIndex(q => q.id === id);
      if (questionIndex === -1) {
        throw new Error("Câu hỏi không tồn tại");
      }

      mockQuestions[questionIndex] = {
        ...mockQuestions[questionIndex],
        ...questionData,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      dispatch({
        type: actionTypes.UPDATE_QUESTION_SUCCESS,
        payload: mockQuestions[questionIndex]
      });

      return { success: true, data: mockQuestions[questionIndex] };
    } catch (error) {
      dispatch({
        type: actionTypes.UPDATE_QUESTION_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const deleteQuestion = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.DELETE_QUESTION_REQUEST });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const questionIndex = mockQuestions.findIndex(q => q.id === id);
      if (questionIndex === -1) {
        throw new Error("Câu hỏi không tồn tại");
      }

      mockQuestions.splice(questionIndex, 1);

      dispatch({
        type: actionTypes.DELETE_QUESTION_SUCCESS,
        payload: id
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: actionTypes.DELETE_QUESTION_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const setSelectedQuestion = (question) => ({
  type: actionTypes.SET_SELECTED_QUESTION,
  payload: question
});

export const setQuestionFilter = (filters) => ({
  type: actionTypes.SET_QUESTION_FILTER,
  payload: filters
});

export const clearQuestionErrors = () => ({
  type: actionTypes.CLEAR_QUESTION_ERRORS
});
