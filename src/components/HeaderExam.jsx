import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
const HeaderExam = ({ className, examTitle }) => {
  const nameOfExam = useSelector((state) => state.examReducer.nameOfExam);
  return (
    <header
      className={clsx(
        "bg-white min-w-[64px] flex items-center justify-start",
        className
      )}
    >
      <img
        className="m-4 h-8"
        src={require("../assets/logo-short.svg").default}
        alt="logo-short"
      />
      <h2 className="m-0 font-bold text-[18px]">
        {examTitle || nameOfExam || "Thi thử ĐGTD - TSA 2024"}
      </h2>
    </header>
  );
};

export default HeaderExam;
