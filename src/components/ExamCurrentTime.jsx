import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { selectGroupQuestion } from "../store/Exam/thunk";

import { Button } from "antd";
const ExamCurrentTime = (props) => {
  const {
    currentTime,
    totalTime,
    numberOfGroupQuestion,
    groupQuestionSelected,
  } = props;

  const dispatch = useDispatch();
  const handleNextQue = () => {
    if (groupQuestionSelected < numberOfGroupQuestion - 1) {
      dispatch(selectGroupQuestion(groupQuestionSelected + 1));
    } else {
      return;
    }
  };
  const handlePrevQue = () => {
    if (groupQuestionSelected > 0) {
      dispatch(selectGroupQuestion(groupQuestionSelected - 1));
    } else {
      return;
    }
  };
  const formatTime = (currentTime) => {
    if (currentTime > totalTime) {
      return "60 : 00 ";
    }
    currentTime = totalTime - currentTime;
    const minus = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${String(minus).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };
  return (
    <section className="flex items-center justify-between w-[480px]">
      <div className="w-4/12 h-full flex items-center justify-between gap-2 ">
        <Button
          onClick={handlePrevQue}
          disabled={
            groupQuestionSelected && groupQuestionSelected > 0 ? false : true
          }
          className="w-4/12 h-12 border border-borderDisable bg-buttonDisable flex items-center justify-center rounded-[8px] hover:font-bold hover:border-borderDisable hover:text-[#808080] "
        >
          <LeftOutlined />
        </Button>
        <Button
          onClick={handleNextQue}
          className="w-8/12 h-12 border bg-darkBlue border-darkBlue flex items-center justify-between p-3 rounded-[8px] "
        >
          <p className="m-0 text-white">Câu tiếp</p>
          <RightOutlined className="text-white" />
        </Button>
      </div>
      <div className="w-8/12 h-full flex items-center justify-between p-3">
        <p className="m-0 w-9/12">Thời gian làm câu hiện tại</p>
        <p className="m-0 grow text-[24px] text-darkBlue font-semibold">
          {formatTime(currentTime)}
        </p>
      </div>
    </section>
  );
};

export default ExamCurrentTime;
