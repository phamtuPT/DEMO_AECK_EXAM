import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Radio,
  Checkbox,
  Input,
  Typography,
  Modal,
  message,
  Card,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getExams } from "../store/Exam/thunk/examThunk";
import { getQuestions } from "../store/Question/thunk";
import LaTeXRenderer from "../components/LaTeXRenderer";
import mockDatabase from "../data/mockDatabase";
import logoShort from "../assets/logo-short.svg";
import HeaderExam from "../components/HeaderExam";
import FooterExam from "../components/FooterExam";
import CircleArray from "../components/CircleArray";
import ExamRemainingTime from "../components/ExamRemainingTime";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ExamTaking = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const exams = useSelector((state) => state.examManagementReducer.exams);
  const questions = useSelector((state) => state.questionReducer.questions);

  const [exam, setExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState(new Set()); // Câu được đánh dấu
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [questionTimes, setQuestionTimes] = useState({}); // Thời gian cho từng câu
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    dispatch(getExams());
    dispatch(getQuestions());

    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, [dispatch]);

  useEffect(() => {
    if (exams.length > 0 && questions.length > 0) {
      const foundExam = exams.find(e => e.id === parseInt(examId));
      if (foundExam) {
        setExam(foundExam);

        // Get questions for this exam
        const examQuestionList = foundExam.questionIds
          .map(qId => questions.find(q => q.id === qId))
          .filter(q => q !== undefined);

        // Shuffle questions if setting is enabled
        if (foundExam.settings?.shuffleQuestions) {
          setExamQuestions(shuffleArray([...examQuestionList]));
        } else {
          setExamQuestions(examQuestionList);
        }

        // Set timer
        setTimeLeft(foundExam.duration * 60); // Convert minutes to seconds
      } else {
        message.error("Không tìm thấy đề thi!");
        navigate("/exams");
      }
    }
  }, [exams, questions, examId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && exam) {
      // Auto submit when time is up
      handleSubmitExam();
    }
  }, [timeLeft, exam]);

  // Set start time when changing questions (accounting for existing time)
  useEffect(() => {
    if (examQuestions.length > 0) {
      const currentQuestionId = examQuestions[currentQuestionIndex]?.id;
      if (currentQuestionId) {
        const existingTime = questionTimes[currentQuestionId] || 0;
        setCurrentQuestionStartTime(Date.now() - (existingTime * 1000));
      }
    }
  }, [currentQuestionIndex, examQuestions, questionTimes]);

  // Update current question time every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (examQuestions.length > 0) {
        const currentQuestionId = examQuestions[currentQuestionIndex]?.id;
        if (currentQuestionId) {
          const elapsedTime = Math.floor((Date.now() - currentQuestionStartTime) / 1000);
          setQuestionTimes(prev => ({
            ...prev,
            [currentQuestionId]: elapsedTime
          }));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, currentQuestionStartTime, examQuestions]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatQuestionTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleMarkQuestion = () => {
    const questionId = examQuestions[currentQuestionIndex]?.id;
    if (questionId) {
      setMarkedQuestions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(questionId)) {
          newSet.delete(questionId);
        } else {
          newSet.add(questionId);
        }
        return newSet;
      });
    }
  };

  const handleSubmitExam = () => {
    Modal.confirm({
      title: "Nộp bài thi",
      content: "Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài sẽ không thể chỉnh sửa.",
      width: 480,
      centered: true,
      okText: "Nộp bài",
      cancelText: "Hủy",
      okButtonProps: {
        size: 'large',
        className: 'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600'
      },
      cancelButtonProps: {
        size: 'large'
      },
      className: 'custom-submit-modal',
      onOk: () => {
        setIsSubmitting(true);

        // Calculate score
        let correctAnswers = 0;
        examQuestions.forEach(question => {
          const userAnswer = answers[question.id];
          if (userAnswer === question.correctAnswer) {
            correctAnswers++;
          }
        });

        const score = Math.round((correctAnswers / examQuestions.length) * 100);
        const passed = score >= (exam.settings?.passingScore || 60);

        // Get current user info
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

        // Save result to database
        const result = {
          id: mockDatabase.getNextId('result'),
          examId: exam.id,
          examTitle: exam.title,
          userId: userInfo.id,
          userName: userInfo.name,
          userEmail: userInfo.email,
          score,
          correctAnswers,
          totalQuestions: examQuestions.length,
          passed,
          timeSpent: exam.duration - Math.floor(timeLeft / 60),
          answers,
          completedAt: new Date().toISOString(),
        };

        // Save to mock database
        const existingResults = mockDatabase.getExamResults();
        existingResults.push(result);
        mockDatabase.saveExamResults(existingResults);

        // Also save to localStorage for backward compatibility
        const localResults = JSON.parse(localStorage.getItem("examResults") || "[]");
        localResults.push(result);
        localStorage.setItem("examResults", JSON.stringify(localResults));

        message.success("Nộp bài thành công!");
        navigate(`/exam-result/${exam.id}`, { state: { result } });
      }
    });
  };

  if (!exam || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <Title level={3}>Đang tải đề thi...</Title>
        </Card>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <section className="bg-global h-full relative flex">
      <div className="grow h-screen">
        <HeaderExam examTitle={exam?.title} />
        <div className="w-full bg-global">
          <div className="relative overflow-y-scroll max-h-[70vh] w-[95%] rounded-[8px] bg-white mx-auto my-6">
            {/* CONTENT EXAM AREA */}
            <div className="min-h-[300px] p-6">
              {/* Question Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#E5E7EB', color: '#374151' }}>
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-lg leading-relaxed flex-1">
                      <LaTeXRenderer>{currentQuestion.question}</LaTeXRenderer>
                    </div>
                    <Button
                      onClick={toggleMarkQuestion}
                      size="small"
                      className="ml-4 w-10 h-10 flex items-center justify-center p-0 border-none bg-transparent hover:bg-transparent"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor: '#E5E7EB',
                          border: markedQuestions.has(currentQuestion.id) ? '2px solid #EAB308' : 'none'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                            fill="none"
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </Button>
                  </div>

                  {/* Question Image */}
                  {currentQuestion.image && (
                    <div className="mt-4">
                      <img
                        src={currentQuestion.image}
                        alt="Question diagram"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Additional question content if any */}
                  {currentQuestion.content && (
                    <div className="mt-4 text-base">
                      <LaTeXRenderer>{currentQuestion.content}</LaTeXRenderer>
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div className="ml-12">
                {currentQuestion.type === "SingleAnswer" && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                      <div
                        key={key}
                        onClick={() => handleAnswerChange(currentQuestion.id, key)}
                        className="cursor-pointer transition-all min-h-[50px] flex items-center hover:bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                            style={{
                              backgroundColor: answers[currentQuestion.id] === key ? '#60A5FA' : '#E5E7EB'
                            }}
                          >
                          </div>
                          <div className="flex-1 text-sm">
                            <LaTeXRenderer>{value}</LaTeXRenderer>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "MultipleAnswers" && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(currentQuestion.options).map(([key, value]) => {
                      const isSelected = (answers[currentQuestion.id] || []).includes(key);
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            const newAnswers = isSelected
                              ? currentAnswers.filter(a => a !== key)
                              : [...currentAnswers, key];
                            handleAnswerChange(currentQuestion.id, newAnswers);
                          }}
                          className="cursor-pointer transition-all min-h-[50px] flex items-center hover:bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                backgroundColor: isSelected ? '#60A5FA' : '#E5E7EB'
                              }}
                            >
                            </div>
                            <div className="flex-1 text-sm">
                              <LaTeXRenderer>{value}</LaTeXRenderer>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === "TrueFalse" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => handleAnswerChange(currentQuestion.id, "true")}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all text-center
                        ${answers[currentQuestion.id] === "true"
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${answers[currentQuestion.id] === "true"
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                          }
                        `}>
                          {answers[currentQuestion.id] === "true" && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-base font-medium">Đúng</span>
                      </div>
                    </div>
                    <div
                      onClick={() => handleAnswerChange(currentQuestion.id, "false")}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all text-center
                        ${answers[currentQuestion.id] === "false"
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${answers[currentQuestion.id] === "false"
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                          }
                        `}>
                          {answers[currentQuestion.id] === "false" && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-base font-medium">Sai</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentQuestion.type === "ConstructedResponse" && (
                  <TextArea
                    rows={4}
                    placeholder="Nhập câu trả lời của bạn..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full"
                  />
                )}
              </div>
            </div>
            {/* CONTENT EXAM AREA */}
          </div>
        </div>
        <footer className="absolute bottom-0 w-full px-12 min-h-[80px] bg-white flex items-center">
          <section className="flex items-center justify-between w-[480px]">
            <div className="w-4/12 h-full flex items-center justify-between gap-2">
              <Button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="w-4/12 h-12 border border-borderDisable bg-buttonDisable flex items-center justify-center rounded-[8px] hover:font-bold hover:border-borderDisable hover:text-[#808080]"
              >
                <LeftOutlined />
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === examQuestions.length - 1}
                className="w-8/12 h-12 border bg-darkBlue border-darkBlue flex items-center justify-between p-3 rounded-[8px]"
              >
                <p className="m-0 text-white">Câu tiếp</p>
                <RightOutlined className="text-white" />
              </Button>
            </div>
            <div className="w-8/12 h-full flex items-center justify-between p-3">
              <p className="m-0 w-9/12">Thời gian làm câu hiện tại</p>
              <p className="m-0 grow text-[24px] text-darkBlue font-semibold">
                {formatQuestionTime(questionTimes[examQuestions[currentQuestionIndex]?.id] || 0)}
              </p>
            </div>
          </section>
        </footer>
      </div>
      <div className="max-w-[480px] bg-white h-screen relative">
        <div className="">
          <div className="py-3 px-6">
            <h2 className="mt-3 text-[18px] font-semibold">
              Thông tin thí sinh
            </h2>
            <div className="flex justify-between items-center">
              <p>Họ tên</p>
              <p>{userInfo?.name || "Anh Em Cây Khế"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Mã dự thi</p>
              <p>{userInfo?.id || "123456789"}</p>
            </div>
          </div>
          <ExamRemainingTime
            onclick={handleSubmitExam}
            currentTime={timeLeft}
            text={"Nộp bài"}
            className={"w-full px-3"}
          />
          {/* Question Grid */}
          <div className="py-3 px-6">
            <div className="w-full flex items-center justify-start py-4 gap-2">
              <p className="m-0">Chỉ thị màu sắc: </p>
              <div className="flex items-center gap-4 justify-start">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#E5E7EB' }}></div>
                  <span className="text-xs">Chưa trả lời</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#60A5FA' }}></div>
                  <span className="text-xs">Đã trả lời</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: '#E5E7EB', borderColor: '#EAB308' }}></div>
                  <span className="text-xs">Đánh dấu</span>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-8 gap-2 py-4">
              {examQuestions.map((_, index) => {
                const questionId = examQuestions[index]?.id;
                const isAnswered = answers[questionId];
                const isCurrent = index === currentQuestionIndex;
                const isMarked = markedQuestions.has(questionId);

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className="w-8 h-8 text-xs font-bold rounded-full text-center flex items-center justify-center relative transition-all duration-200"
                    style={{
                      backgroundColor: isCurrent
                        ? '#1E3A8A'
                        : isAnswered
                          ? '#60A5FA'
                          : '#E5E7EB',
                      color: isCurrent || isAnswered ? '#FFFFFF' : '#374151',
                      border: isMarked ? '2px solid #EAB308' : 'none'
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 w-full px-6 bg-white">
          <div className="border-t border-b border-borderDisable py-3">
            <div className="flex items-center justify-between">
              <p className="m-0 w-1/2 text-start">Bạn đã hoàn thành</p>
              <div className="m-0 w-1/2 text-end">
                <div className="text-[24px] text-darkBlue font-semibold">
                  <p className="m-0 inline-block">{answeredCount} /</p>{" "}
                  <p className="m-0 inline-block">
                    {examQuestions.length}{" "}
                    <span className="text-[14px] text-[#262626] font-normal">
                      câu
                    </span>{" "}
                  </p>
                </div>{" "}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[95%] rounded-full h-2" style={{ backgroundColor: '#F8F9FA' }}>
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / examQuestions.length) * 100}%` }}
                ></div>
              </div>
              <p className="m-0 w-[5%]">
                {Math.floor((answeredCount / examQuestions.length) * 100)}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 px-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Đã kết nối</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamTaking;
