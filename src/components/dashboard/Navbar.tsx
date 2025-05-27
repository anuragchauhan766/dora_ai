"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Bot, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Documents", href: "/dashboard/documents" },
  { name: "Activity", href: "/dashboard/activity" },
  { name: "Usage", href: "/dashboard/usage" },
  { name: "AI Chat", href: "/dashboard/chat" },
  { name: "Settings", href: "/dashboard/settings" },
];

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
          </Link>
        </div>
        <nav className="flex items-center space-x-6 px-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-primary",
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Feedback</span>
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "size-6",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
