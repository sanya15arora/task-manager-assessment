import { useState, FC, useEffect } from "react";
import Input from "../Inputs/Input";
import { Task, TaskStatus } from "@/lib//types";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  initialData?: Task;
}

const TaskForm: FC<TaskFormProps> = ({ onAddTask, initialData }) => {
  const [task, setTask] = useState<Task>(
    initialData || {
      title: "",
      description: "",
      status: "pending" as TaskStatus,
    }
  );

  useEffect(() => {
    if (initialData) {
      setTask(initialData);
    }
  }, [initialData]);

  const handleChange = (key: keyof Task, value: string) => {
    setTask((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <Input
        label="Title"
        value={task.title}
        onChange={({ target }) => handleChange("title", target.value)}
        placeholder="Enter title here..."
        type="text"
      />
      <Input
        label="Description"
        value={task.description}
        onChange={({ target }) => handleChange("description", target.value)}
        placeholder="Enter description here..."
        type="text"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => onAddTask(task)}
          className="form-btn"
          disabled={!task.title.trim() || !task.description.trim()}
        >
          {initialData ? "Update Task" : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
