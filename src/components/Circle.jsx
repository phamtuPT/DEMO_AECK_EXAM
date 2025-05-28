import React, { useEffect, useState } from "react";
import { Button } from "antd";
import clsx from "clsx";
import { components } from "../styles";
import { useSelector } from "react-redux";

const Circle = ({ className, ordinalNumber, onClick }) => {
  const questionSelected = useSelector(
    (state) => state.examReducer.questionSelected
  );

  const allAnswers = useSelector((state) => state.examReducer.answers);
  const yourAnswer = [...allAnswers];
  const [isSelected, setIsSelected] = useState(false);
  const [isConfuse, setIsConfuse] = useState(false);
  let style = "";
  useEffect(() => {
    if (yourAnswer) {
      const currentAns = yourAnswer?.find(
        ({ answerId }) => answerId === ordinalNumber
      );
      if (currentAns?.isConfuse) {
        setIsConfuse(true);
        setIsSelected(false);
      } else if (currentAns?.isSelected) {
        setIsSelected(true);
      }
    }
    return () => {
      setIsSelected(false);
      setIsConfuse(false);
    };
  }, [yourAnswer, questionSelected]);

  if (questionSelected === ordinalNumber) {
    style = components.btnAnsCurrent;
  } else if (isConfuse) {
    style = components.btnAnsYellow;
  } else if (isSelected) {
    style = components.btnAnsBlue;
  } else {
    style = components.btnAnsDefault;
  }
  return (
    <Button
      onClick={onClick}
      className={clsx(className, style, "rounded-full")}
    >
      {ordinalNumber}
    </Button>
  );
};

export default Circle;
