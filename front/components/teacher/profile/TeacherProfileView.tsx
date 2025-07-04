"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getTeacherProfile,
  updateTeacherProfile,
} from "@/src/services/features/teacherService";
import {
  TeacherProfile,
  TeacherProfileUpdateRequest,
} from "@/src/types/teacher";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { PersonalInformationCard } from "./PersonalInformationCard";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function TeacherProfileView() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<TeacherProfile | null>(null);
  const [editData, setEditData] = useState<TeacherProfileUpdateRequest>({});
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTeacherProfile();
      setProfileData(response.data);
      // Initialize edit data with current profile data
      setEditData({
        employee_id: response.data.employee_id,
        department: response.data.department,
        designation: response.data.designation,
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Failed to load profile data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    if (!profileData) return;

    setIsEditing(false);
    setError(null);
    // Reset edit data to original values
    setEditData({
      employee_id: profileData.employee_id,
      department: profileData.department,
      designation: profileData.designation,
    });
  };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await updateTeacherProfile(editData);
      setProfileData(response.data);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof TeacherProfileUpdateRequest,
    value: string
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button onClick={loadProfile} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <ProfileHeader
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        <PersonalInformationCard
          profileData={profileData}
          editData={editData}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
