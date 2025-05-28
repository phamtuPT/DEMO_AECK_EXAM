import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Slider, Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { submitAnswer, timeTodo } from "../store/Exam/thunk";
import HeaderExam from "../components/HeaderExam";
import FooterExam from "../components/FooterExam";

import CircleArray from "../components/CircleArray";

import ContextSingle from "../components/single-answer-question/ContextSingle";
import ExamRemainingTime from "../components/ExamRemainingTime";
import mathQuestions from "../utils/question";
import {
  selectQuestion,
  selectGroupQuestion,
  totalQuestion,
} from "../store/Exam/thunk";
const Exam1 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Data area -------------------------------------------------------------------------

  const timeOfExam = useSelector((state) => state.examReducer.timeOfExam);
  const answers = useSelector((state) => state.examReducer.answers);
  const questionSelected = useSelector(
    (state) => state.examReducer.questionSelected
  );

  // Number of question feature area -------------------------------------------------------------------------
  const [numberOfQuestion, setNumberOfQuestion] = useState(0);

  const [newData, setNewData] = useState([]);
  // merge data to a array
  const bunchData = () => {
    const groupQuestion = [];
    let ordinalNumber = 1;
    mathQuestions.map((item, i) => {
      let groupId = item.id;
      const questions = [];
      item.questions.map((item, j) => {
        let index = ordinalNumber;
        ordinalNumber++;
        const newObj = { ...item, ordinalNumber: index, groupId };
        return questions.push(newObj);
      });
      const newDemoQuestion = { ...item, questions: questions };
      return groupQuestion.push(newDemoQuestion);
    });

    let number = groupQuestion
      .slice(-1)[0]
      .questions.slice(-1)[0].ordinalNumber;
    setNumberOfQuestion(number);
    dispatch(totalQuestion(number));
    setNewData(groupQuestion);
  };
  useEffect(() => {
    bunchData();
    dispatch(selectGroupQuestion(1));
    dispatch(selectQuestion(1));
  }, []);
  // Number of question feature area -------------------------------------------------------------------------

  // const groupQuestionSelected = newData.find(
  //   ({ id }) => id === IDGroupQuestion
  // );

  // const dataToRenderQuestionList = groupQuestionSelected?.questions;

  const dataToRenderQuestionList = newData[questionSelected - 1]?.questions;
  // console.log(newData);

  // Data area -------------------------------------------------------------------------

  // Move to question selected -------------------------------------------------------------------------

  // Move to question selected -------------------------------------------------------------------------

  // Modal feature area -------------------------------------------------------------------------
  const [openModal, setOpenModal] = useState(false);

  const handleCancelModal = () => {
    setOpenModal(false);
  };
  // Modal feature area -------------------------------------------------------------------------

  // Slider feature area -------------------------------------------------------------------------

  const [slider, setSlider] = useState(0);
  useEffect(() => {
    setSlider((answers.length / numberOfQuestion) * 100);
  }, [answers]);

  const calculatorResult = (answers, newData) => {
    let result = 0;
    for (let i = 0; i < newData?.length; i++) {
      const groupAnswer = answers.filter(
        ({ groupId }) => groupId === newData[i].id
      );
      for (let j = 0; j < groupAnswer?.length; j++) {
        const currentAnswer = groupAnswer[j];
        const answerForCheck = newData[i].questions.find(
          ({ ordinalNumber }) => ordinalNumber === currentAnswer.answerId
        );
        if (answerForCheck.type === "Dragging") {
          const coincide = currentAnswer.answer.every((element) =>
            answerForCheck.correctAnswers.includes(element)
          );

          if (coincide) {
            result++;
          } else {
            return;
          }
        } else if (answerForCheck.type === "SingleAnswer") {
          if (currentAnswer.answer === answerForCheck.correctAnswer) {
            result++;
          } else {
            return;
          }
        } else if (answerForCheck.type === "MultipleAnswers") {
          const coincide = currentAnswer.answer.every((element) =>
            answerForCheck.correctAnswers.includes(element)
          );

          if (coincide) {
            result++;
          } else {
            return;
          }
        } else if (answerForCheck.type === "True/False") {
          let missAnswer = false;
          let wrongAnswer = false;
          for (let i = 0; i < currentAnswer.answer.length; i++) {
            let x = answerForCheck?.question.find(
              ({ id }) => id === currentAnswer.answer[i].id
            );
            if (x == -1) {
              missAnswer = true;
            } else {
              if (x.correctAnswer !== currentAnswer.answer[i].answer) {
                wrongAnswer = true;
                break;
              }
            }
          }
          if (!missAnswer && !wrongAnswer) {
            result++;
          } else {
            return;
          }
        } else if (answerForCheck.type === "ConstructedResponse") {
          const coincide = currentAnswer.answer.every((element) =>
            answerForCheck.correctAnswers.includes(element)
          );

          if (coincide) {
            result++;
          } else {
            return;
          }
        }
      }
    }

    return result;
  };

  // Slider feature area -------------------------------------------------------------------------

  // Time feature area -------------------------------------------------------------------------

  const [intervalTime, setIntervalTime] = useState(timeOfExam);
  useEffect(() => {
    const initialTime = setInterval(() => {
      setIntervalTime((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(initialTime);
  }, []);

  if (intervalTime <= 0) {
    navigate("/ket-qua");
  }
  const handleSubmit = () => {
    navigate("/ket-qua");
    const result = calculatorResult(answers, newData);
    dispatch(timeTodo(timeOfExam - intervalTime));
    dispatch(submitAnswer(result));
  };

  return (
    <section className="bg-global h-full relative flex ">
      <div className="grow h-screen">
        <HeaderExam />
        <div className=" w-full bg-global">
          <div className="relative overflow-y-scroll max-h-[70vh] w-[95%] rounded-[8px] bg-white mx-auto my-6">
            {/* CONTENT EXAM AREA  */}
            <div className="h-[300px]">
              {/* <QuestionContent index={questionSelected} data={newData} /> */}
              {dataToRenderQuestionList?.map((item, index) => {
                if (item.type === "SingleAnswer") {
                  return (
                    <ContextSingle
                      className={" p-3 "}
                      data={item}
                      ordinalNumber={item.ordinalNumber}
                      key={index}
                    />
                  );
                }
              })}
            </div>
            {/* CONTENT EXAM AREA  */}
          </div>
        </div>
        <footer className="absolute bottom-0 w-full px-12 min-h-[80px] bg-white flex items-center">
          <FooterExam
            totalTime={timeOfExam}
            currentTime={intervalTime}
            numberOfQuestion={numberOfQuestion}
            questionSelected={questionSelected}
          />
        </footer>
      </div>
      <div className="max-w-[480px] bg-white h-screen relative ">
        <div className="">
          <div className="py-3 px-6">
            <h2 className="mt-3 text-[18px] font-semibold">
              Thông tin thí sinh
            </h2>
            <div className="flex justify-between items-center">
              <p>Họ tên</p>
              <p>123456789</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Mã dự thi</p>
              <p>123456789</p>
            </div>
          </div>
          <ExamRemainingTime
            onclick={() => setOpenModal(true)}
            currentTime={intervalTime}
            text={"Nộp bài"}
            className={"w-full px-3"}
          />
          <CircleArray questionsData={newData} className="py-3 px-6" />
        </div>
        <div className="absolute bottom-10 w-full px-6 bg-white">
          <div className=" border-t border-b border-borderDisable py-3 ">
            <div className="flex items-center justify-between">
              <p className="m-0 w-1/2 text-start">Bạn đã hoàn thành</p>
              <div className="m-0 w-1/2 text-end">
                <div className="text-[24px] text-darkBlue font-semibold ">
                  <p className="m-0 inline-block">{answers.length} /</p>{" "}
                  <p className="m-0 inline-block">
                    {numberOfQuestion}{" "}
                    <span className="text-[14px] text-[#262626] font-normal">
                      câu
                    </span>{" "}
                  </p>
                </div>{" "}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Slider
                className="w-[95%]"
                tooltip={{ title: "" }}
                value={slider}
                disabled={false}
              />
              <p className="m-0 w-[5%]">
                {Math.floor((answers.length / mathQuestions.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        closeIcon={false}
        className="relative top-1/2 -translate-y-1/2"
        footer={[]}
      >
        <CloseOutlined
          onClick={handleCancelModal}
          className="block absolute top-[-55px] right-1/2 translate-x-1/2 bg-white rounded-full text-center leading-5 font-bold w-[1.5rem] h-[1.5rem]"
        />

        <div className=" p-6 ">
          <div className="flex flex-col items-center">
            <div className="w-[100px] h-[100px] bg-red-500 rounded-full flex flex-col items-center justify-center">
              <p className="m-0 text-white font-semibold text-[24px] text-center leading-6">
                {answers.length} / {numberOfQuestion}
              </p>
              <p className="m-0 text-white font-semibold text-[20px] text-center leading-6">
                Câu
              </p>
            </div>
            <p className="m-0 text-[#262626]">
              Bạn vẫn còn thời gian làm bài, bạn có chắc muốn kết thúc bài thi?
            </p>
          </div>
          <div className="flex justify-between gap-3 mt-6">
            <div className="w-1/2">
              <Button
                onClick={handleCancelModal}
                className="w-full min-h-[36px] bg-darkBlue border-darkBlue text-white rounded-[8px]"
              >
                Làm bài tiếp
              </Button>
            </div>
            <div className="w-1/2">
              <Button
                onClick={handleSubmit}
                className="w-full min-h-[36px] border bg-primary border-primary  rounded-[8px] text-white"
              >
                Nộp bài thi
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Exam1;
