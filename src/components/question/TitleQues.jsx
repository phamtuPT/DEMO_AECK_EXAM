import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { components } from "../../styles";
import { useSelector, useDispatch } from "react-redux";
import { chooseAnswer } from "../../store/Exam/thunk";
import { Input, Tooltip, Button } from "antd";
import { FlagOutlined } from "@ant-design/icons";

const TitleQues = (props) => {
  const dispatch = useDispatch();
  const { data, ordinalNumber } = props;
  const [isConfuse, setIsConfuse] = useState(false);
  const allAnswers = useSelector((state) => state.examReducer.answers);
  const yourAnswer = [...allAnswers];
  const currentAns = yourAnswer?.find(
    ({ answerId }) => answerId === data.ordinalNumber
  );
  const handleConfuse = () => {
    const chooseAns = {
      groupId: data.groupId,
      answerId: data.ordinalNumber,
      answer: "",
      isConfuse: true,
    };
    const existingAnswerIndex = yourAnswer.findIndex(
      ({ answerId }) => answerId === data.ordinalNumber
    );
    if (existingAnswerIndex !== -1) {
      if (yourAnswer[existingAnswerIndex].isConfuse) {
        yourAnswer[existingAnswerIndex] = {
          ...yourAnswer[existingAnswerIndex],
          isConfuse: false,
        };
        setIsConfuse(false);
      } else {
        yourAnswer[existingAnswerIndex] = {
          ...yourAnswer[existingAnswerIndex],
          isConfuse: true,
        };
        setIsConfuse(true);
      }
    } else {
      yourAnswer.push(chooseAns);
      setIsConfuse(true);
    }
    dispatch(chooseAnswer([...yourAnswer]));
  };
  useEffect(() => {
    if (currentAns?.isConfuse) {
      setIsConfuse(true);
    }
    return () => {
      setIsConfuse(false);
    };
  }, [yourAnswer, ordinalNumber]);
  return (
    <div className="flex items-center gap-4 mb-2">
      <div id={ordinalNumber} className={clsx(components.btnAnsList, "w-2/12")}>
        {ordinalNumber}
      </div>
      <h2 className="text-[16px] font-semibold m-0 ">
        This is a demo for {data.type} question:
      </h2>
      <div className="grow flex justify-end">
        {" "}
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
      </div>
    </div>
  );
};

export default TitleQues;
