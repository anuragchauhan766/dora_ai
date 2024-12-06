"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { navitems, navSecondary } from "@/data/sidebar";
import { SelectProject } from "@/types/project";
import { NavMainItems } from "@/types/sidebar";

// Import your navigation config

interface BreadcrumbItemProps {
  projects: SelectProject[] | null;
}

const BreadcrumbCustom = ({ projects }: BreadcrumbItemProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Function to find item in navigation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findNavItem = (title: string, items: NavMainItems[] = [...navitems, ...navSecondary]): NavMainItems | null => {
    for (const item of items) {
      if (item.title.toLowerCase() === title.toLowerCase()) {
        return item;
      }
      if (item.items) {
        const found = findNavItem(title, item.items as NavMainItems[]);
        if (found) return found;
      }
    }
    return null;
  };

  // Function to check if path is a project route
  const isProjectRoute = (segments: string[]) => {
    return segments[0] === "project" && segments.length > 1;
  };

  // Build breadcrumb items
  const getBreadcrumbItems = () => {
    const items: { label: string; path: string; isLast: boolean }[] = [];
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Handle project routes
      if (isProjectRoute(pathSegments) && index === 1) {
        const projectName = projects?.find((project) => project.id === segment);
        items.push({
          label: projectName ? projectName.name : segment, // You can replace this with actual project name
          path: currentPath,
          isLast: isLast,
        });
        return;
      }

      // Handle normal routes
      const navItem = findNavItem(segment);
      const label = navItem ? navItem.title : segment.charAt(0).toUpperCase() + segment.slice(1);

      items.push({
        label,
        path: currentPath,
        isLast,
      });
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map(({ label, path, isLast }) => (
          <React.Fragment key={path}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              {isLast ? <BreadcrumbPage>{label}</BreadcrumbPage> : <BreadcrumbLink href={path}>{label}</BreadcrumbLink>}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCustom;
