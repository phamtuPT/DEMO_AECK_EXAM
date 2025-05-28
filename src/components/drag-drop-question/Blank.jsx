import React from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

const Blank = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  const style = {
    // opacity: isOver ? 1 : 0.5,
  };
  const styles = isOver ? "border-primary" : "";

  return (
    <div
      className={clsx(
        " align-bottom border  rounded-[8px] inline-block z-20 text-center min-w-[80px]",
        styles,
        props.className
      )}
      ref={setNodeRef}
      style={style}
    >
      {props.children}
    </div>
  );
};

export default Blank;
