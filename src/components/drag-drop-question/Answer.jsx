// This component is answer to drag

import React from "react";

import _ from "lodash";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import clsx from "clsx";

const Answer = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <section
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={clsx(
        "cursor-pointer bg-slate-200 rounded-[8px] p-2",
        props.className
      )}
    >
      {props.text}
    </section>
  );
};

export default Answer;
