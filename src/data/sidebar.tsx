"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectProject } from "@/types/project";
import { LifeBuoy, Send, Settings2, SquareTerminal } from "lucide-react";

export const sidebardata = async (): Promise<{
  navMain: any;
  navSecondary: any;
  projects?: SelectProject[];
}> => ({
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Chat",
          url: "/dashboard/{projectId}/chat",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
});
