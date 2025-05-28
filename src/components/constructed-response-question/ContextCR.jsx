import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { components } from "../../styles";
import { useSelector, useDispatch } from "react-redux";
import { chooseAnswer } from "../../store/Exam/thunk";
import { Input, Tooltip, Button } from "antd";
import TitleQues from "../question/TitleQues";

const ContextCR = (props) => {
  const { data, ordinalNumber } = props;
  const allAnswers = useSelector((state) => state.examReducer.answers);
  const yourAnswer = [...allAnswers];

  const currentAns = yourAnswer?.find(
    ({ answerId }) => answerId === data.ordinalNumber
  );
  const questionContent = data.question.split(/\[\[(\d+)\]\]/).filter(Boolean);

  const number = data.question.match(/\d+/g).map(Number);

  const dispatch = useDispatch();

  // answer default ["-1","-1",...]
  const [answer, setAnswer] = useState([]);

  useEffect(() => {
    const answerDefault = [...answer];
    if (!currentAns) {
      number.map((item, i) => answerDefault.splice(i, 1, "-1"));
      setAnswer(answerDefault);
    } else {
      number.map((item, i) =>
        currentAns.answer[i] === "-1" || currentAns.answer[i] === ""
          ? answerDefault.splice(i, 1, "-1")
          : answerDefault.splice(i, 1, currentAns.answer[i])
      );
      setAnswer(answerDefault);
    }
    return () => {
      setAnswer([""]);
    };
  }, [currentAns, ordinalNumber]);

  const handleOnChange = (e) => {
    const newAns = [...answer];
    const { value, name } = e.target;
    number.map((item, i) => {
      if (name !== `answer${i + 1}`) {
        return;
      } else {
        newAns.splice(i, 1, value);
        setAnswer(newAns);
        handleChooseAns(newAns);
      }
    });
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
  const renderQuestion = () => {
    // Use variable j to synchronize blankId in client with server
    let j = 0;
    return questionContent.map((item, i) => {
      if (!isNaN(item)) {
        j++;
        return (
          <Input
            onChange={handleOnChange}
            className="w-[200px]"
            key={i}
            name={`answer${j}`}
            value={
              answer[j - 1] !== "-1" && answer[j - 1] ? answer[j - 1] : ""
            }
          />
        );
      } else {
        return item;
      }
    });
  };

  return (
    <section className={clsx(props.className)}>
      <TitleQues ordinalNumber={ordinalNumber} data={data} />
      <div className="flex gap-2">
        <div className="w-8"></div>
        <div className=" flex items-center flex-wrap gap-2 p-4 align-middle">
          {renderQuestion()}
        </div>
      </div>
    </section>
  );
};

export default ContextCR;
