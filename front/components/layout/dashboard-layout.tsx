"use client";

import * as React from "react";
import { Navbar } from "./navbar";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Container className={cn("py-8", className)}>{children}</Container>
      </main>
    </div>
  );
}
