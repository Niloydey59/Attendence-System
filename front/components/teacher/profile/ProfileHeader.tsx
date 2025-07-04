"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileHeader({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and preferences
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {!isEditing ? (
          <Button onClick={onEdit} className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
