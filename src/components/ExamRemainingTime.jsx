import React, { useState, useEffect } from "react";
import { Button } from "antd";
import clsx from "clsx";
const ExamRemainingTime = ({ className, currentTime, onclick, text }) => {
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
  return (
    <section
      className={clsx(
        "flex items-center justify-between w-[480px] gap-4",
        className
      )}
    >
      <div className="w-10/12 h-full flex items-center py-1 px-1">
        <p className="m-0 mr-32">Thời gian còn lại</p>
        <p className="m-0 text-[24px] text-darkBlue font-semibold">
          {formatTime(currentTime)}
        </p>
      </div>
      <Button
        type="submit"
        onClick={onclick}
        className="w-2/12 h-12 border bg-primary border-primary flex items-center justify-center rounded-[8px] "
      >
        <p className="m-0 text-white">{text}</p>
      </Button>
    </section>
  );
};

export default ExamRemainingTime;
