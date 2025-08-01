"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { StudentSidebar } from "@/components/student/dashboard/StudentSidebar";
import { isAuthenticated } from "@/src/services/features/authService";

interface StudentDashboardLayoutProps {
  children: React.ReactNode;
}

export default function StudentDashboardLayout({
  children,
}: StudentDashboardLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.warn("User is not authenticated, redirecting to login.");
      router.push("/login");
      return;
    }

    // Check if user is a student
    const userRole = localStorage.getItem("user_role");
    if (userRole !== "STUDENT") {
      router.push("/"); // Redirect to home or appropriate page
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />

      {/* Main content area with proper spacing for navbar (from root layout) and sidebar */}
      <main className="pt-16 lg:pl-64">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
