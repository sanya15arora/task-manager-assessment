"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import TaskOverview from "@/components/Tasks/TaskOverview";


export default function TasksPage() {

    return (
        <DashboardLayout activeMenu="Tasks">
            <div className="my-5 mx-auto">
                <TaskOverview/>
            </div>
        </DashboardLayout>
    );
}
