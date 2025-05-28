import React, { useState, useEffect } from "react";
import _ from "lodash";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { chooseAnswer } from "../store/Exam/thunk";
import { Button, Tooltip } from "antd";
import { components } from "../styles";
import { FlagOutlined } from "@ant-design/icons";

const QuestionContent = ({ data, index }) => {
  const dispatch = useDispatch();
  const optionKeys = Object.keys(data.options);
  const optionValues = Object.values(data.options);

  const answers = useSelector((state) => state.examReducer.answers);

  const [isSelected, setIsSelected] = useState(false);
  const [isConfuse, setIsConfuse] = useState(false);
  const [currentAns, setCurrentAns] = useState("");
  const yourAns = [...answers];
  const CAns = yourAns.find(({ id }) => id === data.id);
  const handleChooseAns = (ans) => {
    // ans is object
    const answer = {
      id: data.id,
      // index of Element in arr question
      indexAns: index,
      options: ans,
      isSelected: true,
      isConfuse: false,
    };
    const existingAnswerIndex = yourAns.findIndex(({ id }) => id === data.id);
    if (existingAnswerIndex !== -1) {
      yourAns[existingAnswerIndex] = {
        ...yourAns[existingAnswerIndex],
        isSelected: true,
      };
      let draftObj = { ...yourAns[existingAnswerIndex].options };
      let key = Object.keys(ans);
      // kiểm tra đã có đáp án đó hay chưa, nếu có thì thay thế, không có thì bổ sung
      if (_.has(yourAns[existingAnswerIndex].options, key)) {
        draftObj = _.omit(draftObj, Object.keys(ans));
      } else {
        draftObj = Object.assign(draftObj, ans);
      }
      yourAns[existingAnswerIndex].options = draftObj;
      if (Object.keys(yourAns[existingAnswerIndex].options).length < 1) {
        yourAns[existingAnswerIndex] = {
          ...yourAns[existingAnswerIndex],
          isSelected: false,
        };
      }
      // console.log();
    } else {
      yourAns.push(answer);
    }
    dispatch(chooseAnswer([...yourAns]));
  };
  const handleConfuse = () => {
    const answer = {
      id: data.id,
      indexAns: index,
      isConfuse: true,
    };
    const existingAnswerIndex = yourAns.findIndex(({ id }) => id === data.id);
    if (existingAnswerIndex !== -1) {
      if (yourAns[existingAnswerIndex].isConfuse) {
        yourAns[existingAnswerIndex] = {
          ...yourAns[existingAnswerIndex],
          isConfuse: false,
        };
        setIsConfuse(false);
      } else {
        yourAns[existingAnswerIndex] = {
          ...yourAns[existingAnswerIndex],
          isConfuse: true,
        };
        setIsConfuse(true);
      }
    } else {
      yourAns.push(answer);
      setIsConfuse(true);
    }
    dispatch(chooseAnswer([...yourAns]));
  };

  // RENDER DATA ANSWER AFTER CHANGE QUESTION
  useEffect(() => {
    if (answers) {
      const answer = yourAns.find(({ id }) => id === data.id);
      if (answer?.isSelected) {
        setIsSelected(true);
        setCurrentAns(answer?.options);
      }
      if (answer?.isConfuse) {
        setIsConfuse(true);
      }
    }
    return () => {
      setIsSelected(false);
      setIsConfuse(false);
    };
  }, [answers, data]);

  let answerArea = () => {
    const arr = [];
    for (let i = 0; i < optionKeys.length; i++) {
      arr.push(
        <li key={i} className="flex gap-2 items-center py-2">
          <Button
            onClick={() =>
              handleChooseAns({ [optionKeys[i]]: optionValues[i] })
            }
            className={clsx(
              isSelected && _.has(CAns?.options, optionKeys[i])
                ? components.btnAnsBlue
                : components.btnAnsDefault,
              "uppercase"
            )}
          >
            {optionKeys[i]}
          </Button>
          <div>{optionValues[i]}</div>
        </li>
      );
    }
    return arr;
  };

  return (
    <section className="flex items-start justify-between pt-3 px-6 gap-4">
      <Button className={clsx(components.btnAnsCurrent)}>{index + 1}</Button>
      <div className="text-start grow">
        <div>{data.question}</div>
        <ul>{answerArea()}</ul>
      </div>

      <Tooltip placement="top" title="Đánh dấu câu trả lời chưa chắc chắn">
        <Button
          onClick={handleConfuse}
          className={clsx(
            isConfuse ? components.btnAnsYellow : components.btnAnsDefault
          )}
        >
          <FlagOutlined />
        </Button>
      </Tooltip>
    </section>
  );
};

export default QuestionContent;
