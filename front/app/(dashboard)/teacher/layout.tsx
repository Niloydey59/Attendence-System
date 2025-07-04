"use client";

import React from "react";
import { TeacherSidebar } from "@/components/teacher/dashboard/TeacherSidebar";

interface TeacherDashboardLayoutProps {
  children: React.ReactNode;
}

export default function TeacherDashboardLayout({
  children,
}: TeacherDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />

      {/* Main content area with proper spacing for navbar (from root layout) and sidebar */}
      <main className="pt-16 lg:pl-64">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
