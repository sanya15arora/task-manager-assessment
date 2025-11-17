import React from 'react';
import {useTasksContext} from "@/context/TaskProvider";

const Pagination = () => {

    const {
        query,
        pagination,
        setPage,
    } = useTasksContext();

    const totalPages = pagination.totalPages;

    const handlePrev = () => {
        if (query.page && query.page > 1) {
            setPage(query.page - 1);
        }
    };

    const handleNext = () => {
        if (query.page && query.page < totalPages) {
            setPage(query.page + 1);
        }
    };
    if(totalPages-1)
    return (

         <div className="flex md:w-1/2 justify-center items-center justify-self-center gap-4 mt-4">
            <button
                onClick={handlePrev}
                disabled={query.page === 1}
                className="form-btn text-center disabled:opacity-50"
            >
                Prev
            </button>

            <p>
                Page {query.page} of {totalPages}
            </p>

            <button
                onClick={handleNext}
                disabled={query.page === totalPages}
                className="form-btn text-center disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;