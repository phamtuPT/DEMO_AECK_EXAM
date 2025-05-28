import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { Button } from "antd";
import { chooseAnswer } from "../../store/Exam/thunk";
import { components } from "../../styles";
import TitleQues from "../question/TitleQues";

const ContextTrueFalse = (props) => {
  const { data, ordinalNumber } = props;
  const { question } = data;
  const dispatch = useDispatch();

  const allAnswers = useSelector((state) => state.examReducer.answers);
  const yourAnswer = [...allAnswers];

  const currentAns = yourAnswer?.find(
    ({ answerId }) => answerId === data.ordinalNumber
  );

  const handleChooseAns = (questionData, ans) => {
    const chooseAns = {
      groupId: data.groupId,
      answerId: data.ordinalNumber,
      answer: [{ id: questionData.id, answer: ans, isChildrenSelected: true }],
      isSelected: true,
      isConfuse: false,
    };

    const existingAnswerIndex = yourAnswer.findIndex(
      ({ answerId }) => answerId === data.ordinalNumber
    );
    // Check current answer has been selected or not
    if (existingAnswerIndex !== -1) {
      yourAnswer[existingAnswerIndex] = {
        ...yourAnswer[existingAnswerIndex],
        isSelected: true,
      };
      let draftArr = [...yourAnswer[existingAnswerIndex].answer];
      const existingObj = draftArr.find(({ id }) => id === questionData.id);
      const key = draftArr.findIndex(({ id }) => id === questionData.id);
      // Check current answer children has been selected or not
      if (existingObj) {
        const draftAnswer = {
          id: questionData.id,
          answer: ans,
          isChildrenSelected: true,
        };
        draftArr.splice(key, 1, draftAnswer);
      } else {
        draftArr.push({
          id: questionData.id,
          answer: ans,
          isChildrenSelected: true,
        });
      }
      yourAnswer[existingAnswerIndex].answer = draftArr;
    } else {
      yourAnswer.push(chooseAns);
    }
    dispatch(chooseAnswer([...yourAnswer]));
  };

  const renderAnswer = () => {
    const arr = [];
    for (let i = 0; i < question.length; i++) {
      arr.push(
        <li key={i} className="flex gap-2 items-center justify-between py-2">
          {question[i].questionContent}
          <div className="flex gap-2 ">
            <Button
              className={
                currentAns?.answer[i]?.isChildrenSelected &&
                currentAns?.answer[i]?.answer === "True"
                  ? components.btnAnsBlue
                  : components.btnAnsDefault
              }
              onClick={() => handleChooseAns(question[i], "True")}
            ></Button>
            <Button
              className={
                currentAns?.answer[i]?.isChildrenSelected &&
                currentAns?.answer[i]?.answer === "False"
                  ? components.btnAnsBlue
                  : components.btnAnsDefault
              }
              onClick={() => handleChooseAns(question[i], "False")}
            ></Button>
          </div>
        </li>
      );
    }
    return arr;
  };

  return (
    <section className={props.className}>
      <TitleQues ordinalNumber={ordinalNumber} data={data} />
      <div className="flex gap-4">
        <div className="w-8"></div>
        <div className="grow">
          <div className="flex justify-between">
            <div></div>
            <div className="flex gap-2">
              <h3 className="w-8">True</h3>
              <h3 className="w-8">False</h3>
            </div>
          </div>
          <ul>{renderAnswer()}</ul>
        </div>
      </div>
    </section>
  );
};

export default ContextTrueFalse;
