import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { Button } from "antd";
import { chooseAnswer } from "../../store/Exam/thunk";
import clsx from "clsx";
import { components } from "../../styles";
import TitleQues from "../question/TitleQues";
import LaTeXRenderer from "../LaTeXRenderer";

const ContextSingle = (props) => {
  const { data, ordinalNumber } = props;
  const dispatch = useDispatch();

  const allAnswers = useSelector((state) => state.examReducer.answers);
  const yourAnswer = [...allAnswers];
  const optionKeys = Object.keys(data.options);
  const optionValues = Object.values(data.options);

  // Select answer data of component to render answer

  const currentAns = yourAnswer?.find(
    ({ answerId }) => answerId === data.ordinalNumber
  );

  const renderAnswer = () => {
    const arr = [];
    for (let i = 0; i < optionKeys.length; i++) {
      arr.push(
        <li key={i} className="flex gap-2 items-center py-2">
          <Button
            onClick={() => handleChooseAns(optionKeys[i])}
            className={clsx(
              currentAns?.isSelected &&
                currentAns?.answer.indexOf(optionKeys[i]) !== -1
                ? components.btnAnsBlue
                : components.btnAnsDefault,
              "uppercase rounded-full"
            )}
          >
            {optionKeys[i]}
          </Button>
          <div><LaTeXRenderer>{optionValues[i]}</LaTeXRenderer></div>
        </li>
      );
    }
    return arr;
  };

  const handleChooseAns = (ans) => {
    const chooseAns = {
      groupId: data.groupId,
      answerId: data.ordinalNumber,
      answer: ans,
      isSelected: true,
      isConfuse: false,
    };
    const existingAnswerIndex = yourAnswer.findIndex(
      ({ answerId }) => answerId === data.ordinalNumber
    );
    if (existingAnswerIndex !== -1) {
      yourAnswer[existingAnswerIndex] = {
        ...yourAnswer[existingAnswerIndex],
        isSelected: true,
        answer: ans,
      };
    } else {
      yourAnswer.push(chooseAns);
    }
    dispatch(chooseAnswer([...yourAnswer]));
  };

  return (
    <section className={props.className}>
      <TitleQues ordinalNumber={ordinalNumber} data={data} />
      <div><LaTeXRenderer>{data.question}</LaTeXRenderer></div>
      <div className="flex gap-4">
        <div className="w-8"></div>
        <ul>{renderAnswer()}</ul>
      </div>
    </section>
  );
};

export default ContextSingle;
