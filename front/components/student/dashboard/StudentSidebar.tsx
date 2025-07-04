"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Calendar,
  UserCheck,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function StudentSidebar() {
  const [open, setOpen] = React.useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "My Profile",
      href: "/student/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Face Images",
      href: "/student/face-images",
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      title: "My Classes",
      href: "/student/classes",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Attendance",
      href: "/student/attendance",
      icon: <Calendar className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mt-12">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Student Dashboard</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                <SidebarNav items={navItems} />
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden lg:flex lg:w-64 lg:flex-col">
        {/* Sidebar container */}
        <div className="flex flex-col flex-grow border-r bg-background pt-16">
          <div className="flex flex-col flex-grow px-4 pt-6 pb-4">
            <div className="flex-1 space-y-1">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-3 text-lg font-semibold tracking-tight">
                  Student Dashboard
                </h2>
              </div>
              <SidebarNav items={navItems} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
