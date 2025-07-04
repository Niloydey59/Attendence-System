"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createCourse } from "@/src/services/features/teacherService";
import { Course, CourseCreateRequest } from "@/src/types/teacher";

const courseSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Course code must be at least 2 characters" })
    .max(10, { message: "Course code must not exceed 10 characters" }),
  name: z
    .string()
    .min(3, { message: "Course name must be at least 3 characters" })
    .max(100, { message: "Course name must not exceed 100 characters" }),
  semester: z
    .number()
    .int()
    .min(1, { message: "Semester must be at least 1" })
    .max(12, { message: "Semester must not exceed 12" }),
  credits: z
    .number()
    .min(0.5, { message: "Credits must be at least 0.5" })
    .max(6, { message: "Credits must not exceed 6" }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseCreateProps {
  onSuccess: (course: Course) => void;
}

export function CourseCreate({ onSuccess }: CourseCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      name: "",
      semester: 1,
      credits: 3,
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const courseData: CourseCreateRequest = {
        code: values.code,
        name: values.name,
        semester: values.semester,
        credits: values.credits,
      };

      const response = await createCourse(courseData);
      onSuccess(response.data);
    } catch (error) {
      console.error("Failed to create course:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create course. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create New Course</h2>
        <p className="text-sm text-muted-foreground">
          Add a new course to your teaching portfolio
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="CSE301" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the official course code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Database Systems" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the full name of the course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" size="sm" />}
              Create Course
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CourseCreate;
