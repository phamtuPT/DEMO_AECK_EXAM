import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Slider, Modal, Button, Drawer } from "antd";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { submitAnswer, timeTodo, totalQuestion } from "../store/Exam/thunk";
import HeaderExam from "../components/HeaderExam";
import CircleArray from "../components/CircleArray";
import ExamCurrentTime from "../components/ExamCurrentTime";
import ExamRemainingTime from "../components/ExamRemainingTime";

import demoQuestions from "../utils/demoData";
import ContextDragging from "../components/drag-drop-question/ContextDragging";
import ContextCR from "../components/constructed-response-question/ContextCR";
import ContextSingle from "../components/single-answer-question/ContextSingle";
import ContextTrueFalse from "../components/true-false-question/ContextTrueFalse";
import ContextMultiple from "../components/multiple-answers-question/ContextMultiple";

const Exam2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Data area -------------------------------------------------------------------------

  const timeOfExam = useSelector((state) => state.examReducer.timeOfExam);
  const answers = useSelector((state) => state.examReducer.answers);
  const groupQuestionSelected = useSelector(
    (state) => state.examReducer.groupQuestionSelected
  );
  const questionSelected = useSelector(
    (state) => state.examReducer.questionSelected
  );
  // Number of question feature area -------------------------------------------------------------------------
  const [numberOfQuestion, setNumberOfQuestion] = useState(0);
  const [numberOfGroupQuestion, setNumberOfGroupQuestion] = useState(0);

  const [newData, setNewData] = useState([]);
  // merge data to a array
  const bunchData = () => {
    const groupQuestion = [];
    let ordinalNumber = 1;
    demoQuestions.map((item, i) => {
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
    setNumberOfGroupQuestion(demoQuestions?.length);
  };
  useEffect(() => {
    bunchData();
  }, []);
  // Number of question feature area -------------------------------------------------------------------------

  // const groupQuestionSelected = newData.find(
  //   ({ id }) => id === IDGroupQuestion
  // );

  // const dataToRenderQuestionList = groupQuestionSelected?.questions;
  const dataToRenderQuestionList =
    newData[groupQuestionSelected - 1]?.questions;

  // Data area -------------------------------------------------------------------------

  // Dispatch initial value -------------------------------------------------------------------------
  // useEffect(() => {
  //   dispatch(selectGroupQuestion(demoQuestions[0].id));
  // }, []);

  // Dispatch initial value-------------------------------------------------------------------------

  // Move to question selected -------------------------------------------------------------------------
  useEffect(() => {
    const element = document.getElementById(questionSelected);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [questionSelected]);

  const answerRef = useRef(null);
  const questionRef = useRef(null);

  useEffect(() => {
    answerRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    questionRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [groupQuestionSelected]);

  // Move to question selected -------------------------------------------------------------------------

  // Modal feature area -------------------------------------------------------------------------
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

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
    console.log(result);
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

  const formatTime = (currentTime) => {
    if (currentTime <= 0) {
      return "00:00";
    }
    const minus = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${String(minus).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Time feature area -------------------------------------------------------------------------
  return (
    <section className="bg-global h-screen relative ">
      <HeaderExam />
      <div className=" w-full bg-global flex">
        {/* CONTENT EXAM AREA  */}
        <div
          ref={questionRef}
          className="w-1/2 relative overflow-y-auto max-h-[75vh] rounded-[8px] bg-white mx-auto my-6"
        >
          <div className="h-full flex flex-col w/full p-4">
            <h3 className="font-semibold text-[18px]">
              Đọc văn bản và trả lời câu hỏi từ{" "}
              <span>
                {dataToRenderQuestionList
                  ? dataToRenderQuestionList[0]?.ordinalNumber
                  : ""}
              </span>{" "}
              đến{" "}
              <span>
                {dataToRenderQuestionList
                  ? dataToRenderQuestionList.slice(-1).pop()?.ordinalNumber
                  : ""}
              </span>{" "}
              :
            </h3>
            <div className="text-center font-semibold text-base">
              "MÃ ĐỊNH DANH" hội nhập thế giới
            </div>
            {dataToRenderQuestionList?.map((item) => (
              <p key={item.ordinalNumber}>
                {"[ "}
                {item.ordinalNumber}
                {" ]"}
                <span className="ml-[30px]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                  voluptates a, facilis, harum sit tenetur possimus quibusdam
                  suscipit optio saepe sed laudantium? Tempora, iste ab corporis
                  odio officia nesciunt. Recusandae ipsa consectetur ex minus
                  delectus obcaecati quod eligendi et. Labore, temporibus
                  minima. Perferendis omnis placeat quo? Doloremque laborum
                  velit recusandae iure minima similique numquam inventore qui
                  cumque cupiditate delectus nesciunt, quam aliquam facilis
                  repellendus. Ad nobis magnam ipsa, possimus quo eius libero
                  rerum. Harum quas facere provident iste esse soluta nulla
                  iusto. Hic unde blanditiis, doloremque quos earum dolor eos
                  accusamus nam soluta facere qui dolore illum, quas voluptatum
                  voluptates?
                </span>
              </p>
            ))}
          </div>
        </div>
        {/* CONTENT EXAM AREA  */}
        {/* ANSWER AREA -----------------------------------------------------------------------  */}
        <div
          ref={answerRef}
          className="w-1/2 bg-white rounded-[8px] max-h-[75vh] my-6 p-4 overflow-y-auto"
        >
          {dataToRenderQuestionList?.map((item, index) => {
            if (item.type === "Dragging") {
              return (
                <ContextDragging
                  className={" p-3"}
                  data={item}
                  ordinalNumber={item.ordinalNumber}
                  key={index}
                />
              );
            } else if (item.type === "SingleAnswer") {
              return (
                <ContextSingle
                  className={" p-3 "}
                  data={item}
                  ordinalNumber={item.ordinalNumber}
                  key={index}
                />
              );
            } else if (item.type === "MultipleAnswers") {
              return (
                <ContextMultiple
                  className={" p-3 "}
                  data={item}
                  ordinalNumber={item.ordinalNumber}
                  key={index}
                />
              );
            } else if (item.type === "True/False") {
              return (
                <ContextTrueFalse
                  className={" p-3 "}
                  data={item}
                  ordinalNumber={item.ordinalNumber}
                  key={index}
                />
              );
            } else if (item.type === "ConstructedResponse") {
              return (
                <ContextCR
                  className={" p-3 "}
                  data={item}
                  ordinalNumber={item.ordinalNumber}
                  key={index}
                />
              );
            }
          })}
        </div>
        {/* ANSWER AREA -----------------------------------------------------------------------  */}
      </div>

      <footer className="absolute bottom-0 w-full px-12 min-h-[80px] bg-white flex items-center justify-between">
        <ExamCurrentTime
          totalTime={timeOfExam}
          currentTime={intervalTime}
          numberOfGroupQuestion={numberOfGroupQuestion}
          groupQuestionSelected={groupQuestionSelected}
        />
        <div className="flex items-center justify-between w-[400px] gap-2">
          <div className="h-12 w-8/12 flex items-center justify-between py-1 px-1 border border-borderDisable rounded-[8px]">
            <p className="m-0 w-7/12">Thời gian còn lại: </p>
            <p className="m-0 grow text-[24px] text-darkBlue font-semibold">
              {formatTime(intervalTime)}
            </p>
          </div>
          <Button
            onClick={showDrawer}
            type="submit"
            className="grow h-12 border bg-primary border-primary flex items-center justify-center rounded-[8px] text-white"
          >
            <LeftOutlined /> Mở menu/Nộp bài
          </Button>
        </div>
      </footer>

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
      <Drawer
        placement="right"
        closable={false}
        onClose={onCloseDrawer}
        open={openDrawer}
        key="right"
        className=""
      >
        <div className=" bg-white h-full relative ">
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
                    <p className="m-0 inline-block">{answers.length} /</p>
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
                  {Math.floor((answers.length / numberOfQuestion) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </section>
  );
};

export default Exam2;
