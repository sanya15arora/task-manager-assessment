import {FC, useState} from "react";
import {LuPlus} from "react-icons/lu";
import {Task} from "@/lib/types";
import toast from "react-hot-toast";
import TaskForm from "@/components/Tasks/TaskForm";
import Modal from "@/components/Modal";
import {useTasksContext} from "@/context/TaskProvider";



const AddTask = () => {
    const {
        createTask,
    } = useTasksContext();

    const [addTaskModal, setAddTaskModal] = useState(false);


    const handleAddTask = async (task: Partial<Task>) => {
        if (!task.title?.trim()) return toast.error("Title is required");
        if (!task.description?.trim()) return toast.error("Description is required");

        try {
            await createTask(task);
            toast.success("Task added successfully");
            setAddTaskModal(false);
        } catch {
            toast.error("Failed to add task.");
        }
    };

    return (<div>
            <button onClick={() => setAddTaskModal(!addTaskModal)}
                    className=" flex flex-col items-center justify-center w-32 h-32 bg-purple-100 text-purple-500 rounded-2xl border border-dashed">
                <LuPlus className="text-xl"/>
                Add Task
            </button>
            <Modal isOpen={addTaskModal} onClose={() => setAddTaskModal(false)} title="Add Task">
                <TaskForm onAddTask={handleAddTask}/>
            </Modal>
        </div>
    )
}

export default AddTask