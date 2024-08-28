import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import TaskColumn from "./TaskColumn";

function App() {
  const [tasks, setTasks] = useState({
    todo: ["Task 1", "Task 2", "Task 3"],
    inProgress: ["Task 4"],
    done: ["Task 5"],
  });

  const [newTask, setNewTask] = useState(""); // New state for task input

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const moveTask = (activeId, destinationArea) => {
    const sourceArea = Object.keys(tasks).find((area) =>
      tasks[area].includes(activeId)
    );

    if (!sourceArea) return;

    if (sourceArea === destinationArea) return;

    const sourceTasks = tasks[sourceArea].filter((task) => task !== activeId);
    const destinationTasks = [...tasks[destinationArea], activeId];

    setTasks({
      ...tasks,
      [sourceArea]: sourceTasks,
      [destinationArea]: destinationTasks,
    });
  };

  // Function to add a new task to the 'todo' column
  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        todo: [...prevTasks.todo, newTask.trim()],
      }));
      setNewTask(""); // Clear input field after adding the task
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over) {
          moveTask(active.id, over.id);
        }
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        {/* Input field and button to add a new task */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            style={{ padding: "10px", width: "200px", borderRadius: "5px" }}
          />
          <button onClick={addTask} style={{ padding: "10px" }}>
            Add Task
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-around",
            width: "90%",
          }}
        >
          <SortableContext
            items={Object.keys(tasks)}
            strategy={rectSortingStrategy}
          >
            {Object.keys(tasks).map((area) => (
              <TaskColumn
                key={area}
                id={area}
                title={area.replace(/([A-Z])/g, " $1").toUpperCase()}
                tasks={tasks[area]}
                moveTask={moveTask}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
