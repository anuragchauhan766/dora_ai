"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useParams } from "next/navigation";
const projectNavItems = [
  { name: "Overview", path: "" },
  { name: "Chat", path: "/chat" },
  { name: "Documents", path: "/documents" },
  { name: "Training", path: "/training" },
  { name: "Settings", path: "/settings" },
];
function ProjectNavar() {
  const { projectId } = useParams();

  return (
    <NavigationMenu className="w-full max-w-none justify-start border-b">
      <NavigationMenuList>
        {projectNavItems.map((item) => {
          const href = `/project/${projectId}${item.path}`;

          return (
            <NavigationMenuItem key={item.name}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.name}</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default ProjectNavar;
