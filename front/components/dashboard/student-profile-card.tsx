"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  Users,
} from "lucide-react";
import {
  StudentProfile,
  StudentProfileUpdateRequest,
} from "@/src/types/student";
import { useToast } from "@/hooks/use-toast";

interface StudentProfileCardProps {
  profile: StudentProfile | null;
  isLoading: boolean;
  onUpdateProfile: (data: StudentProfileUpdateRequest) => Promise<void>;
}

export function StudentProfileCard({
  profile,
  isLoading,
  onUpdateProfile,
}: StudentProfileCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [formData, setFormData] = React.useState<StudentProfileUpdateRequest>(
    {}
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { toast } = useToast();

  React.useEffect(() => {
    if (profile) {
      setFormData({
        roll_number: profile.roll_number,
        department: profile.department,
        semester: profile.semester,
        batch: profile.batch,
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        roll_number: profile.roll_number,
        department: profile.department,
        semester: profile.semester,
        batch: profile.batch,
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roll_number?.trim()) {
      newErrors.roll_number = "Roll number is required";
    }

    if (!formData.department?.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.semester || formData.semester < 1 || formData.semester > 12) {
      newErrors.semester = "Semester must be between 1 and 12";
    }

    if (!formData.batch?.trim()) {
      newErrors.batch = "Batch is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdateProfile(formData);
      setIsEditing(false);
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (
    field: keyof StudentProfileUpdateRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load profile information. Please refresh the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Read-only fields */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input value={profile.username} disabled />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input value={profile.email} disabled />
              </div>

              {/* Editable fields */}
              <div className="space-y-2">
                <Label
                  htmlFor="roll_number"
                  className="flex items-center gap-2"
                >
                  <Hash className="h-4 w-4" />
                  Roll Number *
                </Label>
                <Input
                  id="roll_number"
                  value={formData.roll_number || ""}
                  onChange={(e) =>
                    handleInputChange("roll_number", e.target.value)
                  }
                  placeholder="Enter roll number"
                  className={errors.roll_number ? "border-red-500" : ""}
                />
                {errors.roll_number && (
                  <p className="text-sm text-red-500">{errors.roll_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Department *
                </Label>
                <Select
                  value={formData.department || ""}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger
                    className={errors.department ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science and Engineering">
                      Computer Science and Engineering
                    </SelectItem>
                    <SelectItem value="Electrical and Electronic Engineering">
                      Electrical and Electronic Engineering
                    </SelectItem>
                    <SelectItem value="Mechanical Engineering">
                      Mechanical Engineering
                    </SelectItem>
                    <SelectItem value="Civil Engineering">
                      Civil Engineering
                    </SelectItem>
                    <SelectItem value="Chemical Engineering">
                      Chemical Engineering
                    </SelectItem>
                    <SelectItem value="Materials Science and Engineering">
                      Materials Science and Engineering
                    </SelectItem>
                    <SelectItem value="Industrial and Production Engineering">
                      Industrial and Production Engineering
                    </SelectItem>
                    <SelectItem value="Glass and Ceramic Engineering">
                      Glass and Ceramic Engineering
                    </SelectItem>
                    <SelectItem value="Urban and Regional Planning">
                      Urban and Regional Planning
                    </SelectItem>
                    <SelectItem value="Architecture">Architecture</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Humanities">Humanities</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Semester *
                </Label>
                <Select
                  value={formData.semester?.toString() || ""}
                  onValueChange={(value) =>
                    handleInputChange("semester", parseInt(value))
                  }
                >
                  <SelectTrigger
                    className={errors.semester ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semester && (
                  <p className="text-sm text-red-500">{errors.semester}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Batch *
                </Label>
                <Input
                  id="batch"
                  value={formData.batch || ""}
                  onChange={(e) => handleInputChange("batch", e.target.value)}
                  placeholder="e.g., 2021"
                  className={errors.batch ? "border-red-500" : ""}
                />
                {errors.batch && (
                  <p className="text-sm text-red-500">{errors.batch}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating ? (
                  <Spinner size="sm" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{profile.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <Badge variant="outline" className="font-mono">
                    {profile.roll_number}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{profile.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Semester
                  </p>
                  <Badge variant="default">Semester {profile.semester}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <Badge variant="secondary">{profile.batch}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
