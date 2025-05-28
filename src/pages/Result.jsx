import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Background from "../assets/bg-page-login.png";
import { ReactComponent as LogoFull } from "../assets/logo-full.svg";
import { Link } from "react-router-dom";
import mathQuestions from "../utils/question";
import { useNavigate } from "react-router-dom";
import { clearData } from "../store/Exam/thunk";
const Result = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const result = useSelector((state) => state.examReducer.score);
  const nameOfExam = useSelector((state) => state.examReducer.nameOfExam);
  const timeOfExam = useSelector((state) => state.examReducer.timeOfExam);
  const time = useSelector((state) => state.examReducer.time);
  const numberOfQuestion = useSelector(
    (state) => state.examReducer.numberOfQuestion
  );

  const formatTime = (currentTime) => {
    const minus = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${String(minus).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  window.addEventListener("popstate", navigate("/"));

  const handleClearData = () => {
    dispatch(clearData());
  };

  return (
    <section
      className=" h-screen w-full bg-center bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="container-custom mt-20 justify-center relative flex">
        <div className="ml-[15px] mr-[15px] w-full h-full ">
          <div className="flex justify-center flex-col w-full ">
            <div className="auth-form flex flex-col justify-center bg-white w-[400px] rounded-[8px] p-6">
              <LogoFull className=" mb-6 max-w-[90%] max-h-[32px]" />
              <div className="">
                <h2 className="text-[20px] font-semibold">Thông tin bài thi</h2>
                <table className="mb-3">
                  <tbody>
                    <tr>
                      <td className="w-1/2  px-2 py-1">Họ tên</td>
                      <td className="w-1/2  px-2 py-1">12315456789</td>
                    </tr>
                    <tr>
                      <td className="w-1/2  px-2 py-1">Kíp thi</td>
                      <td className="w-1/2  px-2 py-1">
                        Thi thử ĐGTD - TSA 2024 - {nameOfExam}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/2  px-2 py-1">Thời gian</td>
                      <td className="w-1/2  px-2 py-1">
                        {timeOfExam / 60} phút
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/2  px-2 py-1">
                        Thời gian làm bài thực tế
                      </td>
                      <td className="w-1/2  px-2 py-1">{formatTime(time)}</td>
                    </tr>
                    <tr>
                      <td className="w-1/2  px-2 py-1">
                        Số câu trắc nghiệm đúng
                      </td>
                      <td className="w-1/2  px-2 py-1">
                        {result ? result : 0}/{numberOfQuestion}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Link
                  onClick={handleClearData}
                  to={"/dang-nhap"}
                  className="link text-[16px] underline"
                >
                  Về trang đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Result;
