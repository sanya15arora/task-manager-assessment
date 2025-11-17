"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import TaskOverview from "@/components/Tasks/TaskOverview";
import ProtectedPage from "@/components/ProtectedPage";

export default function TasksPage() {

    return (
        <ProtectedPage>
        <DashboardLayout activeMenu="Tasks">
            <div className="my-5 mx-auto">
                <TaskOverview/>
            </div>
        </DashboardLayout>
        </ProtectedPage>
    );
}
