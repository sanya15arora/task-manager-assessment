import {FC} from 'react';
import {LuTrash2} from "react-icons/lu";
import {FaEdit} from "react-icons/fa";
import {TaskStatus} from '@/lib/types';
import {FiCheckSquare, FiSquare} from "react-icons/fi";

interface TaskInfoCardProps {
    title: string;
    description: string | undefined;
    status: TaskStatus
    date: string;
    onDelete: () => void;
    onEdit: () => void;
    onToggle: () => void;
}

const TaskInfoCard: FC<TaskInfoCardProps> = ({
                                                 title,
                                                 description,
                                                 status,
                                                 date,
                                                 onDelete,
                                                 onEdit,
                                                 onToggle
                                             }) => {
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case "completed":
                return "bg-green-50 text-green-500";
            default:
                return "bg-red-50 text-red-500";
        }
    };


    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg bg-gray-100/60">
            <button onClick={() => onToggle()}>
                {status == 'completed' ? (
                    <FiCheckSquare className="text-green-500" size={24}/>
                ) : (
                    <FiSquare className="text-gray-400" size={24}/>
                )}
            </button>
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-light mb-2">{date}</p>
                    <p className="text-md text-gray-700 font-medium">{title}</p>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
            </div>
            <div
                className={`flex items-center gap-2 px-3 py-1 rounded-md ${getStatusColor(
                    status
                )}`}
            >
                <h6 className="text-sm font-medium">{status}</h6>
            </div>


            <div className="flex items-center gap-3">
                <button
                    className="text-gray-400 hover:text-green-500  group-hover:opacity-100 transition-opacity cursor-pointer">
                    <FaEdit size={22} onClick={() => onEdit()}/>
                </button>
                <button
                    className="text-gray-400 hover:text-red-500  group-hover:opacity-100 transition-opacity cursor-pointer">
                    <LuTrash2 size={22} onClick={() => onDelete()}/>
                </button>
            </div>
        </div>
    );
};

export default TaskInfoCard;
