import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chooseAnswer } from "../../store/Exam/thunk";
import { DndContext } from "@dnd-kit/core";
import Blank from "./Blank";
import Answer from "./Answer";
import TitleQues from "../question/TitleQues";

const ContextDragging = (props) => {
  const { data, ordinalNumber } = props;
  const allAnswers = useSelector((state) => state.examReducer.answers);
  const yourAnswer = [...allAnswers];

  const currentAns = yourAnswer?.find(
    ({ answerId }) => answerId === data.ordinalNumber
  );

  const questionContent = data.question.split(/\[\[(\d+)\]\]/).filter(Boolean);

  const number = data.question.match(/\d+/g).map(Number);

  const dispatch = useDispatch();

  const optionKeys = Object.keys(data.options);
  const optionValues = Object.values(data.options);

  const [activeKey, setActiveKey] = useState(null);
  const [isChangeAns, setIsChangeAns] = useState(false);
  const [answer, setAnswer] = useState([]);
  const [listAns, setListAns] = useState();
  useEffect(() => {
    const answerDefault = [...answer];
    if (!currentAns) {
      number.map((item, i) => answerDefault.splice(i, 1, "-1"));
      setAnswer(answerDefault);
      setListAns(optionKeys);
    } else {
      number.map((item, i) =>
        currentAns.answer[i] === "-1" || currentAns.answer[i] === ""
          ? answerDefault.splice(i, 1, "-1")
          : answerDefault.splice(i, 1, currentAns.answer[i])
      );
      setAnswer(answerDefault);
      const newList = [...optionKeys];
      setListAns(newList?.filter((x) => !currentAns.answer.includes(x)));
    }
  }, [allAnswers, ordinalNumber]);

  const renderQuestion = () => {
    // Use variable j to synchronize blankId in client with server
    let j = 0;
    return questionContent.map((item, i) => {
      if (!isNaN(item)) {
        j++;
        return (
          <Blank
            className={
              answer[j - 1] && answer[j - 1] !== "-1"
                ? " border-primary"
                : " h-[30px] border-borderDisable"
            }
            key={i}
            id={`blank${j}`}
          >
            {answer[j - 1] && answer[j - 1] !== "-1" ? (
              <Answer
                // className={"border-primary m-1"}
                id={answer[j - 1]}
                answerId={data.ordinalNumber}
                optionKey={answer[j - 1]}
                text={optionValues[optionKeys.indexOf(answer[j - 1])]}
              />
            ) : null}
          </Blank>
        );
      } else {
        return item;
      }
    });
  };
  const renderAnswer = () => {
    const arr = [];
    for (let i = 0; i < listAns?.length; i++) {
      arr.push(
        <Answer
          // id={`${data.answerId}${optionKeys[i]}`}
          // su dung index lam id ( id = 0 khong co tac dung)
          id={listAns[i]}
          answerId={data.ordinalNumber}
          key={i}
          optionKey={listAns[i]}
          text={optionValues[optionKeys.indexOf(listAns[i])]}
        />
      );
    }
    return arr;
  };
  const handleDragStart = (e) => {
    const { active } = e;
    const { id } = active;
    const found = answer.indexOf(id);
    if (found !== -1) {
      setIsChangeAns(true);
    }
    setActiveKey(id);
  };
  const handleDragOver = (e) => {
    const { active, over } = e;
  };
  const handleDragEnd = ({ over }) => {
    const newList = [...optionKeys];
    const newAns = [...answer];
    number.map((i) => {
      if (over?.id === `blank${i}`) {
        if (newAns[i - 1] && isChangeAns) {
          if (activeKey === answer[i - 1]) {
            setActiveKey(null);
            return;
          }
          let activeIndex = newAns.indexOf(activeKey);
          let swap = newAns[activeIndex];
          newAns[activeIndex] = newAns[i - 1];
          newAns[i - 1] = swap;
        } else {
          newAns.splice(i - 1, 1, activeKey);
        }
        setAnswer(newAns);
        setListAns(newList?.filter((x) => !newAns.includes(x)));
      }
    });
    handleChooseAns(newAns);

    setIsChangeAns(false);
    setActiveKey(null);
  };
  const handleChooseAns = (ans) => {
    // ans is object
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
        answer: ans,
      };
    } else {
      yourAnswer.push(chooseAns);
    }
    dispatch(chooseAnswer([...yourAnswer]));
  };
  return (
    <section className={props.className}>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <TitleQues ordinalNumber={ordinalNumber} data={data} />
        <div className="flex gap-4">
          <div className="w-8"></div>
          <div className="grow">
            <div className="p-4 flex flex-wrap gap-2 border border-dashed border-slate-300 rounded-[8px]">
              {renderAnswer()}
            </div>
            <div className=" flex items-center flex-wrap gap-2 p-4 align-middle">
              {renderQuestion()}
            </div>
          </div>
        </div>
      </DndContext>
    </section>
  );
};

export default ContextDragging;
