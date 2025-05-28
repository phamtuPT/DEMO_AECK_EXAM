import actionTypes from "./actions/actionTypes";

export const chooseAnswer = (answer) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.CHOOSE_ANSWER,
      payload: answer,
    });
  } catch (e) {
    console.log(e);
  }
};

//  selectQuestion la function lua chon cau hoi hien tai cho dang
//  data arr trong 1 object

export const selectGroupQuestion = (id) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SELECT_GROUP_QUESTION,
      payload: id,
    });
  } catch (e) {
    console.log(e);
  }
};

//  selectQuestion la function lua chon cau hoi hien tai cho dang
//  data single arr
export const selectQuestion = (index) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SELECT_QUESTION,
      payload: index,
    });
  } catch (e) {
    console.log(e);
  }
};

export const totalQuestion = (number) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.NUMBER_OF_QUESTION,
      payload: number,
    });
  } catch (e) {
    console.log(e);
  }
};

export const submitAnswer = (score) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SUBMIT_ANSWER,
      payload: score,
    });
  } catch (e) {
    console.log(e);
  }
};

export const timeTodo = (time) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.TIME_TODO,
      payload: time,
    });
  } catch (e) {
    console.log(e);
  }
};

// Exam

export const chooseExam = (title) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.CHOOSE_EXAM,
      payload: title,
    });
  } catch (e) {
    console.log(e);
  }
};

export const chooseExamTime = (time) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.CHOOSE_EXAM_TIME,
      payload: time,
    });
  } catch (e) {
    console.log(e);
  }
};

export const clearData = (data) => (dispatch) => {
  try {
    dispatch({
      type: actionTypes.CLEAR_DATA,
      payload: data,
    });
  } catch (e) {
    console.log(e);
  }
};
