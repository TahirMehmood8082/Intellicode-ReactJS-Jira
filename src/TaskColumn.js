import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableTask from "./DraggableTask";

const TaskColumn = ({ id, title, tasks, moveTask }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        width: "30%",
      }}
    >
      <h2>{title}</h2>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <DraggableTask key={task} id={task} />
        ))}
      </SortableContext>
    </div>
  );
};

export default TaskColumn;
