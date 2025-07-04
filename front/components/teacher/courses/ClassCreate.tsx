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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClass } from "@/src/services/features/teacherService";
import { Course, Class, ClassCreateRequest } from "@/src/types/teacher";

const classSchema = z.object({
  course_id: z.number({
    required_error: "Please select a course",
  }),
  section: z
    .string()
    .min(1, { message: "Section is required" })
    .max(10, { message: "Section must not exceed 10 characters" }),
  batch: z
    .string()
    .min(1, { message: "Batch is required" })
    .max(10, { message: "Batch must not exceed 10 characters" }),
  semester: z
    .number()
    .int()
    .min(1, { message: "Semester must be at least 1" })
    .max(12, { message: "Semester must not exceed 12" }),
  academic_year: z
    .string()
    .min(4, { message: "Academic year is required" })
    .max(9, { message: "Invalid academic year format" }),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassCreateProps {
  courses: Course[];
  onSuccess: (classData: Class) => void;
}

export function ClassCreate({ courses, onSuccess }: ClassCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const academicYearOptions = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ];

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      course_id: undefined,
      section: "",
      batch: "",
      semester: 1,
      academic_year: `${currentYear}-${currentYear + 1}`,
    },
  });

  const onSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const classData: ClassCreateRequest = {
        course_id: values.course_id,
        section: values.section,
        batch: values.batch,
        semester: values.semester,
        academic_year: values.academic_year,
      };

      const response = await createClass(classData);
      onSuccess(response.data);
    } catch (error) {
      console.error("Failed to create class:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create class. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create New Class</h2>
        <p className="text-sm text-muted-foreground">
          Create a new class section for a course
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            You need to create a course before creating a class.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id.toString()}
                        >
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the course for this class section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input placeholder="A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <FormControl>
                      <Input placeholder="2021" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2" size="sm" />}
                Create Class
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ClassCreate;
