"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TeacherProfile,
  TeacherProfileUpdateRequest,
} from "@/src/types/teacher";
import { User, Mail, IdCard, Building, GraduationCap } from "lucide-react";

interface PersonalInformationCardProps {
  profileData: TeacherProfile;
  editData: TeacherProfileUpdateRequest;
  isEditing: boolean;
  onChange: (field: keyof TeacherProfileUpdateRequest, value: string) => void;
}

const ENGINEERING_DEPARTMENTS = [
  "Computer Science and Engineering",
  "Electrical and Electronic Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electronics and Communication Engineering",
  "Industrial and Production Engineering",
  "Aerospace Engineering",
  "Biomedical Engineering",
  "Environmental Engineering",
  "Materials Science and Engineering",
  "Software Engineering",
  "Information Technology",
  "Petroleum Engineering",
  "Mining Engineering",
  "Marine Engineering",
  "Agricultural Engineering",
  "Textile Engineering",
];

const DESIGNATIONS = [
  "Lecturer",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Adjunct Professor",
  "Senior Lecturer",
  "Principal Lecturer",
  "Professor Emeritus",
  "Research Professor",
  "Clinical Professor",
  "Visiting Professor",
  "Department Head",
  "Dean",
  "Vice Chancellor",
  "Provost",
];

export function PersonalInformationCard({
  profileData,
  editData,
  isEditing,
  onChange,
}: PersonalInformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Username - Read only */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Username
          </Label>
          <Input
            id="username"
            value={profileData.username}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Email - Read only */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Employee ID */}
        <div className="space-y-2">
          <Label htmlFor="employee_id" className="flex items-center gap-2">
            <IdCard className="h-4 w-4" />
            Employee ID
          </Label>
          <Input
            id="employee_id"
            value={
              isEditing ? editData.employee_id || "" : profileData.employee_id
            }
            onChange={(e) => onChange("employee_id", e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
            placeholder="Enter employee ID"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Department
          </Label>
          {isEditing ? (
            <Select
              value={editData.department || ""}
              onValueChange={(value) => onChange("department", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {ENGINEERING_DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="department"
              value={profileData.department}
              disabled
              className="bg-muted"
            />
          )}
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Designation
          </Label>
          {isEditing ? (
            <Select
              value={editData.designation || ""}
              onValueChange={(value) => onChange("designation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {DESIGNATIONS.map((designation) => (
                  <SelectItem key={designation} value={designation}>
                    {designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="designation"
              value={profileData.designation}
              disabled
              className="bg-muted"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
