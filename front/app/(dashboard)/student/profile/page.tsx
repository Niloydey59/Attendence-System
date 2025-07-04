"use client";

import * as React from "react";
import { ProfileCard } from "@/components/student/profile/ProfileCard";
import { ProfileGuidelines } from "@/components/student/profile/ProfileGuidelines";
import { User } from "lucide-react";
import {
  getStudentProfile,
  partialUpdateStudentProfile,
} from "@/src/services/features/studentService";
import {
  StudentProfile,
  StudentProfileUpdateRequest,
} from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";

export default function StudentProfilePage() {
  const [profile, setProfile] = React.useState<StudentProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const { toast } = useToast();

  const loadProfile = React.useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      const response = await getStudentProfile();
      setProfile(response.data);
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description:
          error instanceof Error
            ? error.message
            : "Could not fetch your profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileUpdate = async (data: StudentProfileUpdateRequest) => {
    try {
      const response = await partialUpdateStudentProfile(data);
      setProfile(response.data);
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-6 w-6" />
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and update your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProfileCard
            profile={profile}
            isLoading={isLoadingProfile}
            onUpdateProfile={handleProfileUpdate}
          />
        </div>

        <div className="space-y-6">
          <ProfileGuidelines />
        </div>
      </div>
    </div>
  );
}
