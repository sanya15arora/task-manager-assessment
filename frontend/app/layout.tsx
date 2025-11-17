import type {Metadata} from "next";
import "./globals.css";
import {AuthProvider} from "@/context/AuthProvider";
import {Toaster} from "react-hot-toast";
import React from "react";
import {TasksProvider} from "@/context/TaskProvider";


export const metadata: Metadata = {
    title: "Task Manager App",
    description: "Task Manager App Assessment",
};


export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <TasksProvider>
                {children}
                <Toaster position="top-right"/>
            </TasksProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
