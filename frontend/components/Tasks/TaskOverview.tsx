import AddTask from "@/components/Tasks/AddTask";
import TaskList from "@/components/Tasks/TaskList";
import { useTasksContext } from "@/context/TaskProvider";
import Pagination from "@/components/Tasks/Pagination";
import {useEffect, useRef, useState} from "react";

const TaskOverview = () => {
    const {
        query,
        tasks,
        loading,
        setStatusFilter,
        setSearch,
    } = useTasksContext();

    const [searchQuery, setSearchQueryLocal] = useState<string>("");

    useEffect(() => {
        if (query.search) {
            setSearchQueryLocal(query.search);
        }
    }, [query.search]);

    const onSearchQueryChange = () => {
        setSearch(searchQuery || undefined);
    };

    return (
        <div className="card">
            <div className="grid grid-cols-1 gap-8">
                <AddTask />
                {!loading  &&  (tasks.length > 0  || query.search || query.status) &&(
                    <div>
                        <div className="grid grid-cols-1">
                            <h5 className="text-xl font-semibold">Task List</h5>
                            <div className="flex justify-between items-center mb-4 gap-2">
                                <div className="flex  items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="border p-2 rounded"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQueryLocal(e.target.value)}
                                />
                                <button className='btn-primary' onClick={onSearchQueryChange}>
                                    Search
                                </button>
                                </div>
                                <select
                                    className="border p-2 rounded"
                                    value={query.status || ""}
                                    onChange={(e) => setStatusFilter(e.target.value || undefined)}
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        { tasks.length > 0 ? <TaskList taskList={tasks} /> : <p> No Task Found!!</p>}
                        <Pagination/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskOverview;
