import React from "react";
import { useDispatch } from "react-redux";
import { selectQuestion, selectGroupQuestion } from "../store/Exam/thunk.js";
import Circle from "./Circle";
import { Button, Tooltip } from "antd";
import { components } from "../styles.js";
import clsx from "clsx";
const CircleArray = (props) => {
  const { questionsData } = props;

  const dispatch = useDispatch();
  const handleSelectQuestion = (index, id) => {
    dispatch(selectQuestion(index));
    dispatch(selectGroupQuestion(id));
  };

  const renderListQuestion = () => {
    return questionsData.map((item, i) => (
      <React.Fragment key={item.id}>
        {item.questions.map((question, i) => {
          return (
            <Circle
              onClick={() => handleSelectQuestion(question.ordinalNumber, item.id)}
              key={question.questionId}
              ordinalNumber={question.ordinalNumber}
            />
          );
        })}
      </React.Fragment>
    ));
  };

  return (
    <section className={clsx("flex flex-col w-full", props.className)}>
      <div className="w-full flex items-center justify-start py-4 gap-2">
        <p className="m-0 ">Chỉ thị màu sắc: </p>
        <div className="flex items-center gap-4 justify-start">
          <Tooltip placement="top" title="Câu chưa trả lời">
            <Button className={clsx("rounded-full", components.btnAnsDefault)}>
              0
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Câu đã trả lời">
            <Button className={clsx("rounded-full", components.btnAnsBlue)}>
              0
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Câu chưa chắc chắn">
            <Button className={clsx("rounded-full", components.btnAnsYellow)}>
              0
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full grid grid-cols-8 gap-6 py-4">
        {renderListQuestion()}
      </div>
    </section>
  );
};

export default CircleArray;
