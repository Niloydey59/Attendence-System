"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Users, Calendar, TrendingUp } from "lucide-react";

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Courses",
      value: "8",
      description: "Active courses this semester",
      icon: BookOpen,
      trend: "+2 from last semester",
    },
    {
      title: "Total Classes",
      value: "12",
      description: "Classes across all courses",
      icon: Users,
      trend: "+3 new classes",
    },
    {
      title: "Students Enrolled",
      value: "450",
      description: "Total enrolled students",
      icon: Calendar,
      trend: "+25 this month",
    },
    {
      title: "Attendance Rate",
      value: "87%",
      description: "Average attendance rate",
      icon: TrendingUp,
      trend: "+5% from last month",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your teaching activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Create New Course</CardTitle>
            <CardDescription>
              Add a new course to your curriculum
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Take Attendance</CardTitle>
            <CardDescription>
              Start a new attendance session using facial recognition
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">View Records</CardTitle>
            <CardDescription>
              Check attendance records and analytics
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest teaching activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              "Created attendance session for CSE301 - Database Systems",
              "Updated course material for CSE401 - Software Engineering",
              "Reviewed attendance records for Section A",
              "Added new class for CSE303 - Computer Networks",
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-sm">{activity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
