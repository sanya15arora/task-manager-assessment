import {FC, useEffect, useState} from 'react'
import {Task} from '@/lib/types'
import TaskInfoCard from '../Cards/TaskInfoCard';
import moment from 'moment';
import TaskForm from "@/components/Tasks/TaskForm";
import Modal from "@/components/Modal";
import CustomAlert from "@/components/layouts/CustomAlert";
import toast from "react-hot-toast";
import {useTasksContext} from "@/context/TaskProvider";

interface TaskListCardProps {
    taskList: Task[];
}

const TaskOverview: FC<TaskListCardProps> = ({taskList}) => {
    const {
        updateTask,
        deleteTask,
        toggleTaskCompletion,
    } = useTasksContext();

    useEffect(() => {

    }, []);

    const [editTaskModal, setEditTaskModal] = useState<{ show: boolean; data: Task | null }>({
        show: false,
        data: null,
    });
    const [openDeleteAlert, setOpenDeleteAlert] = useState<{ show: boolean; taskId: number | null | undefined }>({
        show: false,
        taskId: null,
    });

    const handleEditTask = async (task: Task) => {
        if (!task.id) return;
        try {
            await updateTask(task.id, task);
            toast.success("Task updated successfully");
            setEditTaskModal({ show: false, data: null });
        } catch {
            toast.error("Failed to update task.");
        }
    };

    const handleDeleteTask = async (id: number | null| undefined) => {
        if (typeof id !== "number") return;
        try {
            await deleteTask(id);
            toast.success("Task deleted successfully");
            setOpenDeleteAlert({ show: false, taskId: null });
        } catch {
            toast.error("Failed to delete task.");
        }
    };

    const handleToggleTask = async (id: number | null| undefined) => {
        if (typeof id !== "number") return;
        try {
            await toggleTaskCompletion(id);
            toast.success("Task updated successfully");
        } catch {
            toast.error("Failed to update task.");
        }
    };


    return (
        <div>

            <div className='grid grid-cols-1 gap-4'>
                {taskList.map((task) => {
                    return (
                        <TaskInfoCard
                            key={task.id}
                            title={task.title}
                            description={task.description}
                            status={task.status}
                            date={moment(task.createdAt).format("Do MMM YYYY")}
                            onDelete={() => setOpenDeleteAlert({show: true, taskId: task?.id})}
                            onEdit={() => setEditTaskModal({show: true, data: task})}
                            onToggle={() => handleToggleTask(task?.id)}/>
                    );
                })}
            </div>
            {/* Edit Task Modal */}
            <Modal isOpen={editTaskModal.show} onClose={() => setEditTaskModal({show: false, data: null})}
                   title="Edit Task">
                {editTaskModal.data && <TaskForm onAddTask={handleEditTask} initialData={editTaskModal.data}/>}
            </Modal>

            {/* Delete Alert Modal */}
            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({show: false, taskId: null})}
                title="Delete Task"
            >
                <CustomAlert
                    content="Are you sure you want to delete this task?"
                    btnText="Delete"
                    onAgree={() => handleDeleteTask(openDeleteAlert.taskId)}
                />
            </Modal>
        </div>

    )
}

export default TaskOverview